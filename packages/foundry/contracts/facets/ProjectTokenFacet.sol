// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./AccessControlFacet.sol";

// Interface to interact with CrowdfundingFacet
interface ITokenCrowdfundingFacet {
    function getContribution(uint256 projectId, address contributor) external view returns (uint256);
    function getRaisedAmount(uint256 projectId) external view returns (uint256);
}

contract ProjectTokenFacet {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.project.token.storage");

    struct TokenInfo {
        address tokenAddress;
        uint256 totalSupply;
        uint256 crowdfundingPool; // 60%
        uint256 teamPool; // 25%
        uint256 ecosystemPool; // 15%
        uint256 vestingStart;
        uint256 vestingDuration;
        mapping(address => uint256) claimedAmount;
    }

    struct DiamondStorage {
        mapping(uint256 => TokenInfo) projectTokens; // projectId => TokenInfo
        mapping(uint256 => address) projectTokenImplementations; // projectId => token contract address
    }

    event ProjectTokenCreated(uint256 indexed projectId, address indexed tokenAddress, string name, string symbol);
    event TokensClaimed(uint256 indexed projectId, address indexed beneficiary, uint256 amount);

    modifier onlyFundingManager() {
        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            accessControl.hasRole(accessControl.FUNDING_MANAGER_ROLE(), msg.sender) ||
            accessControl.isAdmin(msg.sender),
            "ProjectTokenFacet: caller is not a funding manager"
        );
        _;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    // Creates a new ERC20 token for a funded project
    function createProjectToken(
        uint256 projectId,
        string calldata name,
        string calldata symbol,
        uint256 totalSupply
    ) external {
        DiamondStorage storage ds = diamondStorage();
        require(ds.projectTokens[projectId].tokenAddress == address(0), "Token already exists");

        // Check if caller is funding manager or the crowdfunding facet itself
        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            accessControl.hasRole(accessControl.FUNDING_MANAGER_ROLE(), msg.sender) ||
            accessControl.isAdmin(msg.sender) ||
            msg.sender == address(this),
            "ProjectTokenFacet: unauthorized"
        );

        // Deploy new token contract
        ProjectToken token = new ProjectToken(name, symbol, totalSupply);

        // Store token info
        TokenInfo storage tokenInfo = ds.projectTokens[projectId];
        tokenInfo.tokenAddress = address(token);
        tokenInfo.totalSupply = totalSupply;
        tokenInfo.crowdfundingPool = (totalSupply * 60) / 100; // 60%
        tokenInfo.teamPool = (totalSupply * 25) / 100; // 25%
        tokenInfo.ecosystemPool = (totalSupply * 15) / 100; // 15%
        tokenInfo.vestingStart = block.timestamp;
        tokenInfo.vestingDuration = 180 days; // 6 months vesting

        ds.projectTokenImplementations[projectId] = address(token);

        emit ProjectTokenCreated(projectId, address(token), name, symbol);
    }

    // Claims vested tokens for a contributor
    function claimTokens(uint256 projectId) external {
        DiamondStorage storage ds = diamondStorage();
        TokenInfo storage tokenInfo = ds.projectTokens[projectId];
        require(tokenInfo.tokenAddress != address(0), "Token not created");

        // Use the interface to call CrowdfundingFacet
        ITokenCrowdfundingFacet crowdfundingFacet = ITokenCrowdfundingFacet(address(this));

        // Calculate vested amount
        uint256 contribution = crowdfundingFacet.getContribution(projectId, msg.sender);
        require(contribution > 0, "No contribution found");

        uint256 totalVestingAmount = (contribution * tokenInfo.crowdfundingPool) / crowdfundingFacet.getRaisedAmount(projectId);
        uint256 vestedAmount = _calculateVestedAmount(
            totalVestingAmount,
            block.timestamp,
            tokenInfo.vestingStart,
            tokenInfo.vestingDuration
        );

        uint256 claimableAmount = vestedAmount - tokenInfo.claimedAmount[msg.sender];
        require(claimableAmount > 0, "No tokens to claim");

        // Update claimed amount
        tokenInfo.claimedAmount[msg.sender] += claimableAmount;

        // Transfer tokens
        ProjectToken(tokenInfo.tokenAddress).transfer(msg.sender, claimableAmount);

        emit TokensClaimed(projectId, msg.sender, claimableAmount);
    }

    function _calculateVestedAmount(
        uint256 total,
        uint256 currentTime,
        uint256 startTime,
        uint256 vestingDuration
    ) private pure returns (uint256) {
        if (currentTime < startTime) {
            return 0;
        }
        if (currentTime >= startTime + vestingDuration) {
            return total;
        }
        return (total * (currentTime - startTime)) / vestingDuration;
    }

    // View functions
    function getProjectToken(uint256 projectId) external view returns (
        address tokenAddress,
        uint256 totalSupply,
        uint256 crowdfundingPool,
        uint256 teamPool,
        uint256 ecosystemPool,
        uint256 vestingStart,
        uint256 vestingDuration
    ) {
        DiamondStorage storage ds = diamondStorage();
        TokenInfo storage tokenInfo = ds.projectTokens[projectId];
        return (
            tokenInfo.tokenAddress,
            tokenInfo.totalSupply,
            tokenInfo.crowdfundingPool,
            tokenInfo.teamPool,
            tokenInfo.ecosystemPool,
            tokenInfo.vestingStart,
            tokenInfo.vestingDuration
        );
    }

    function getClaimedAmount(uint256 projectId, address account) external view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projectTokens[projectId].claimedAmount[account];
    }

    // Helper functions to get data from CrowdfundingFacet
    function getTokenContribution(uint256 projectId, address contributor) external view returns (uint256) {
        return ITokenCrowdfundingFacet(address(this)).getContribution(projectId, contributor);
    }

    function getTokenRaisedAmount(uint256 projectId) external view returns (uint256) {
        return ITokenCrowdfundingFacet(address(this)).getRaisedAmount(projectId);
    }
}

// Project Token Implementation
contract ProjectToken is ERC20, ERC20Permit {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, initialSupply);
    }
}