// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectTokenAndStaking
 * @dev 一个简单的演示合约，实现项目代币发行和质押功能
 */
contract ProjectTokenAndStaking is ERC20, Ownable {
    // 任务结构
    struct Task {
        uint256 id;
        string title;
        string description;
        uint256 stakingAmount; // 需要质押的数量
        address assignee; // 任务被分配给谁
        bool completed;
        bool rewarded;
    }

    // 质押信息
    struct StakeInfo {
        uint256 amount;
        uint256 taskId;
        uint256 timestamp;
    }

    // 存储任务
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    // 存储用户质押
    mapping(address => StakeInfo) public stakes;
    
    // 存储已完成但未获得奖励的任务
    mapping(uint256 => bool) public taskPendingReward;

    // 质押总量
    uint256 public totalStaked;

    // 奖励数量
    uint256 public rewardPerTask = 100 * 10**18; // 100 tokens

    // 事件
    event TaskCreated(uint256 taskId, string title, uint256 stakingAmount);
    event TaskAssigned(uint256 taskId, address assignee);
    event TaskCompleted(uint256 taskId, address assignee);
    event Staked(address staker, uint256 amount, uint256 taskId);
    event RewardClaimed(address staker, uint256 amount, uint256 taskId);
    event UnstakedTokens(address staker, uint256 amount);

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable() {
        // 初始铸造1,000,000代币给合约部署者
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @dev 创建一个新任务
     * @param title 任务标题
     * @param description 任务描述
     * @param stakingAmount 需要质押的代币数量
     */
    function createTask(
        string memory title,
        string memory description,
        uint256 stakingAmount
    ) external onlyOwner {
        taskCount++;
        tasks[taskCount] = Task({
            id: taskCount,
            title: title,
            description: description,
            stakingAmount: stakingAmount,
            assignee: address(0),
            completed: false,
            rewarded: false
        });

        emit TaskCreated(taskCount, title, stakingAmount);
    }

    /**
     * @dev 质押代币并接受任务
     * @param taskId 任务ID
     */
    function stakeForTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.id > 0, "Task does not exist");
        require(task.assignee == address(0), "Task already assigned");
        require(stakes[msg.sender].amount == 0, "Already staking for a task");
        
        // 检查用户是否有足够的代币
        uint256 stakeAmount = task.stakingAmount;
        require(balanceOf(msg.sender) >= stakeAmount, "Insufficient token balance");
        
        // 转移代币到合约
        _transfer(msg.sender, address(this), stakeAmount);
        
        // 更新质押信息
        stakes[msg.sender] = StakeInfo({
            amount: stakeAmount,
            taskId: taskId,
            timestamp: block.timestamp
        });
        
        // 更新任务信息
        task.assignee = msg.sender;
        
        // 更新总质押量
        totalStaked += stakeAmount;
        
        emit Staked(msg.sender, stakeAmount, taskId);
        emit TaskAssigned(taskId, msg.sender);
    }

    /**
     * @dev 标记任务为已完成（简化版，实际应该由管理员验证）
     * @param taskId 任务ID
     */
    function completeTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.id > 0, "Task does not exist");
        require(task.assignee == msg.sender, "Not assigned to this task");
        require(!task.completed, "Task already completed");
        
        // 标记任务为已完成
        task.completed = true;
        taskPendingReward[taskId] = true;
        
        emit TaskCompleted(taskId, msg.sender);
    }

    /**
     * @dev 模拟AI审计+社区投票后发放奖励
     * @param taskId 任务ID
     */
    function approveAndReward(uint256 taskId) external onlyOwner {
        Task storage task = tasks[taskId];
        require(task.id > 0, "Task does not exist");
        require(task.completed, "Task not completed");
        require(!task.rewarded, "Reward already given");
        require(taskPendingReward[taskId], "Task not pending reward");
        
        address assignee = task.assignee;
        uint256 stakeAmount = stakes[assignee].amount;
        
        // 解锁质押代币
        stakes[assignee].amount = 0;
        totalStaked -= stakeAmount;
        
        // 铸造奖励代币
        _mint(assignee, rewardPerTask);
        
        // 返还质押代币
        _transfer(address(this), assignee, stakeAmount);
        
        // 更新任务状态
        task.rewarded = true;
        taskPendingReward[taskId] = false;
        
        emit RewardClaimed(assignee, rewardPerTask, taskId);
    }

    /**
     * @dev 如果任务被拒绝或放弃，可以解绑质押的代币
     * @param taskId 任务ID
     */
    function unstakeTokens(uint256 taskId) external onlyOwner {
        Task storage task = tasks[taskId];
        require(task.id > 0, "Task does not exist");
        require(task.assignee != address(0), "Task not assigned");
        
        address assignee = task.assignee;
        uint256 stakeAmount = stakes[assignee].amount;
        
        // 更新质押信息
        stakes[assignee].amount = 0;
        totalStaked -= stakeAmount;
        
        // 返还质押代币
        _transfer(address(this), assignee, stakeAmount);
        
        // 将任务重置为未分配状态
        task.assignee = address(0);
        
        emit UnstakedTokens(assignee, stakeAmount);
    }

    /**
     * @dev 获取任务详情
     * @param taskId 任务ID
     */
    function getTask(uint256 taskId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 stakingAmount,
        address assignee,
        bool completed,
        bool rewarded
    ) {
        Task storage task = tasks[taskId];
        return (
            task.id,
            task.title,
            task.description,
            task.stakingAmount,
            task.assignee,
            task.completed,
            task.rewarded
        );
    }

    /**
     * @dev 获取用户的质押信息
     * @param staker 用户地址
     */
    function getStakeInfo(address staker) external view returns (
        uint256 amount,
        uint256 taskId,
        uint256 timestamp
    ) {
        StakeInfo storage stakeInfo = stakes[staker];
        return (
            stakeInfo.amount,
            stakeInfo.taskId,
            stakeInfo.timestamp
        );
    }

    /**
     * @dev 设置每个任务的奖励数量
     * @param amount 新的奖励数量
     */
    function setRewardPerTask(uint256 amount) external onlyOwner {
        rewardPerTask = amount;
    }
} 