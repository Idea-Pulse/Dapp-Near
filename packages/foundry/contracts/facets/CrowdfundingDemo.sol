 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CrowdfundingDemo
 * @dev 一个简单的演示合约，实现预发行代币众筹功能
 */
contract CrowdfundingDemo is Ownable {
    // 项目结构
    struct Project {
        uint256 id;
        string title;
        string description;
        string aiPrototypeUrl; // AI生成的创意原型链接
        uint256 fundingGoal;
        uint256 raisedAmount;
        uint256 tokenPrice; // 每个代币多少USDC (用wei计算)
        uint256 endTime;
        bool fundingClosed;
        address projectToken; // 项目代币地址
    }

    // 投资结构
    struct Investment {
        uint256 amount; // USDC数量
        uint256 tokensClaimable; // 可以领取的代币数量
        bool claimed; // 是否已领取代币
    }

    // 项目存储
    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    // 用户投资
    mapping(uint256 => mapping(address => Investment)) public investments;

    // USDC代币地址
    IERC20 public usdcToken;

    // 事件
    event ProjectCreated(uint256 indexed projectId, string title, uint256 fundingGoal, uint256 tokenPrice);
    event InvestmentReceived(uint256 indexed projectId, address indexed investor, uint256 amount, uint256 tokensClaimable);
    event TokensClaimed(uint256 indexed projectId, address indexed investor, uint256 amount);
    event FundingClosed(uint256 indexed projectId, uint256 totalRaised, bool successful);

    constructor(address _usdcToken) Ownable() {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev 创建一个新项目
     * @param title 项目标题
     * @param description 项目描述
     * @param aiPrototypeUrl AI生成的原型URL
     * @param fundingGoal 众筹目标金额 (USDC)
     * @param tokenPrice 每个代币的价格 (USDC)
     * @param duration 众筹持续时间(秒)
     * @param projectToken 项目代币地址
     */
    function createProject(
        string memory title,
        string memory description,
        string memory aiPrototypeUrl,
        uint256 fundingGoal,
        uint256 tokenPrice,
        uint256 duration,
        address projectToken
    ) external onlyOwner {
        require(fundingGoal > 0, "Funding goal must be greater than 0");
        require(tokenPrice > 0, "Token price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(projectToken != address(0), "Invalid project token address");

        projectCount++;
        projects[projectCount] = Project({
            id: projectCount,
            title: title,
            description: description,
            aiPrototypeUrl: aiPrototypeUrl,
            fundingGoal: fundingGoal,
            raisedAmount: 0,
            tokenPrice: tokenPrice,
            endTime: block.timestamp + duration,
            fundingClosed: false,
            projectToken: projectToken
        });

        emit ProjectCreated(projectCount, title, fundingGoal, tokenPrice);
    }

    /**
     * @dev 投资项目
     * @param projectId 项目ID
     * @param amount 投资金额 (USDC)
     */
    function invest(uint256 projectId, uint256 amount) external {
        Project storage project = projects[projectId];
        require(project.id > 0, "Project does not exist");
        require(!project.fundingClosed, "Funding closed");
        require(block.timestamp <= project.endTime, "Funding period ended");
        require(amount > 0, "Investment amount must be greater than 0");

        // 计算可以获得的代币数量
        uint256 tokensToReceive = (amount * 10**18) / project.tokenPrice;
        require(tokensToReceive > 0, "Investment too small");

        // 转移USDC到本合约
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        // 更新项目筹集金额
        project.raisedAmount += amount;

        // 更新用户投资信息
        Investment storage userInvestment = investments[projectId][msg.sender];
        userInvestment.amount += amount;
        userInvestment.tokensClaimable += tokensToReceive;

        emit InvestmentReceived(projectId, msg.sender, amount, tokensToReceive);

        // 如果达到了筹资目标，自动关闭筹资
        if (project.raisedAmount >= project.fundingGoal) {
            _closeFunding(projectId, true);
        }
    }

    /**
     * @dev 关闭项目筹资
     * @param projectId 项目ID
     */
    function closeFunding(uint256 projectId) external onlyOwner {
        Project storage project = projects[projectId];
        require(project.id > 0, "Project does not exist");
        require(!project.fundingClosed, "Funding already closed");

        bool successful = project.raisedAmount >= project.fundingGoal;
        _closeFunding(projectId, successful);
    }

    /**
     * @dev 内部函数，关闭筹资
     */
    function _closeFunding(uint256 projectId, bool successful) internal {
        Project storage project = projects[projectId];
        project.fundingClosed = true;
        
        emit FundingClosed(projectId, project.raisedAmount, successful);
    }

    /**
     * @dev 领取项目代币（筹资成功后）
     * @param projectId 项目ID
     */
    function claimTokens(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(project.id > 0, "Project does not exist");
        require(project.fundingClosed, "Funding not closed yet");
        require(project.raisedAmount >= project.fundingGoal, "Funding was not successful");

        Investment storage userInvestment = investments[projectId][msg.sender];
        require(userInvestment.tokensClaimable > 0, "No tokens to claim");
        require(!userInvestment.claimed, "Tokens already claimed");

        userInvestment.claimed = true;
        uint256 tokensToTransfer = userInvestment.tokensClaimable;

        // 从项目代币合约转账代币给用户
        IERC20 projectToken = IERC20(project.projectToken);
        require(projectToken.transfer(msg.sender, tokensToTransfer), "Token transfer failed");

        emit TokensClaimed(projectId, msg.sender, tokensToTransfer);
    }

    /**
     * @dev 提取筹集到的资金（仅限管理员）
     * @param projectId 项目ID
     * @param recipient 资金接收者
     */
    function withdrawFunds(uint256 projectId, address recipient) external onlyOwner {
        Project storage project = projects[projectId];
        require(project.id > 0, "Project does not exist");
        require(project.fundingClosed, "Funding not closed yet");
        require(project.raisedAmount >= project.fundingGoal, "Funding was not successful");

        // 转移所有USDC到指定接收者
        require(usdcToken.transfer(recipient, project.raisedAmount), "USDC transfer failed");
    }

    /**
     * @dev 获取项目信息
     */
    function getProject(uint256 projectId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory aiPrototypeUrl,
        uint256 fundingGoal,
        uint256 raisedAmount,
        uint256 tokenPrice,
        uint256 endTime,
        bool fundingClosed,
        address projectToken
    ) {
        Project storage project = projects[projectId];
        return (
            project.id,
            project.title,
            project.description,
            project.aiPrototypeUrl,
            project.fundingGoal,
            project.raisedAmount,
            project.tokenPrice,
            project.endTime,
            project.fundingClosed,
            project.projectToken
        );
    }

    /**
     * @dev 获取用户投资信息
     */
    function getInvestment(uint256 projectId, address investor) external view returns (
        uint256 amount,
        uint256 tokensClaimable,
        bool claimed
    ) {
        Investment storage userInvestment = investments[projectId][msg.sender];
        return (
            userInvestment.amount,
            userInvestment.tokensClaimable,
            userInvestment.claimed
        );
    }

    /**
     * @dev 检查众筹是否成功
     */
    function isFundingSuccessful(uint256 projectId) external view returns (bool) {
        Project storage project = projects[projectId];
        return project.fundingClosed && project.raisedAmount >= project.fundingGoal;
    }

    /**
     * @dev 检查众筹是否仍在进行
     */
    function isFundingActive(uint256 projectId) external view returns (bool) {
        Project storage project = projects[projectId];
        return !project.fundingClosed && block.timestamp <= project.endTime;
    }
}