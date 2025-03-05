"use client";

import Link from "next/link";
import { useCrowdfunding } from "~~/hooks/useCrowdfunding";
import { useTasks } from "~~/hooks/useTasks";
import { LoadingSpinner } from "./LoadingSpinner";
import { StatusBadge } from "./StatusBadge";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  creator: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { fundingInfo, isLoading: isLoadingFunding } = useCrowdfunding(project.id);
  const { taskCount, isLoading: isLoadingTasks } = useTasks(project.id);

  if (isLoadingFunding || isLoadingTasks) {
    return (
      <div className="flex justify-center items-center p-6 card bg-base-100 border border-base-300">
        <LoadingSpinner />
      </div>
    );
  }

  const progress = fundingInfo ? (Number(fundingInfo.raisedAmount) / Number(fundingInfo.fundingGoal)) * 100 : 0;
  const daysLeft = fundingInfo
    ? Math.max(0, Math.ceil((Number(fundingInfo.endTime) * 1000 - Date.now()) / (1000 * 3600 * 24)))
    : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-base-100 shadow-lg rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300
      hover:scale-[1.02] border border-base-300 hover:border-primary/30 hover:shadow-primary/10 h-full flex flex-col"
    >
      {/* Project Header */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-primary">{project.title}</h3>
          {daysLeft > 0 && (
            <span className="text-xs px-2 py-1 bg-base-200 rounded-full font-medium ml-2 whitespace-nowrap">
              {daysLeft}d left
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm opacity-80 line-clamp-2">{project.description}</p>
      </div>

      {/* Funding Progress */}
      {fundingInfo && (
        <div className="mb-4 sm:mb-5">
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="font-semibold">
              {Number(fundingInfo.raisedAmount).toLocaleString()} / {Number(fundingInfo.fundingGoal).toLocaleString()} USDT
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary rounded-full h-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      )}

      {/* Project Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center py-3 sm:py-4 mb-4 sm:mb-5 border-y border-base-200 bg-base-100/50">
        <div className="flex flex-col justify-center">
          <div className="text-base sm:text-lg font-bold text-secondary">{taskCount?.toString() || "0"}</div>
          <div className="text-[10px] sm:text-xs opacity-70">Total Tasks</div>
        </div>
        <div className="flex flex-col justify-center">
          <StatusBadge status={project.status} size="sm" />
          <div className="text-[10px] sm:text-xs opacity-70 mt-1">Status</div>
        </div>
      </div>

      {/* Project Footer */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs mt-auto">
        <span className="opacity-70 truncate max-w-[120px] sm:max-w-none flex items-center">
          <span className="w-2 h-2 rounded-full bg-success mr-1.5 inline-block"></span>
          {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          {!fundingInfo?.hasMetFundingGoal && (
            <span className="px-1.5 sm:px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
              Funding Open
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

