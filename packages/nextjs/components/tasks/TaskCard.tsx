import React from "react";
import Link from "next/link";
import { MouseTracker } from "~~/components/motion/MouseTracker";
import { StatusBadge } from "../shared/StatusBadge";

interface Task {
  id: string;
  title: string;
  description: string;
  category: "development" | "design" | "marketing";
  difficulty: "easy" | "medium" | "hard";
  reward: {
    amount: number;
    token: string;
  };
  deadline: string;
  status: string;
  requirements: {
    skills: string[];
    experienceLevel: string;
  };
  timeline: {
    createdAt: string;
    estimatedHours: number;
  };
  assignedTo?: string;
}

interface TaskCardProps {
  task: Task;
}

const getDifficultyColor = (difficulty: Task["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-20 dark:text-yellow-400";
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-400";
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const formattedDeadline = new Date(task.deadline).toLocaleDateString();

  return (
    <MouseTracker>
      <Link href={`/tasks/${task.id}`} className="block w-full">
        <div className="card card-hover animate-slide-up transition-all duration-300 hover:translate-y-[-5px] border border-base-300 bg-base-100 hover:shadow-xl hover:shadow-primary/10">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-content-primary">{task.title}</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`tag ${getDifficultyColor(task.difficulty)}`}>{task.difficulty}</span>
                <StatusBadge status={task.status} size="sm" />
              </div>
            </div>

            <p className="mb-4 text-content-secondary text-sm line-clamp-2">{task.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {task.requirements.skills.map(skill => (
                <span key={skill} className="tag text-xs py-1 px-2">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <span className="text-xs text-content-secondary">Reward</span>
                  <div className="text-base sm:text-lg font-semibold gradient-text-primary">
                    {task.reward.amount} {task.reward.token}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-content-secondary">Deadline</span>
                  <div className="text-sm sm:text-base text-content-primary">{formattedDeadline}</div>
                </div>
              </div>

              <button className="btn btn-outline-glow btn-sm">View Details</button>
            </div>
          </div>
        </div>
      </Link>
    </MouseTracker>
  );
};
