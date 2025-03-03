// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessControlFacet {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.access.control.storage");

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROJECT_CREATOR_ROLE = keccak256("PROJECT_CREATOR_ROLE");
    bytes32 public constant TASK_CREATOR_ROLE = keccak256("TASK_CREATOR_ROLE");
    bytes32 public constant FUNDING_MANAGER_ROLE = keccak256("FUNDING_MANAGER_ROLE");
    bytes32 public constant AI_AGENT_ROLE = keccak256("AI_AGENT_ROLE");

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    struct DiamondStorage {
        mapping(bytes32 => RoleData) roles;
        mapping(address => bool) isAdmin;
    }

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event AdminAdded(address indexed admin, address indexed sender);
    event AdminRemoved(address indexed admin, address indexed sender);

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    // Modifier to check if caller has a specific role
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "AccessControlFacet: caller does not have the required role");
        _;
    }

    // Modifier to check if caller is admin
    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "AccessControlFacet: caller is not admin");
        _;
    }

    // Initialize the access control system
    function initializeAccessControl(address initialAdmin) external {
        DiamondStorage storage ds = diamondStorage();
        require(!ds.isAdmin[initialAdmin], "AccessControlFacet: already initialized");

        ds.isAdmin[initialAdmin] = true;

        // Set up role admins
        ds.roles[ADMIN_ROLE].adminRole = ADMIN_ROLE;
        ds.roles[PROJECT_CREATOR_ROLE].adminRole = ADMIN_ROLE;
        ds.roles[TASK_CREATOR_ROLE].adminRole = ADMIN_ROLE;
        ds.roles[FUNDING_MANAGER_ROLE].adminRole = ADMIN_ROLE;
        ds.roles[AI_AGENT_ROLE].adminRole = ADMIN_ROLE;

        // Grant roles to initial admin
        _grantRole(ADMIN_ROLE, initialAdmin);

        emit AdminAdded(initialAdmin, msg.sender);
    }

    // Check if an account has a specific role
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return diamondStorage().roles[role].members[account];
    }

    // Check if an account is an admin
    function isAdmin(address account) public view returns (bool) {
        return diamondStorage().isAdmin[account];
    }

    // Grant a role to an account
    function grantRole(bytes32 role, address account) external onlyAdmin {
        _grantRole(role, account);
    }

    // Revoke a role from an account
    function revokeRole(bytes32 role, address account) external onlyAdmin {
        _revokeRole(role, account);
    }

    // Add a new admin
    function addAdmin(address account) external onlyAdmin {
        DiamondStorage storage ds = diamondStorage();
        require(!ds.isAdmin[account], "AccessControlFacet: account is already an admin");

        ds.isAdmin[account] = true;
        _grantRole(ADMIN_ROLE, account);

        emit AdminAdded(account, msg.sender);
    }

    // Remove an admin
    function removeAdmin(address account) external onlyAdmin {
        DiamondStorage storage ds = diamondStorage();
        require(ds.isAdmin[account], "AccessControlFacet: account is not an admin");
        require(account != msg.sender, "AccessControlFacet: cannot remove yourself as admin");

        ds.isAdmin[account] = false;
        _revokeRole(ADMIN_ROLE, account);

        emit AdminRemoved(account, msg.sender);
    }

    // Internal function to grant a role
    function _grantRole(bytes32 role, address account) internal {
        if (!hasRole(role, account)) {
            diamondStorage().roles[role].members[account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    // Internal function to revoke a role
    function _revokeRole(bytes32 role, address account) internal {
        if (hasRole(role, account)) {
            diamondStorage().roles[role].members[account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }
}