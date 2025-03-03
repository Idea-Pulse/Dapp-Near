"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Address } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import externalContracts from "~~/contracts/externalContracts";
import { notification } from "~~/utils/scaffold-eth";
import { mockProjects, mockTasks } from "~~/data/mockData";

// Simple icon component instead of Heroicons
const Icon = ({ name }: { name: string }) => {
  return <span className="material-icons text-primary">{name}</span>;
};

type TaskDifficulty = "easy" | "medium" | "hard";

const TaskDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Get hooks needed for contract interaction
  const { address: userAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const writeTxn = useTransactor();
  const { writeContractAsync, isPending: isMining } = useWriteContract();

  // Get SimpleTransaction contract on Aurora testnet
  const contractConfig = externalContracts[1313161555]?.SimpleTransaction;

  useEffect(() => {
    // Find the task and its associated project
    const foundTask = mockTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      const relatedProject = mockProjects.find(p => p.id === foundTask.projectId);
      setProject(relatedProject);
    }
    setLoading(false);
  }, [taskId]);

  // Handle Apply Now button click
  const handleApply = async () => {
    if (!userAddress) {
      notification.error("Please connect your wallet first");
      return;
    }

    if (!writeContractAsync || !contractConfig) {
      notification.error("Contract configuration error");
      return;
    }

    try {
      setIsApplying(true);
      
      const makeWriteWithParams = () =>
        writeContractAsync({
          address: contractConfig.address as Address,
          abi: contractConfig.abi,
          functionName: "executeTransaction",
          args: [],
        });
      
      await writeTxn(makeWriteWithParams);
      notification.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Application failed:", error);
      notification.error("Application failed: " + (error.message || error.toString()));
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!task || !project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <p className="mb-6">The task you're looking for doesn't exist or has been removed.</p>
        <Link href="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  // For WCT's first task
  const taskSkills = ["Solidity", "Smart Contracts", "ERC20", "Security Auditing"];
  const estimatedHours = 40;
  const deadline = "2025-04-01";
  const difficulty: TaskDifficulty = "medium";
  const experienceLevel = "Intermediate";

  // Helper function to get badge color based on difficulty
  const getDifficultyBadgeClass = (diff: TaskDifficulty): string => {
    switch (diff) {
      case "easy":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-info";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 animate-fade-in">
      {/* SVG Background */}
      <div className="fixed inset-0 z-[-1] opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0,0 L40,0 L40,40 L0,40 L0,0 Z M39,1 L1,1 L1,39 L39,39 L39,1 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            </pattern>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#grid)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <rect width="100%" height="100%" fill="currentColor" mask="url(#gridMask)" opacity="0.2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="btn btn-ghost gap-2">
            <span className="material-icons text-primary">arrow_back</span>
            Back
          </button>
        </div>

        {/* Task Header */}
        <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="badge badge-primary">{project.category}</span>
                  <span className={`badge ${task.status === "open" ? "badge-secondary" : task.status === "in_progress" ? "badge-accent" : "badge-success"}`}>
                    {task.status.replace("_", " ")}
                  </span>
                  <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
                    {difficulty}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{task.title}</h1>
                <Link href={`/projects/${project.id}`} className="text-primary hover:underline">
                  {project.title}
                </Link>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {task.reward.amount} {task.reward.token}
                </div>
                <div className="text-sm opacity-70">Reward</div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Task Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="card-body p-0">
                <h3 className="text-lg font-semibold p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <span className="material-icons text-primary">description</span>
                  Task Details
                </h3>
                <div className="p-4">
                  <div className="prose max-w-none">
                    <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-primary text-sm">summarize</span>
                      Overview
                    </h4>
                    <p className="mb-6">{task.description}</p>
                    
                    <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-primary text-sm">info</span>
                      Details
                    </h4>
                    <p>
                      As part of the Wildlife Conservation Token (WCT) project, this task involves developing and auditing smart contracts that will handle the automated distribution of donations to conservation organizations. The smart contracts should:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">check_circle</span>
                        <span>Implement a transparent mechanism for tracking donations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">check_circle</span>
                        <span>Create an automated distribution system based on predefined allocation rules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">check_circle</span>
                        <span>Include proper security measures to protect funds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">check_circle</span>
                        <span>Generate events for tracking donation flow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">check_circle</span>
                        <span>Support multiple conservation organizations as recipients</span>
                      </li>
                    </ul>
                    <p className="mt-4">
                      The completed smart contracts will be a critical component of the WCT ecosystem, enabling transparent and efficient distribution of funds to wildlife conservation efforts in Africa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="card-body p-0">
                <h3 className="text-lg font-semibold p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <span className="material-icons text-primary">inventory_2</span>
                  Deliverables
                </h3>
                <div className="p-4">
                  <div className="prose max-w-none">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">code</span>
                        <span>Smart contract code for donation distribution system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">bug_report</span>
                        <span>Comprehensive test suite with at least 90% coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">security</span>
                        <span>Security audit report identifying and addressing potential vulnerabilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">description</span>
                        <span>Documentation explaining the contract architecture and functions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-1">rocket_launch</span>
                        <span>Deployment scripts for test and mainnet environments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Task Info */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="card-body p-0">
                <h3 className="text-lg font-semibold p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <span className="material-icons text-primary">info</span>
                  Task Information
                </h3>
                <div className="divide-y divide-base-200">
                  <div className="flex items-center p-4 hover:bg-base-200/50 transition-colors">
                    <div className="flex items-center gap-3 w-1/2">
                      <span className="material-icons text-primary text-xl">event</span>
                      <span className="font-medium">Deadline</span>
                    </div>
                    <div className="w-1/2 text-right font-semibold">April 1, 2025</div>
                  </div>
                  
                  <div className="flex items-center p-4 hover:bg-base-200/50 transition-colors">
                    <div className="flex items-center gap-3 w-1/2">
                      <span className="material-icons text-primary text-xl">schedule</span>
                      <span className="font-medium">Estimated Time</span>
                    </div>
                    <div className="w-1/2 text-right font-semibold">40 hours</div>
                  </div>
                  
                  <div className="flex items-center p-4 hover:bg-base-200/50 transition-colors">
                    <div className="flex items-center gap-3 w-1/2">
                      <span className="material-icons text-primary text-xl">person</span>
                      <span className="font-medium">Experience</span>
                    </div>
                    <div className="w-1/2 text-right font-semibold">Intermediate</div>
                  </div>
                  
                  <div className="flex items-center p-4 hover:bg-base-200/50 transition-colors">
                    <div className="flex items-center gap-3 w-1/2">
                      <span className="material-icons text-primary text-xl">payments</span>
                      <span className="font-medium">Payment</span>
                    </div>
                    <div className="w-1/2 text-right font-semibold">Upon completion</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="card-body p-0">
                <h3 className="text-lg font-semibold p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <span className="material-icons text-primary">psychology</span>
                  Skills
                </h3>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {taskSkills.map(skill => (
                      <span key={skill} className="badge badge-outline badge-primary px-3 py-3">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="card-body p-0">
                <h3 className="text-lg font-semibold p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <span className="material-icons text-primary">handshake</span>
                  Apply for Task
                </h3>
                <div className="p-4">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={handleApply}
                    disabled={isMining || isApplying || !userAddress}
                  >
                    {isMining || isApplying ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">send</span>
                        Apply Now
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-sm text-center text-base-content/70">
                    <span className="material-icons text-primary text-sm align-text-bottom mr-1">schedule</span>
                    Applications will be reviewed by agents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage; 