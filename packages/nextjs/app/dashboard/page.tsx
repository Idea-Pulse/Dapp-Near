"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { EmptyState } from "~~/components/shared/EmptyState";
import { LoadingSpinner } from "~~/components/shared/LoadingSpinner";
import { StatusBadge } from "~~/components/shared/StatusBadge";
import { useCrowdfunding } from "~~/hooks/useCrowdfunding";
import { useProjects } from "~~/hooks/useProjects";
import { useTasks } from "~~/hooks/useTasks";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  creator: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  reward: {
    amount: number;
    token: string;
  };
}

const ProjectContribution = ({ project }: { project: Project }) => {
  const { userContribution } = useCrowdfunding(project.id);
  return Number(userContribution) > 0 ? userContribution : null;
};

const DashboardPage = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"projects" | "tasks">("projects");

  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { tasks: userTasks, isLoading: isLoadingTasks } = useTasks();

  // Filter user's projects based on contributions
  const userProjects = useMemo(() => {
    if (!projects?.length) return [];
    return projects.filter(project => {
      const contribution = <ProjectContribution project={project} />;
      return contribution !== null;
    });
  }, [projects]);

  if (isLoadingProjects || isLoadingTasks) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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

      <div className="container px-6 mx-auto max-w-7xl sm:px-8 md:px-12">
        <h1 className="flex relative gap-4 items-center mb-8 text-2xl font-bold sm:text-3xl sm:mb-10">
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-xl bg-primary/10"></div>
          <span className="relative z-10 p-3 text-3xl rounded-full border shadow-sm material-icons text-primary sm:text-4xl bg-base-100 border-base-200">dashboard</span>
          <div className="flex gap-3 items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r sm:text-3xl from-primary to-secondary">Dashboard</span>
            <span className="px-3 py-1 text-xs whitespace-nowrap rounded-full sm:text-sm text-base-content/70 bg-base-200/50">Manage Your Investments & Tasks</span>
          </div>
        </h1>

        {/* Two-column layout */}
        <div className="flex flex-col gap-8 mb-8 lg:flex-row sm:mb-10">
          {/* Left column - Summary Cards */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)]">
            <div className="shadow-lg card bg-gradient-to-br from-primary/90 to-primary/70 text-primary-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20 backdrop-blur-sm bg-white/5">
              <div className="flex flex-col p-4 card-body sm:p-5">
                <div className="flex gap-3 items-center mb-2">
                  <div className="flex flex-shrink-0 justify-center items-center p-2 rounded-full backdrop-blur-sm bg-white/20">
                    <span className="text-xl material-icons">rocket_launch</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Projects Backed</h2>
                </div>
                <p className="text-3xl font-bold text-center sm:text-4xl">{userProjects?.length || 0}</p>
              </div>
            </div>

            <div className="shadow-lg card bg-gradient-to-br from-secondary/90 to-secondary/70 text-secondary-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-secondary/20 backdrop-blur-sm bg-white/5">
              <div className="flex flex-col p-4 card-body sm:p-5">
                <div className="flex gap-3 items-center mb-2">
                  <div className="flex flex-shrink-0 justify-center items-center p-2 rounded-full backdrop-blur-sm bg-white/20">
                    <span className="text-xl material-icons">assignment</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Tasks Participated</h2>
                </div>
                <p className="text-3xl font-bold text-center sm:text-4xl">{userTasks?.length || 0}</p>
              </div>
            </div>

            <div className="shadow-lg card bg-gradient-to-br from-accent/90 to-accent/70 text-accent-content hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-accent/20 flex-1 flex flex-col backdrop-blur-sm bg-white/5">
              <div className="flex flex-col p-4 h-full card-body sm:p-5">
                <div className="flex gap-3 items-center mb-3">
                  <div className="flex flex-shrink-0 justify-center items-center p-2 rounded-full backdrop-blur-sm bg-white/20">
                    <span className="text-xl material-icons">token</span>
                  </div>
                  <h2 className="text-lg card-title sm:text-xl">Token Balance</h2>
                </div>

                <div className="flex flex-col flex-1 justify-center items-center">
                  <p className="mb-2 text-3xl font-bold sm:text-5xl">4,000</p>
                  <p className="text-xl font-medium opacity-80 sm:text-2xl">/ 10,000</p>
                  <p className="mt-2 text-sm opacity-80 sm:text-base">Unlocked / Total</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/20">
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
                <span className="text-base material-icons">account_balance</span>
                My Investments
              </button>
              <button
                className={`tab text-sm sm:text-base flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "tasks" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <span className="text-base material-icons">task_alt</span>
                My Tasks
              </button>
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-5 sm:space-y-6">
                <div className="border shadow-lg transition-all duration-300 card bg-base-100 hover:shadow-xl border-base-200">
                  <div className="p-3 card-body sm:p-4">
                    <h2 className="flex gap-3 items-center mb-3 text-xl card-title sm:text-2xl sm:mb-4">
                      <span className="text-2xl material-icons text-primary">account_balance</span>
                      My Investments
                    </h2>
                    {userProjects && userProjects.length > 0 ? (
                      <div className="overflow-x-auto -mx-5 sm:mx-0">
                        <table className="table w-full table-md">
                          <thead>
                            <tr>
                              <th className="text-sm sm:text-base">Project</th>
                              <th className="text-sm sm:text-base">Amount</th>
                              <th className="text-sm sm:text-base">Status</th>
                              <th className="text-sm sm:text-base">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userProjects.map((project: Project) => (
                              <tr key={project.id} className="transition-colors hover:bg-base-200/50">
                                <td>
                                  <div className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                    {project.title}
                                  </div>
                                </td>
                                <td className="text-sm sm:text-base">
                                  <ProjectContribution project={project} /> USDT
                                </td>
                                <td>
                                  <StatusBadge status={project.status} size="sm" />
                                </td>
                                <td>
                                  <Link
                                    href={`/projects/${project.id}`}
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
                      <EmptyState
                        icon="account_balance"
                        title="No investments yet"
                        description="You haven't invested in any projects."
                        actionLabel="Browse Projects"
                        onAction={() => window.location.href = "/projects"}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="border shadow-lg transition-all duration-300 card bg-base-100 hover:shadow-xl border-base-200">
                <div className="p-3 card-body sm:p-4">
                  <h2 className="flex gap-3 items-center mb-3 text-xl card-title sm:text-2xl sm:mb-4">
                    <span className="text-2xl material-icons text-primary">task_alt</span>
                    My Tasks
                  </h2>
                  {userTasks && userTasks.length > 0 ? (
                    <div className="overflow-x-auto -mx-5 sm:mx-0">
                      <table className="table w-full table-md">
                        <thead>
                          <tr>
                            <th className="text-sm sm:text-base">Task</th>
                            <th className="text-sm sm:text-base">Status</th>
                            <th className="text-sm sm:text-base">Reward</th>
                            <th className="text-sm sm:text-base">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userTasks.map((task: Task) => (
                            <tr key={task.id} className="transition-colors hover:bg-base-200/50">
                              <td className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                <div className="font-medium">{task.title}</div>
                              </td>
                              <td>
                                <StatusBadge status={task.status} size="sm" />
                              </td>
                              <td className="text-sm sm:text-base">
                                {task.reward.amount} {task.reward.token}
                              </td>
                              <td>
                                <Link
                                  href={`/tasks/${task.id}`}
                                  className="gap-1 btn btn-sm sm:btn-md btn-outline btn-primary"
                                >
                                  <span className="text-xs material-icons">visibility</span>
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      icon="assignment"
                      title="No tasks yet"
                      description="You haven't applied for any tasks."
                      actionLabel="Browse Tasks"
                      onAction={() => window.location.href = "/tasks"}
                    />
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
