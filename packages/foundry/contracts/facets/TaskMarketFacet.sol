// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AccessControlFacet.sol";

interface IProjectFacet {
    function isProjectOwner(uint256 projectId, address account) external view returns (bool);
}

interface ICrowdfundingFacet {
    function isFunded(uint256 projectId) external view returns (bool);
}

contract TaskMarketFacet {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.task.market.storage");

    struct Task {
        uint256 id;
        string title;
        string description;
        uint256 reward;
        uint256 deadline;
        TaskStatus status;
        string[] requiredSkills;
        uint256 estimatedHours;
        address assignee;
        uint256 createdAt;
        uint256 completedAt;
    }

    enum TaskStatus {
        Open,
        Assigned,
        InProgress,
        Completed,
        Verified,
        Cancelled
    }

    struct DiamondStorage {
        mapping(uint256 => mapping(uint256 => Task)) projectTasks; // projectId => taskId => Task
        mapping(uint256 => uint256) projectTaskCount; // projectId => task count
        mapping(address => uint256[]) userAssignedTasks; // user => taskIds
        mapping(uint256 => mapping(uint256 => mapping(address => bool))) taskApplications; // projectId => taskId => user => applied
        address paymentToken; // USDC/USDT token address for rewards
    }

    event TaskCreated(
        uint256 indexed projectId,
        uint256 indexed taskId,
        string title,
        uint256 reward,
        string[] requiredSkills
    );
    event TaskUpdated(uint256 indexed projectId, uint256 indexed taskId, TaskStatus status);
    event TaskAssigned(uint256 indexed projectId, uint256 indexed taskId, address indexed assignee);
    event TaskCompleted(uint256 indexed projectId, uint256 indexed taskId, address indexed assignee);
    event TaskVerified(uint256 indexed projectId, uint256 indexed taskId, uint256 reward);
    event TaskApplicationSubmitted(uint256 indexed projectId, uint256 indexed taskId, address indexed applicant);

    modifier onlyProjectOwner(uint256 projectId) {
        require(
            IProjectFacet(address(this)).isProjectOwner(projectId, msg.sender),
            "Not project owner"
        );
        _;
    }

    modifier taskExists(uint256 projectId, uint256 taskId) {
        require(taskId < diamondStorage().projectTaskCount[projectId], "Task does not exist");
        _;
    }

    modifier onlyTaskCreator() {
        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            accessControl.hasRole(accessControl.TASK_CREATOR_ROLE(), msg.sender) ||
            accessControl.isAdmin(msg.sender) ||
            accessControl.hasRole(accessControl.AI_AGENT_ROLE(), msg.sender),
            "TaskMarketFacet: caller is not a task creator"
        );
        _;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function initialize(address _paymentToken) external {
        DiamondStorage storage ds = diamondStorage();
        require(ds.paymentToken == address(0), "Already initialized");
        require(_paymentToken != address(0), "Invalid payment token");
        ds.paymentToken = _paymentToken;
    }

    function createTask(
        uint256 projectId,
        string calldata title,
        string calldata description,
        uint256 reward,
        uint256 deadline,
        string[] calldata requiredSkills,
        uint256 estimatedHours
    ) external onlyTaskCreator returns (uint256) {
        require(ICrowdfundingFacet(address(this)).isFunded(projectId), "Project not funded");

        DiamondStorage storage ds = diamondStorage();
        uint256 taskId = ds.projectTaskCount[projectId];

        Task memory newTask = Task({
            id: taskId,
            title: title,
            description: description,
            reward: reward,
            deadline: deadline,
            status: TaskStatus.Open,
            requiredSkills: requiredSkills,
            estimatedHours: estimatedHours,
            assignee: address(0),
            createdAt: block.timestamp,
            completedAt: 0
        });

        ds.projectTasks[projectId][taskId] = newTask;
        ds.projectTaskCount[projectId]++;

        emit TaskCreated(projectId, taskId, title, reward, requiredSkills);
        return taskId;
    }

    function applyForTask(uint256 projectId, uint256 taskId)
        external
        taskExists(projectId, taskId)
    {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        require(task.status == TaskStatus.Open, "Task not available");
        require(!ds.taskApplications[projectId][taskId][msg.sender], "Already applied");

        ds.taskApplications[projectId][taskId][msg.sender] = true;
        emit TaskApplicationSubmitted(projectId, taskId, msg.sender);
    }

    function assignTask(
        uint256 projectId,
        uint256 taskId,
        address assignee
    ) external onlyProjectOwner(projectId) taskExists(projectId, taskId) {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        require(task.status == TaskStatus.Open, "Task not available");
        require(ds.taskApplications[projectId][taskId][assignee], "User has not applied");

        task.status = TaskStatus.Assigned;
        task.assignee = assignee;
        ds.userAssignedTasks[assignee].push(taskId);

        emit TaskAssigned(projectId, taskId, assignee);
    }

    function startTask(uint256 projectId, uint256 taskId)
        external
        taskExists(projectId, taskId)
    {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        require(task.assignee == msg.sender, "Not assigned to this task");
        require(task.status == TaskStatus.Assigned, "Task not in assigned state");

        task.status = TaskStatus.InProgress;
        emit TaskUpdated(projectId, taskId, TaskStatus.InProgress);
    }

    function completeTask(uint256 projectId, uint256 taskId)
        external
        taskExists(projectId, taskId)
    {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        require(task.assignee == msg.sender, "Not assigned to this task");
        require(task.status == TaskStatus.InProgress, "Task not in progress");

        task.status = TaskStatus.Completed;
        task.completedAt = block.timestamp;
        emit TaskCompleted(projectId, taskId, msg.sender);
    }

    function verifyTask(uint256 projectId, uint256 taskId)
        external
        onlyProjectOwner(projectId)
        taskExists(projectId, taskId)
    {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        require(task.status == TaskStatus.Completed, "Task not completed");

        task.status = TaskStatus.Verified;

        // Transfer reward to assignee
        IERC20(ds.paymentToken).transfer(task.assignee, task.reward);

        emit TaskVerified(projectId, taskId, task.reward);
    }

    // View functions
    function getTask(uint256 projectId, uint256 taskId)
        external
        view
        taskExists(projectId, taskId)
        returns (
            string memory title,
            string memory description,
            uint256 reward,
            uint256 deadline,
            TaskStatus status,
            string[] memory requiredSkills,
            uint256 estimatedHours,
            address assignee,
            uint256 createdAt,
            uint256 completedAt
        )
    {
        DiamondStorage storage ds = diamondStorage();
        Task storage task = ds.projectTasks[projectId][taskId];

        return (
            task.title,
            task.description,
            task.reward,
            task.deadline,
            task.status,
            task.requiredSkills,
            task.estimatedHours,
            task.assignee,
            task.createdAt,
            task.completedAt
        );
    }

    function getProjectTaskCount(uint256 projectId) external view returns (uint256) {
        return diamondStorage().projectTaskCount[projectId];
    }

    function getUserTasks(address user) external view returns (uint256[] memory) {
        return diamondStorage().userAssignedTasks[user];
    }

    function hasApplied(uint256 projectId, uint256 taskId, address user) external view returns (bool) {
        return diamondStorage().taskApplications[projectId][taskId][user];
    }
}