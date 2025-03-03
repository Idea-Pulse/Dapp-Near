// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AccessControlFacet.sol";

interface IProjectTokenFacet {
    function createProjectToken(
        uint256 projectId,
        string calldata name,
        string calldata symbol,
        uint256 totalSupply
    ) external;
}

// Helper library for array operations
library ArrayHelper {
    function contains(uint256[] storage arr, uint256 value) internal view returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return true;
            }
        }
        return false;
    }
}

contract CrowdfundingFacet {
    using ArrayHelper for uint256[];
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.crowdfunding.storage");

    struct FundingInfo {
        uint256 fundingGoal;
        uint256 raisedAmount;
        uint256 startTime;
        uint256 endTime;
        bool hasMetFundingGoal;
        mapping(address => uint256) contributions;
        address paymentToken; // USDC/USDT token address
        bool tokenCreated;
    }

    struct DiamondStorage {
        mapping(uint256 => FundingInfo) projectFunding;
        mapping(address => uint256[]) userContributions;
    }

    event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event FundingSuccessful(uint256 indexed projectId, uint256 totalRaised);
    event FundingFailed(uint256 indexed projectId, uint256 totalRaised);
    event RefundClaimed(uint256 indexed projectId, address indexed contributor, uint256 amount);

    modifier onlyDuringFunding(uint256 projectId) {
        DiamondStorage storage ds = diamondStorage();
        FundingInfo storage funding = ds.projectFunding[projectId];
        require(block.timestamp >= funding.startTime, "Funding not started");
        require(block.timestamp <= funding.endTime, "Funding ended");
        require(!funding.hasMetFundingGoal, "Already funded");
        _;
    }

    modifier onlyFundingManager() {
        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            accessControl.hasRole(accessControl.FUNDING_MANAGER_ROLE(), msg.sender) ||
            accessControl.isAdmin(msg.sender),
            "CrowdfundingFacet: caller is not a funding manager"
        );
        _;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function initializeFunding(
        uint256 projectId,
        uint256 fundingGoal,
        uint256 duration,
        address paymentToken
    ) external onlyFundingManager {
        DiamondStorage storage ds = diamondStorage();
        FundingInfo storage funding = ds.projectFunding[projectId];

        require(funding.startTime == 0, "Already initialized");
        require(fundingGoal > 0, "Invalid funding goal");
        require(duration > 0, "Invalid duration");
        require(paymentToken != address(0), "Invalid payment token");

        funding.fundingGoal = fundingGoal;
        funding.startTime = block.timestamp;
        funding.endTime = block.timestamp + duration;
        funding.paymentToken = paymentToken;
    }

    function contribute(uint256 projectId, uint256 amount) external onlyDuringFunding(projectId) {
        DiamondStorage storage ds = diamondStorage();
        FundingInfo storage funding = ds.projectFunding[projectId];

        require(amount > 0, "Invalid amount");

        IERC20(funding.paymentToken).transferFrom(msg.sender, address(this), amount);

        funding.contributions[msg.sender] += amount;
        funding.raisedAmount += amount;

        if (!ds.userContributions[msg.sender].contains(projectId)) {
            ds.userContributions[msg.sender].push(projectId);
        }

        emit ContributionMade(projectId, msg.sender, amount);

        if (funding.raisedAmount >= funding.fundingGoal) {
            funding.hasMetFundingGoal = true;
            emit FundingSuccessful(projectId, funding.raisedAmount);

            // Create project token if funding successful and token not yet created
            if (!funding.tokenCreated) {
                string memory projectName = "Project Token"; // This should come from project metadata
                string memory projectSymbol = "PROJ"; // This should come from project metadata
                IProjectTokenFacet(address(this)).createProjectToken(
                    projectId,
                    projectName,
                    projectSymbol,
                    funding.raisedAmount * 100 // 100 tokens per contribution unit
                );
                funding.tokenCreated = true;
            }
        }
    }

    function claimRefund(uint256 projectId) external {
        DiamondStorage storage ds = diamondStorage();
        FundingInfo storage funding = ds.projectFunding[projectId];

        require(block.timestamp > funding.endTime, "Funding period not ended");
        require(!funding.hasMetFundingGoal, "Project was funded");

        uint256 contribution = funding.contributions[msg.sender];
        require(contribution > 0, "No contribution found");

        funding.contributions[msg.sender] = 0;
        IERC20(funding.paymentToken).transfer(msg.sender, contribution);

        emit RefundClaimed(projectId, msg.sender, contribution);
    }

    function getFundingInfo(uint256 projectId) external view returns (
        uint256 fundingGoal,
        uint256 raisedAmount,
        uint256 startTime,
        uint256 endTime,
        bool hasMetFundingGoal,
        address paymentToken
    ) {
        DiamondStorage storage ds = diamondStorage();
        FundingInfo storage funding = ds.projectFunding[projectId];

        return (
            funding.fundingGoal,
            funding.raisedAmount,
            funding.startTime,
            funding.endTime,
            funding.hasMetFundingGoal,
            funding.paymentToken
        );
    }

    function getContribution(uint256 projectId, address contributor) external view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projectFunding[projectId].contributions[contributor];
    }

    function getUserContributions(address user) external view returns (uint256[] memory) {
        DiamondStorage storage ds = diamondStorage();
        return ds.userContributions[user];
    }

    function isFunded(uint256 projectId) external view returns (bool) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projectFunding[projectId].hasMetFundingGoal;
    }

    function getRaisedAmount(uint256 projectId) external view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projectFunding[projectId].raisedAmount;
    }
}