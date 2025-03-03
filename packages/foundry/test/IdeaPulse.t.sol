// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// Enable ABIEncoderV2 to handle complex return types
pragma experimental ABIEncoderV2;

import "forge-std/Test.sol";
import "../contracts/core/Diamond.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/AccessControlFacet.sol";
import "../contracts/facets/ProjectFacet.sol";
import "../contracts/facets/CrowdfundingFacet.sol";
import "../contracts/facets/ProjectTokenFacet.sol";
import "../contracts/facets/TaskMarketFacet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract IdeaPulseTest is Test {
    Diamond diamond;
    DiamondCutFacet diamondCutFacet;
    AccessControlFacet accessControl;
    ProjectFacet projectFacet;
    CrowdfundingFacet crowdfundingFacet;
    ProjectTokenFacet projectTokenFacet;
    TaskMarketFacet taskMarketFacet;

    address admin = address(1);
    address projectCreator = address(2);
    address funder1 = address(3);
    address funder2 = address(4);
    address taskCreator = address(5);
    address developer = address(6);

    MockToken mockToken;

    function setUp() public {
        // Deploy mock token
        mockToken = new MockToken();

        // Fund accounts
        mockToken.transfer(funder1, 10000 * 10**18);
        mockToken.transfer(funder2, 10000 * 10**18);

        // Deploy diamond and facets
        diamondCutFacet = new DiamondCutFacet();
        diamond = new Diamond(admin, address(diamondCutFacet));

        // Deploy facets
        accessControl = new AccessControlFacet();
        projectFacet = new ProjectFacet();
        crowdfundingFacet = new CrowdfundingFacet();
        projectTokenFacet = new ProjectTokenFacet();
        taskMarketFacet = new TaskMarketFacet();

        // Add facets to diamond
        IDiamondCut.FacetCut[] memory cuts = new IDiamondCut.FacetCut[](5);

        // AccessControlFacet
        bytes4[] memory accessControlSelectors = new bytes4[](12);
        accessControlSelectors[0] = AccessControlFacet.initializeAccessControl.selector;
        accessControlSelectors[1] = AccessControlFacet.hasRole.selector;
        accessControlSelectors[2] = AccessControlFacet.isAdmin.selector;
        accessControlSelectors[3] = AccessControlFacet.grantRole.selector;
        accessControlSelectors[4] = AccessControlFacet.revokeRole.selector;
        accessControlSelectors[5] = AccessControlFacet.addAdmin.selector;
        accessControlSelectors[6] = AccessControlFacet.removeAdmin.selector;
        // Using keccak256 for constant functions
        accessControlSelectors[7] = bytes4(keccak256("ADMIN_ROLE()"));
        accessControlSelectors[8] = bytes4(keccak256("PROJECT_CREATOR_ROLE()"));
        accessControlSelectors[9] = bytes4(keccak256("TASK_CREATOR_ROLE()"));
        accessControlSelectors[10] = bytes4(keccak256("FUNDING_MANAGER_ROLE()"));
        accessControlSelectors[11] = bytes4(keccak256("AI_AGENT_ROLE()"));

        cuts[0] = IDiamondCut.FacetCut({
            facetAddress: address(accessControl),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: accessControlSelectors
        });

        // ProjectFacet
        bytes4[] memory projectSelectors = new bytes4[](8);
        projectSelectors[0] = ProjectFacet.createProject.selector;
        projectSelectors[1] = ProjectFacet.updateProject.selector;
        projectSelectors[2] = ProjectFacet.updateProjectMetadata.selector;
        projectSelectors[3] = ProjectFacet.updateProjectStatus.selector;
        projectSelectors[4] = ProjectFacet.isProjectOwner.selector;
        projectSelectors[5] = ProjectFacet.getProject.selector;
        projectSelectors[6] = ProjectFacet.getUserProjects.selector;
        projectSelectors[7] = ProjectFacet.getProjectCount.selector;

        cuts[1] = IDiamondCut.FacetCut({
            facetAddress: address(projectFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: projectSelectors
        });

        // CrowdfundingFacet
        bytes4[] memory crowdfundingSelectors = new bytes4[](8);
        crowdfundingSelectors[0] = CrowdfundingFacet.initializeFunding.selector;
        crowdfundingSelectors[1] = CrowdfundingFacet.contribute.selector;
        crowdfundingSelectors[2] = CrowdfundingFacet.claimRefund.selector;
        crowdfundingSelectors[3] = CrowdfundingFacet.getFundingInfo.selector;
        crowdfundingSelectors[4] = CrowdfundingFacet.getContribution.selector;
        crowdfundingSelectors[5] = CrowdfundingFacet.getUserContributions.selector;
        crowdfundingSelectors[6] = CrowdfundingFacet.isFunded.selector;
        crowdfundingSelectors[7] = CrowdfundingFacet.getRaisedAmount.selector;

        cuts[2] = IDiamondCut.FacetCut({
            facetAddress: address(crowdfundingFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: crowdfundingSelectors
        });

        // ProjectTokenFacet
        bytes4[] memory projectTokenSelectors = new bytes4[](4);
        projectTokenSelectors[0] = ProjectTokenFacet.createProjectToken.selector;
        projectTokenSelectors[1] = ProjectTokenFacet.claimTokens.selector;
        projectTokenSelectors[2] = ProjectTokenFacet.getProjectToken.selector;
        projectTokenSelectors[3] = ProjectTokenFacet.getClaimedAmount.selector;

        cuts[3] = IDiamondCut.FacetCut({
            facetAddress: address(projectTokenFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: projectTokenSelectors
        });

        // TaskMarketFacet
        bytes4[] memory taskMarketSelectors = new bytes4[](11);
        taskMarketSelectors[0] = TaskMarketFacet.initialize.selector;
        taskMarketSelectors[1] = TaskMarketFacet.createTask.selector;
        taskMarketSelectors[2] = TaskMarketFacet.applyForTask.selector;
        taskMarketSelectors[3] = TaskMarketFacet.assignTask.selector;
        taskMarketSelectors[4] = TaskMarketFacet.startTask.selector;
        taskMarketSelectors[5] = TaskMarketFacet.completeTask.selector;
        taskMarketSelectors[6] = TaskMarketFacet.verifyTask.selector;
        taskMarketSelectors[7] = TaskMarketFacet.getTask.selector;
        taskMarketSelectors[8] = TaskMarketFacet.getProjectTaskCount.selector;
        taskMarketSelectors[9] = TaskMarketFacet.getUserTasks.selector;
        taskMarketSelectors[10] = TaskMarketFacet.hasApplied.selector;

        cuts[4] = IDiamondCut.FacetCut({
            facetAddress: address(taskMarketFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: taskMarketSelectors
        });

        // Execute diamond cut
        vm.prank(admin);
        DiamondCutFacet(address(diamond)).diamondCut(cuts, address(0), "");

        // Initialize contract
        vm.startPrank(admin);
        AccessControlFacet(address(diamond)).initializeAccessControl(admin);

        // Grant roles
        AccessControlFacet(address(diamond)).grantRole(
            AccessControlFacet(address(diamond)).PROJECT_CREATOR_ROLE(),
            projectCreator
        );
        AccessControlFacet(address(diamond)).grantRole(
            AccessControlFacet(address(diamond)).TASK_CREATOR_ROLE(),
            taskCreator
        );
        AccessControlFacet(address(diamond)).grantRole(
            AccessControlFacet(address(diamond)).FUNDING_MANAGER_ROLE(),
            admin
        );

        // Initialize task market
        TaskMarketFacet(address(diamond)).initialize(address(mockToken));
        vm.stopPrank();
    }

    function testCreateProject() public {
        vm.startPrank(projectCreator);

        string[] memory tags = new string[](2);
        tags[0] = "DeFi";
        tags[1] = "NFT";

        ProjectFacet.ProjectMetadata memory metadata = ProjectFacet.ProjectMetadata({
            aiEvaluation: "Good project with potential",
            marketScore: 8,
            techFeasibility: "A",
            minValuation: 1000000,
            maxValuation: 2000000
        });

        uint256 projectId = ProjectFacet(address(diamond)).createProject(
            "Test Project",
            "This is a test project description",
            tags,
            metadata
        );

        assertEq(projectId, 1);

        // Verify project details
        (
            uint256 id,
            address creator,
            string memory title,
            ,
            ,
            ,
            ProjectFacet.ProjectStatus status,
            ,

        ) = ProjectFacet(address(diamond)).getProject(projectId);

        assertEq(id, 1);
        assertEq(creator, projectCreator);
        assertEq(title, "Test Project");
        assertEq(uint(status), uint(ProjectFacet.ProjectStatus.Draft));

        vm.stopPrank();
    }

    function testInitializeFunding() public {
        // First create a project
        testCreateProject();

        vm.startPrank(admin);
        // Initialize funding
        CrowdfundingFacet(address(diamond)).initializeFunding(
            1, // project ID
            5000 * 10**18, // 5000 tokens funding goal
            7 days, // 7 days duration
            address(mockToken) // payment token
        );

        // Verify funding details
        (
            uint256 fundingGoal,
            uint256 raisedAmount,
            uint256 startTime,
            uint256 endTime,
            bool isFunded,
            address paymentToken
        ) = CrowdfundingFacet(address(diamond)).getFundingInfo(1);

        assertEq(fundingGoal, 5000 * 10**18);
        assertEq(raisedAmount, 0);
        assertEq(startTime, block.timestamp);
        assertEq(endTime, block.timestamp + 7 days);
        assertEq(isFunded, false);
        assertEq(paymentToken, address(mockToken));

        vm.stopPrank();
    }

    function testContributeToProject() public {
        // Initialize project and funding
        testInitializeFunding();

        // Funder1 contributes
        vm.startPrank(funder1);
        mockToken.approve(address(diamond), 3000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(1, 3000 * 10**18);
        vm.stopPrank();

        // Verify contribution
        assertEq(
            CrowdfundingFacet(address(diamond)).getContribution(1, funder1),
            3000 * 10**18
        );

        // Funder2 contributes to reach goal
        vm.startPrank(funder2);
        mockToken.approve(address(diamond), 2000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(1, 2000 * 10**18);
        vm.stopPrank();

        // Verify funding is successful
        (
            ,
            uint256 raisedAmount,
            ,
            ,
            bool isFunded,

        ) = CrowdfundingFacet(address(diamond)).getFundingInfo(1);

        assertEq(raisedAmount, 5000 * 10**18);
        assertEq(isFunded, true);

        // Check if project token was created
        (
            address tokenAddress,
            ,
            ,
            ,
            ,
            ,

        ) = ProjectTokenFacet(address(diamond)).getProjectToken(1);

        assertTrue(tokenAddress != address(0));
    }

    function testCreateAndAssignTask() public {
        // Make sure we have a funded project
        testContributeToProject();

        // Create a task
        vm.startPrank(taskCreator);

        string[] memory skills = new string[](2);
        skills[0] = "Solidity";
        skills[1] = "Next.js";

        uint256 taskId = TaskMarketFacet(address(diamond)).createTask(
            1, // Project ID
            "Frontend Development",
            "Create the project dashboard",
            500 * 10**18, // 500 tokens reward
            block.timestamp + 30 days, // Deadline
            skills,
            40 // 40 hours estimated time
        );

        assertEq(taskId, 0); // First task should have ID 0

        vm.stopPrank();

        // Developer applies for task
        vm.startPrank(developer);
        TaskMarketFacet(address(diamond)).applyForTask(1, 0);
        vm.stopPrank();

        // Project owner assigns task
        vm.startPrank(projectCreator);
        TaskMarketFacet(address(diamond)).assignTask(1, 0, developer);
        vm.stopPrank();

        // Verify task assignment
        (
            ,
            ,
            ,
            ,
            TaskMarketFacet.TaskStatus status,
            ,
            ,
            address assignee,
            ,

        ) = TaskMarketFacet(address(diamond)).getTask(1, 0);

        assertEq(uint(status), uint(TaskMarketFacet.TaskStatus.Assigned));
        assertEq(assignee, developer);
    }

    function testCompleteAndVerifyTask() public {
        // Make sure we have an assigned task
        testCreateAndAssignTask();

        // Developer starts and completes the task
        vm.startPrank(developer);
        TaskMarketFacet(address(diamond)).startTask(1, 0);
        vm.warp(block.timestamp + 7 days); // 7 days later
        TaskMarketFacet(address(diamond)).completeTask(1, 0);
        vm.stopPrank();

        // Verify task status
        (
            ,
            ,
            ,
            ,
            TaskMarketFacet.TaskStatus statusAfter,
            ,
            ,
            ,
            ,
            uint256 completedAt
        ) = TaskMarketFacet(address(diamond)).getTask(1, 0);

        assertEq(uint(statusAfter), uint(TaskMarketFacet.TaskStatus.Completed));
        assertEq(completedAt, block.timestamp);

        // Project owner verifies the task
        uint256 developerBalanceBefore = mockToken.balanceOf(developer);

        vm.startPrank(projectCreator);
        TaskMarketFacet(address(diamond)).verifyTask(1, 0);
        vm.stopPrank();

        // Verify task payment
        uint256 developerBalanceAfter = mockToken.balanceOf(developer);

        assertEq(developerBalanceAfter - developerBalanceBefore, 500 * 10**18);

        // Verify task status
        (
            ,
            ,
            ,
            ,
            TaskMarketFacet.TaskStatus statusAfterAfter,
            ,
            ,
            ,
            ,

        ) = TaskMarketFacet(address(diamond)).getTask(1, 0);

        assertEq(uint(statusAfterAfter), uint(TaskMarketFacet.TaskStatus.Verified));
    }

    function testClaimProjectTokens() public {
        // Make sure we have a funded project
        testContributeToProject();

        // Fast forward to when some tokens are vested
        vm.warp(block.timestamp + 90 days); // 90 days later (halfway through vesting)

        uint256 contribution = CrowdfundingFacet(address(diamond)).getContribution(1, funder1);

        // Calculate expected token amount for funder1
        uint256 totalRaised = CrowdfundingFacet(address(diamond)).getRaisedAmount(1);
        (
            address tokenAddress,
            ,
            uint256 crowdfundingPool,
            ,
            ,
            ,

        ) = ProjectTokenFacet(address(diamond)).getProjectToken(1);
        uint256 expectedTotalTokens = (contribution * crowdfundingPool) / totalRaised;

        // Halfway through vesting, should be able to claim ~50%
        uint256 expectedClaimable = expectedTotalTokens / 2;

        // Claim tokens for funder1
        vm.startPrank(funder1);
        ProjectTokenFacet(address(diamond)).claimTokens(1);
        vm.stopPrank();

        // 在claim操作后获取claimed金额
        uint256 claimed = ProjectTokenFacet(address(diamond)).getClaimedAmount(1, funder1);

        // Verify claimed amount is approximately 50% (allow small variance due to block timestamps)
        assertApproxEqRel(claimed, expectedClaimable, 0.05e18); // 5% tolerance

        // Check token balance of funder1
        uint256 tokenBalance = IERC20(tokenAddress).balanceOf(funder1);
        assertEq(tokenBalance, claimed);
    }

    function testMultipleContributors() public {
        // Create project and initialize funding
        testCreateProject();

        vm.startPrank(admin);
        // Initialize funding with higher target
        CrowdfundingFacet(address(diamond)).initializeFunding(
            1, // project ID
            10000 * 10**18, // 10000 tokens funding goal
            7 days, // 7 days duration
            address(mockToken) // payment token
        );
        vm.stopPrank();

        // Multiple funders contribute
        vm.startPrank(funder1);
        mockToken.approve(address(diamond), 5000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(1, 5000 * 10**18);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockToken.approve(address(diamond), 5000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(1, 5000 * 10**18);
        vm.stopPrank();

        // Verify funding is successful
        assertTrue(CrowdfundingFacet(address(diamond)).isFunded(1));

        // Fast forward to end of vesting period
        vm.warp(block.timestamp + 180 days + 1);

        // Both funders claim tokens
        vm.startPrank(funder1);
        ProjectTokenFacet(address(diamond)).claimTokens(1);
        vm.stopPrank();

        vm.startPrank(funder2);
        ProjectTokenFacet(address(diamond)).claimTokens(1);
        vm.stopPrank();

        // Get token address using proper destructuring of return values
        (
            address tokenAddress,
            ,  // totalSupply
            uint256 crowdfundingPool,
            ,  // teamPool
            ,  // ecosystemPool
            ,  // vestingStart
            // vestingDuration
        ) = ProjectTokenFacet(address(diamond)).getProjectToken(1);

        // Verify both funders received correct token amounts
        uint256 funder1Balance = IERC20(tokenAddress).balanceOf(funder1);
        uint256 funder2Balance = IERC20(tokenAddress).balanceOf(funder2);

        // Both should have 50% of crowdfunding pool since they contributed equally
        assertEq(funder1Balance, crowdfundingPool / 2);
        assertEq(funder2Balance, crowdfundingPool / 2);
    }

    function testProjectFailureAndRefund() public {
        // Create project
        testCreateProject();

        vm.startPrank(admin);
        // Initialize funding
        CrowdfundingFacet(address(diamond)).initializeFunding(
            1, // project ID
            5000 * 10**18, // 5000 tokens funding goal
            3 days, // 3 days duration
            address(mockToken) // payment token
        );
        vm.stopPrank();

        // Funder1 contributes, but not enough to meet the goal
        vm.startPrank(funder1);
        mockToken.approve(address(diamond), 2000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(1, 2000 * 10**18);
        vm.stopPrank();

        // Fast forward past the funding deadline
        vm.warp(block.timestamp + 4 days);

        // Verify funding failed
        assertFalse(CrowdfundingFacet(address(diamond)).isFunded(1));

        // Check funder's balance before refund
        uint256 balanceBefore = mockToken.balanceOf(funder1);

        // Funder claims refund
        vm.startPrank(funder1);
        CrowdfundingFacet(address(diamond)).claimRefund(1);
        vm.stopPrank();

        // Verify refund amount
        uint256 balanceAfter = mockToken.balanceOf(funder1);
        assertEq(balanceAfter - balanceBefore, 2000 * 10**18);

        // Verify contribution is now zero
        assertEq(CrowdfundingFacet(address(diamond)).getContribution(1, funder1), 0);
    }

    function testFullProjectLifecycle() public {
        // 1. Create project
        vm.startPrank(projectCreator);
        string[] memory tags = new string[](2);
        tags[0] = "DeFi";
        tags[1] = "NFT";

        ProjectFacet.ProjectMetadata memory metadata = ProjectFacet.ProjectMetadata({
            aiEvaluation: "Good project with potential",
            marketScore: 8,
            techFeasibility: "A",
            minValuation: 1000000,
            maxValuation: 2000000
        });

        uint256 projectId = ProjectFacet(address(diamond)).createProject(
            "Lifecycle Test Project",
            "Complete project lifecycle test",
            tags,
            metadata
        );
        vm.stopPrank();

        // 2. Initialize funding
        vm.startPrank(admin);
        CrowdfundingFacet(address(diamond)).initializeFunding(
            projectId,
            10000 * 10**18,
            14 days,
            address(mockToken)
        );
        vm.stopPrank();

        // 3. Multiple contributors fund the project
        vm.startPrank(funder1);
        mockToken.approve(address(diamond), 6000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(projectId, 6000 * 10**18);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockToken.approve(address(diamond), 4000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(projectId, 4000 * 10**18);
        vm.stopPrank();

        // 4. Create multiple tasks
        vm.startPrank(taskCreator);
        string[] memory skills1 = new string[](1);
        skills1[0] = "Smart Contract";

        uint256 taskId1 = TaskMarketFacet(address(diamond)).createTask(
            projectId,
            "Implement Core Contract",
            "Develop the main contract functionality",
            3000 * 10**18,
            block.timestamp + 30 days,
            skills1,
            80
        );

        string[] memory skills2 = new string[](1);
        skills2[0] = "Frontend";

        // Comment out assignment since taskId2 is unused
        /* uint256 taskId2 = */ TaskMarketFacet(address(diamond)).createTask(
            projectId,
            "Develop Frontend",
            "Create user interface",
            2000 * 10**18,
            block.timestamp + 45 days,
            skills2,
            60
        );
        vm.stopPrank();

        // 5. Developer applies for and completes tasks
        // Task 1
        vm.startPrank(developer);
        TaskMarketFacet(address(diamond)).applyForTask(projectId, taskId1);
        vm.stopPrank();

        vm.startPrank(projectCreator);
        TaskMarketFacet(address(diamond)).assignTask(projectId, taskId1, developer);
        vm.stopPrank();

        vm.startPrank(developer);
        TaskMarketFacet(address(diamond)).startTask(projectId, taskId1);
        vm.warp(block.timestamp + 20 days);
        TaskMarketFacet(address(diamond)).completeTask(projectId, taskId1);
        vm.stopPrank();

        vm.startPrank(projectCreator);
        TaskMarketFacet(address(diamond)).verifyTask(projectId, taskId1);
        vm.stopPrank();

        // 6. Funders claim tokens after vesting
        vm.warp(block.timestamp + 100 days); // Partial vesting

        vm.startPrank(funder1);
        ProjectTokenFacet(address(diamond)).claimTokens(projectId);
        vm.stopPrank();

        // 7. Verify project status
        assertTrue(CrowdfundingFacet(address(diamond)).isFunded(projectId));

        // Task status
        (, , , , TaskMarketFacet.TaskStatus status, , , , , ) =
            TaskMarketFacet(address(diamond)).getTask(projectId, taskId1);
        assertEq(uint(status), uint(TaskMarketFacet.TaskStatus.Verified));

        // Token claim
        uint256 claimed = ProjectTokenFacet(address(diamond)).getClaimedAmount(projectId, funder1);
        assertTrue(claimed > 0);
    }

    function testClaimTokensBeforeVesting() public {
        // Make sure we have a funded project
        testContributeToProject();

        // Try to claim tokens before they are vested (should fail)
        vm.startPrank(funder1);

        vm.expectRevert("No tokens to claim");
        ProjectTokenFacet(address(diamond)).claimTokens(1);
        vm.stopPrank();
    }

    function testCreateSecondTask() public {
        // Use a properly defined empty array to avoid nested calldata issue
        string[] memory emptySkills = new string[](0);

        // 确保项目已创建并资金就绪
        testCreateProject();

        // 获取最后创建的项目ID，应该是1
        uint256 projectId = ProjectFacet(address(diamond)).getProjectCount();

        // 初始化资金
        vm.startPrank(admin);
        CrowdfundingFacet(address(diamond)).initializeFunding(
            projectId,
            5000 * 10**18,
            7 days,
            address(mockToken)
        );
        vm.stopPrank();

        // 添加资金
        vm.startPrank(funder1);
        mockToken.approve(address(diamond), 5000 * 10**18);
        CrowdfundingFacet(address(diamond)).contribute(projectId, 5000 * 10**18);
        vm.stopPrank();

        // 使用任务创建者身份创建任务
        vm.startPrank(taskCreator);
        // Create a second task without storing the unused variable
        TaskMarketFacet(address(diamond)).createTask(
            projectId,
            "Easy Task",
            "This is a simple task",
            200 * 10**18,
            block.timestamp + 30 days,
            emptySkills,
            10
        );
        vm.stopPrank();
    }
}