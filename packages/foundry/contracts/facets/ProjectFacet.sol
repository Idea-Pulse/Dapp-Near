// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../libraries/ProjectCounters.sol";
import "./AccessControlFacet.sol";

contract ProjectFacet {
    using ProjectCounters for ProjectCounters.Counter;

    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.projects.storage");

    struct Project {
        uint256 id;
        address creator;
        string title;
        string description;
        string[] tags;
        ProjectMetadata metadata;
        ProjectStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct ProjectMetadata {
        string aiEvaluation;
        uint256 marketScore;
        string techFeasibility;
        uint256 minValuation;
        uint256 maxValuation;
    }

    enum ProjectStatus {
        Draft,
        Active,
        Funded,
        Completed,
        Failed,
        Cancelled
    }

    struct DiamondStorage {
        ProjectCounters.Counter projectIds;
        mapping(uint256 => Project) projects;
        mapping(address => uint256[]) userProjects;
    }

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        string title,
        uint256 timestamp
    );
    event ProjectUpdated(
        uint256 indexed projectId,
        string title,
        ProjectStatus status,
        uint256 timestamp
    );
    event ProjectStatusChanged(
        uint256 indexed projectId,
        ProjectStatus oldStatus,
        ProjectStatus newStatus
    );

    modifier onlyProjectCreator() {
        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            accessControl.hasRole(accessControl.PROJECT_CREATOR_ROLE(), msg.sender) ||
            accessControl.isAdmin(msg.sender),
            "ProjectFacet: caller is not a project creator"
        );
        _;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function createProject(
        string calldata title,
        string calldata description,
        string[] calldata tags,
        ProjectMetadata calldata metadata
    ) external onlyProjectCreator returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        ds.projectIds.increment();
        uint256 newProjectId = ds.projectIds.current();

        Project storage project = ds.projects[newProjectId];
        project.id = newProjectId;
        project.creator = msg.sender;
        project.title = title;
        project.description = description;
        project.tags = tags;
        project.metadata = metadata;
        project.status = ProjectStatus.Draft;
        project.createdAt = block.timestamp;
        project.updatedAt = block.timestamp;

        ds.userProjects[msg.sender].push(newProjectId);

        emit ProjectCreated(newProjectId, msg.sender, title, block.timestamp);
        return newProjectId;
    }

    function updateProject(
        uint256 projectId,
        string calldata title,
        string calldata description,
        string[] calldata tags
    ) external {
        DiamondStorage storage ds = diamondStorage();
        Project storage project = ds.projects[projectId];

        AccessControlFacet accessControl = AccessControlFacet(address(this));
        require(
            msg.sender == project.creator ||
            accessControl.isAdmin(msg.sender),
            "Not project creator or admin"
        );

        require(project.status == ProjectStatus.Draft, "Project not in draft");

        project.title = title;
        project.description = description;
        project.tags = tags;
        project.updatedAt = block.timestamp;

        emit ProjectUpdated(projectId, title, project.status, block.timestamp);
    }

    function updateProjectMetadata(
        uint256 projectId,
        ProjectMetadata calldata metadata
    ) external {
        DiamondStorage storage ds = diamondStorage();
        Project storage project = ds.projects[projectId];
        require(msg.sender == project.creator, "Not project creator");

        project.metadata = metadata;
        project.updatedAt = block.timestamp;
    }

    function updateProjectStatus(uint256 projectId, ProjectStatus newStatus) external {
        DiamondStorage storage ds = diamondStorage();
        Project storage project = ds.projects[projectId];
        require(msg.sender == project.creator, "Not project creator");

        ProjectStatus oldStatus = project.status;
        project.status = newStatus;
        project.updatedAt = block.timestamp;

        emit ProjectStatusChanged(projectId, oldStatus, newStatus);
    }

    function isProjectOwner(uint256 projectId, address account) external view returns (bool) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projects[projectId].creator == account;
    }

    function getProject(uint256 projectId) external view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        string[] memory tags,
        ProjectMetadata memory metadata,
        ProjectStatus status,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        DiamondStorage storage ds = diamondStorage();
        Project storage project = ds.projects[projectId];
        return (
            project.id,
            project.creator,
            project.title,
            project.description,
            project.tags,
            project.metadata,
            project.status,
            project.createdAt,
            project.updatedAt
        );
    }

    function getUserProjects(address user) external view returns (uint256[] memory) {
        DiamondStorage storage ds = diamondStorage();
        return ds.userProjects[user];
    }

    function getProjectCount() external view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.projectIds.current();
    }
}