"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { mockProjects, mockTasks, mockUserParticipations, mockUserTasks } from "~~/data/mockData";

const DashboardPage = () => {
  const {
    /* address: connectedAddress */
  } = useAccount();
  const [activeTab, setActiveTab] = useState("projects");

  // Get projects the user has participated in
  const userParticipations = mockUserParticipations;
  const participatedProjects = userParticipations.map(participation => {
    const project = mockProjects.find(p => p.id === participation.projectId);
    return { ...participation, project };
  });

  // Get tasks the user has applied for or is working on
  const userTasks = mockUserTasks;
  const userTasksWithDetails = userTasks.map(userTask => {
    const taskDetails = mockTasks.find(t => t.id === userTask.taskId);
    return { ...userTask, task: taskDetails };
  });

  // Calculate total tokens
  const totalTokens = userParticipations.reduce((acc, participation) => acc + participation.tokenAmount, 0);

  // Calculate total unlocked tokens
  const unlockedTokens = userParticipations.reduce((acc, participation) => {
    const unlocked = participation.unlockSchedule
      .filter(schedule => schedule.unlocked)
      .reduce((sum, schedule) => sum + (participation.tokenAmount * schedule.percentage) / 100, 0);
    return acc + unlocked;
  }, 0);

  return (
    <div className="flex flex-col pt-20 min-h-screen sm:pt-24 animate-fade-in">
      {/* SVG Background */}
      <div className="fixed inset-0 z-[-1] opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboardGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50,0 L0,0 L0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="currentColor" />
            </pattern>
            <pattern id="dashboardDots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" />
            </pattern>
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboardDots)" />
          <rect width="100%" height="100%" fill="url(#dashboardGrid)" />
          <rect width="100%" height="100%" fill="url(#fadeGradient)" />
        </svg>
      </div>

      <div className="container max-w-7xl px-6 mx-auto sm:px-8 md:px-12">
        <h1 className="mb-8 text-2xl font-bold sm:text-3xl sm:mb-10 flex items-center gap-4 relative">
          <div className="absolute -left-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
          <span className="material-icons text-primary text-3xl sm:text-4xl relative z-10 bg-base-100 p-3 rounded-full shadow-sm border border-base-200">dashboard</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</span>
            <span className="text-xs sm:text-sm text-base-content/70 px-3 py-1 rounded-full bg-base-200/50 whitespace-nowrap">Manage Your Investments & Tasks</span>
          </div>
        </h1>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8 sm:mb-10">
          {/* Left column - Summary Cards */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)]">
            <div className="shadow-lg card bg-gradient-to-br from-primary/90 to-primary/70 text-primary-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20 backdrop-blur-sm bg-white/5">
              <div className="p-4 card-body sm:p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm flex-shrink-0 flex items-center justify-center">
                    <span className="material-icons text-xl">rocket_launch</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Projects Backed</h2>
                </div>
                <p className="text-3xl font-bold sm:text-4xl text-center">{participatedProjects.length}</p>
              </div>
            </div>

            <div className="shadow-lg card bg-gradient-to-br from-secondary/90 to-secondary/70 text-secondary-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-secondary/20 backdrop-blur-sm bg-white/5">
              <div className="p-4 card-body sm:p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm flex-shrink-0 flex items-center justify-center">
                    <span className="material-icons text-xl">assignment</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Tasks Participated</h2>
                </div>
                <p className="text-3xl font-bold sm:text-4xl text-center">{userTasksWithDetails.length}</p>
              </div>
            </div>

            <div className="shadow-lg card bg-gradient-to-br from-accent/90 to-accent/70 text-accent-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-accent/20 flex-1 flex flex-col backdrop-blur-sm bg-white/5">
              <div className="p-4 card-body sm:p-5 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm flex-shrink-0 flex items-center justify-center">
                    <span className="material-icons text-xl">token</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Token Balance</h2>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center">
                  <p className="text-3xl font-bold sm:text-5xl mb-2">4,000</p>
                  <p className="text-xl font-medium sm:text-2xl opacity-80">/ 10,000</p>
                  <p className="text-sm opacity-80 sm:text-base mt-2">Unlocked / Total</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-white h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>40% Unlocked</span>
                    <span>60% Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Tabs */}
            <div className="p-1.5 mb-5 rounded-xl tabs tabs-boxed bg-base-200/50 sm:p-2 sm:mb-6">
              <button
                className={`tab text-sm sm:text-base flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "projects" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                <span className="material-icons text-base">account_balance</span>
                My Investments
              </button>
              <button
                className={`tab text-sm sm:text-base flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "tasks" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <span className="material-icons text-base">task_alt</span>
                My Tasks
              </button>
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-5 sm:space-y-6">
                <div className="shadow-lg card bg-base-100 hover:shadow-xl transition-all duration-300 border border-base-200">
                  <div className="p-3 card-body sm:p-4">
                    <h2 className="mb-3 text-xl card-title sm:text-2xl sm:mb-4 flex items-center gap-3">
                      <span className="material-icons text-primary text-2xl">account_balance</span>
                      My Investments
                    </h2>
                    {participatedProjects.length > 0 ? (
                      <div className="overflow-x-auto -mx-5 sm:mx-0">
                        <table className="table w-full table-md">
                          <thead>
                            <tr>
                              <th className="text-sm sm:text-base">Project</th>
                              <th className="text-sm sm:text-base">Amount</th>
                              <th className="text-sm sm:text-base">Tokens</th>
                              <th className="text-sm sm:text-base">Status</th>
                              <th className="text-sm sm:text-base">Unlocked</th>
                              <th className="text-sm sm:text-base">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participatedProjects.map(investment => (
                              <tr key={investment.projectId} className="hover:bg-base-200/50 transition-colors">
                                <td>
                                  <div className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                    {investment.project ? investment.project.title : "Unknown Project"}
                                  </div>
                                </td>
                                <td className="text-sm sm:text-base">${investment.investedAmount.toLocaleString()}</td>
                                <td className="text-sm sm:text-base">{investment.tokenAmount.toLocaleString()}</td>
                                <td>
                                  <span
                                    className={`badge badge-sm sm:badge-md ${
                                      investment.status === "active"
                                        ? "badge-success"
                                        : investment.status === "completed"
                                          ? "badge-info"
                                          : "badge-error"
                                    }`}
                                  >
                                    {investment.status}
                                  </span>
                                </td>
                                <td className="text-sm sm:text-base">
                                  {(() => {
                                    const unlocked = investment.unlockSchedule
                                      .filter(s => s.unlocked)
                                      .reduce((acc, s) => acc + s.percentage, 0);
                                    return `${unlocked}%`;
                                  })()}
                                </td>
                                <td>
                                  <Link
                                    href={`/projects/${investment.projectId}`}
                                    className="btn btn-sm sm:btn-md btn-outline btn-primary"
                                  >
                                    Details
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-8 text-center rounded-lg sm:py-10 bg-base-200/50">
                        <span className="material-icons text-5xl text-primary/50 mb-3">account_balance</span>
                        <h3 className="mb-3 text-xl font-bold sm:text-2xl">No investments yet</h3>
                        <p className="mb-5 text-sm opacity-80 sm:text-base">You haven&apos;t invested in any projects.</p>
                        <Link href="/projects" className="btn btn-primary btn-md sm:btn-lg gap-2">
                          <span className="material-icons text-base">search</span>
                          Browse Projects
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Token Unlock Schedule */}
                {participatedProjects.length > 0 && (
                  <div className="shadow-lg card bg-base-100 hover:shadow-xl transition-all duration-300 border border-base-200">
                    <div className="p-3 card-body sm:p-4">
                      <h3 className="mb-3 text-xl card-title sm:text-2xl sm:mb-4 flex items-center gap-3">
                        <span className="material-icons text-primary text-2xl">schedule</span>
                        Token Release Schedule
                      </h3>
                      <div className="overflow-x-auto -mx-5 sm:mx-0">
                        <table className="table w-full table-md">
                          <thead>
                            <tr>
                              <th className="text-sm sm:text-base">Date</th>
                              <th className="text-sm sm:text-base">Project</th>
                              <th className="text-sm sm:text-base">Percentage</th>
                              <th className="text-sm sm:text-base">Tokens</th>
                              <th className="text-sm sm:text-base">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participatedProjects.flatMap(investment =>
                              investment.unlockSchedule.map((schedule, index) => (
                                <tr key={`${investment.projectId}-${index}`} className="hover:bg-base-200/50 transition-colors">
                                  <td className="text-sm sm:text-base">{new Date(schedule.date).toLocaleDateString()}</td>
                                  <td className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                    {investment.project ? investment.project.title : "Unknown Project"}
                                  </td>
                                  <td className="text-sm sm:text-base">{schedule.percentage}%</td>
                                  <td className="text-sm sm:text-base">
                                    {Math.round(investment.tokenAmount * (schedule.percentage / 100)).toLocaleString()}
                                  </td>
                                  <td>
                                    {schedule.unlocked ? (
                                      <span className="badge badge-sm sm:badge-md badge-success gap-1">
                                        <span className="material-icons text-xs">check_circle</span>
                                        Released
                                      </span>
                                    ) : (
                                      <span className="badge badge-sm sm:badge-md badge-outline gap-1">
                                        <span className="material-icons text-xs">pending</span>
                                        Scheduled
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              )),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="shadow-lg card bg-base-100 hover:shadow-xl transition-all duration-300 border border-base-200">
                <div className="p-3 card-body sm:p-4">
                  <h2 className="mb-3 text-xl card-title sm:text-2xl sm:mb-4 flex items-center gap-3">
                    <span className="material-icons text-primary text-2xl">task_alt</span>
                    My Tasks
                  </h2>
                  {userTasksWithDetails.length > 0 ? (
                    <div className="overflow-x-auto -mx-5 sm:mx-0">
                      <table className="table w-full table-md">
                        <thead>
                          <tr>
                            <th className="text-sm sm:text-base">Task</th>
                            <th className="text-sm sm:text-base">Status</th>
                            <th className="text-sm sm:text-base">Reward</th>
                            <th className="text-sm sm:text-base">Applied On</th>
                            <th className="text-sm sm:text-base">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userTasksWithDetails.map(userTaskWithDetails => (
                            <tr key={userTaskWithDetails.taskId} className="hover:bg-base-200/50 transition-colors">
                              <td className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                <div className="font-medium">
                                  {userTaskWithDetails.task ? userTaskWithDetails.task.title : "Unknown Task"}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge badge-sm sm:badge-md ${
                                    userTaskWithDetails.status === "completed"
                                      ? "badge-success"
                                      : userTaskWithDetails.status === "in_progress"
                                        ? "badge-warning"
                                        : "badge-info"
                                  } gap-1`}
                                >
                                  <span className="material-icons text-xs">
                                    {userTaskWithDetails.status === "completed" 
                                      ? "check_circle" 
                                      : userTaskWithDetails.status === "in_progress" 
                                        ? "pending" 
                                        : "help"}
                                  </span>
                                  {userTaskWithDetails.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="text-sm sm:text-base">
                                {userTaskWithDetails.task
                                  ? `${userTaskWithDetails.task.reward.amount} ${userTaskWithDetails.task.reward.token}`
                                  : "N/A"}
                              </td>
                              <td className="text-sm sm:text-base">
                                {new Date(userTaskWithDetails.appliedDate).toLocaleDateString()}
                              </td>
                              <td>
                                <Link
                                  href={`/tasks/${userTaskWithDetails.taskId}`}
                                  className="btn btn-sm sm:btn-md btn-outline btn-primary gap-1"
                                >
                                  <span className="material-icons text-xs">visibility</span>
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-5 text-center rounded-lg sm:py-6 bg-base-200/50">
                      <span className="material-icons text-5xl text-primary/50 mb-3">assignment</span>
                      <h3 className="mb-2 text-xl font-bold sm:text-2xl">No tasks yet</h3>
                      <p className="mb-3 text-sm opacity-80 sm:text-base">You haven&apos;t applied for any tasks.</p>
                      <Link href="/tasks" className="btn btn-primary btn-md sm:btn-lg gap-2">
                        <span className="material-icons text-base">search</span>
                        Browse Tasks
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
