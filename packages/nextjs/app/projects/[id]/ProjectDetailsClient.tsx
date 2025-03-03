"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Address } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { Project, TaskStatus } from "~~/data/mockData";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import externalContracts from "~~/contracts/externalContracts";
import { notification } from "~~/utils/scaffold-eth";

// Component for rendering task status badges
const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const colors = {
    open: "bg-primary/10 text-primary",
    in_progress: "bg-secondary/10 text-secondary",
    completed: "bg-success/10 text-success",
  };

  const labels = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return <span className={`px-2 py-1 text-xs rounded-full ${colors[status]}`}>{labels[status]}</span>;
};

type TabType = "details" | "roadmap" | "tasks";

export function ProjectDetailsClient({ project }: { project: Project }) {
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isTransacting, setIsTransacting] = useState(false);
  const [currentRaisedAmount, setCurrentRaisedAmount] = useState(project.raisedAmount);
  const [contributionAmount, setContributionAmount] = useState<number>(100);
  
  // 获取合约交互所需的hooks
  const { address: userAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const writeTxn = useTransactor();
  const { writeContractAsync } = useWriteContract();

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRaisedAmount(prevAmount => {
     
        const newAmount = prevAmount + 2000;
        return newAmount <= project.fundingGoal ? newAmount : project.fundingGoal;
      });
    }, 150000); // 
 
    return () => clearInterval(interval);
  }, [project.fundingGoal]);

  // 获取Aurora测试网上的SimpleTransaction合约
  const contractConfig = externalContracts[1313161555]?.SimpleTransaction;

  const progress = (currentRaisedAmount / project.fundingGoal) * 100;
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
  );

  // 处理"Back This Project"按钮点击事件
  const handleBackProject = async () => {
    if (!userAddress) {
      notification.error("Please connect your wallet first");
      return;
    }

    if (!writeContractAsync || !contractConfig) {
      notification.error("Contract configuration error");
      return;
    }

    if (!contributionAmount || contributionAmount <= 0) {
      notification.error("Please enter a valid contribution amount");
      return;
    }

    try {
      setIsTransacting(true);
      
      const makeWriteWithParams = () =>
        writeContractAsync({
          address: contractConfig.address as Address,
          abi: contractConfig.abi,
          functionName: "executeTransaction",
          args: [],
        });
      
      await writeTxn(makeWriteWithParams);
      
      // 更新已筹集金额
      setCurrentRaisedAmount(prevAmount => Math.min(prevAmount + contributionAmount, project.fundingGoal));
      
      notification.success("Transaction completed successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
      notification.error("Transaction failed");
    } finally {
      setIsTransacting(false);
    }
  };

  const tabContent = {
    details: (
      <div className="space-y-6">
        <p className="text-lg">{project.description}</p>
        
        {project.id === "1" && (
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              <span className="material-icons text-primary text-sm align-text-bottom mr-1">token</span>
              Token Issuance
            </h3>
            <div className="p-4 rounded-lg bg-base-200">
              <p className="mb-2 text-base font-semibold">Total Supply: 100 million WCT tokens</p>
              <p className="mb-3 text-base font-semibold">Allocation:</p>
              <div className="space-y-2">
                <div className="flex items-center w-full h-4 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-primary"></div>
                  <div className="w-[20%] h-full bg-secondary"></div>
                  <div className="w-[10%] h-full bg-accent"></div>
                  <div className="w-[10%] h-full bg-info"></div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs text-center sm:text-sm">
                  <div>
                    <span className="font-semibold text-primary">60%</span>
                    <p>Public sale, crowdfunding, and partnerships</p>
                  </div>
                  <div>
                    <span className="font-semibold text-secondary">20%</span>
                    <p>Reserved for wildlife organizations</p>
                  </div>
                  <div>
                    <span className="font-semibold text-accent">10%</span>
                    <p>Operational costs and development</p>
                  </div>
                  <div>
                    <span className="font-semibold text-info">10%</span>
                    <p>Community rewards and incentives</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm italic">
                This token model is designed to create a decentralized, community-driven ecosystem where AI agents and token holders collaboratively incubate and develop the project. Through transparent governance and dynamic staking mechanisms, we aim to break the monopoly of traditional VCs while ensuring sustainable value creation and equitable reward distribution for all participants.
              </p>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            <span className="material-icons text-primary text-sm align-text-bottom mr-1">description</span>
            Project Overview
          </h3>
          <ul className="space-y-3 list-disc list-inside">
            <li>Category: {project.category}</li>
            <li>Technology Stack: {project.tags.join(", ")}</li>
            <li>Timeline: {new Date(project.endDate).toLocaleDateString()}</li>
          </ul>
        </div>

        {project.id === "1" && (
          <>
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">flag</span>
                Mission
              </h3>
              <p className="text-base">
                The goal is to support African wildlife conservation efforts through a blockchain-based fundraising mechanism. 
                By issuing a token (WCT), we aim to create a transparent and automated way for donors to contribute to wildlife protection.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">settings</span>
                How It Works
              </h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-base">
                  <span className="font-semibold">Issuance of Tokens:</span> A fixed total supply of WCT tokens (100 million tokens) will be minted. 
                  The tokens will be available for purchase through various channels, including crypto exchanges, directly from the project website, or via smart contracts.
                </li>
                <li className="text-base">
                  <span className="font-semibold">Smart Contract Setup:</span> Each WCT token will be linked to a smart contract that automates donations. 
                  A percentage of every transaction (buy/sell) will be directed toward verified conservation organizations. 
                  This can be set to auto-distribute funds to different projects within the ecosystem, depending on real-time data and conservation needs.
                </li>
                <li className="text-base">
                  <span className="font-semibold">Token Utility:</span>
                  <ul className="pl-6 mt-2 space-y-2 list-disc">
                    <li>Donor Engagement: Holders of WCT will receive updates about their contributions, along with detailed reports on the conservation projects funded by their donations.</li>
                    <li>Incentives for Donors: Token holders can receive badges, rewards, or access to exclusive content (like behind-the-scenes footage of conservation projects or virtual wildlife experiences).</li>
                    <li>Partnerships: Conservation organizations can partner with the project to receive automatic donations based on token transactions.</li>
                  </ul>
                </li>
                <li className="text-base">
                  <span className="font-semibold">Token Distribution:</span>
                  <ul className="pl-6 mt-2 space-y-2 list-disc">
                    <li>Initial Token Distribution: Tokens will be distributed to early backers, wildlife experts, and conservation NGOs. A portion will be reserved for a public sale and community rewards.</li>
                    <li>Charitable Donation Allocation: 80% of proceeds will go directly to animal conservation efforts. 10% will fund project development, and 10% will cover operational costs.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
    ),
    roadmap: (
      <div className="space-y-6">
        {project.roadmap.map((milestone, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  milestone.status === "completed" ? "bg-success" : "bg-base-300"
                }`}
              >
                {milestone.status === "completed" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {index < project.roadmap.length - 1 && (
                <div className={`w-0.5 h-full ${
                  milestone.status === "completed" ? "bg-success" : "bg-base-300"
                }`} />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center mb-1">
                <h3 className="font-semibold text-lg">{milestone.title}</h3>
                <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                  milestone.status === "completed" ? "bg-success/20 text-success" : "bg-base-300 text-base-content/70"
                }`}>
                  {milestone.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="mb-3 text-sm opacity-80">{milestone.description}</p>
              <div className="p-4 mt-2 rounded-lg bg-base-200/50 border border-base-300/50">
                <h4 className="mb-2 font-medium text-sm">Key Deliverables:</h4>
                <ul className="space-y-1 text-sm opacity-80 list-disc list-inside">
                  {milestone.deliverables.split(', ').map((deliverable, i) => (
                    <li key={i}>{deliverable}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs opacity-70">Target Completion: {new Date(milestone.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    tasks: (
      <div className="space-y-4">
        {project.tasks.map(task => (
          <div key={task.id} className="p-4 rounded-lg border shadow-lg bg-base-100 border-base-300">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{task.title}</h3>
              <TaskStatusBadge status={task.status} />
            </div>
            <p className="mb-3 text-sm opacity-70">{task.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary">{task.reward} USDT</span>
              {task.status === "open" && (
                <Link href={`/tasks/${task.id}`} className="btn btn-sm btn-outline">
                  Apply
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="flex flex-col pt-20 min-h-screen animate-fade-in sm:pt-24">
      {/* SVG Background */}
      <div className="fixed inset-0 z-[-1] opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="currentColor" />
              <circle cx="0" cy="0" r="1" fill="currentColor" />
              <circle cx="0" cy="100" r="1" fill="currentColor" />
              <circle cx="100" cy="0" r="1" fill="currentColor" />
              <circle cx="100" cy="100" r="1" fill="currentColor" />
              <path
                d="M50,0 L50,50 M0,50 L50,50 M50,50 L100,50 M50,50 L50,100"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M25,25 Q50,0 75,25 T75,75 Q100,50 75,75 T25,75 Q0,50 25,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="py-8 w-full bg-base-200/30 sm:py-12">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:gap-8">
            {/* Left Column - Project Info & Tabs */}
            <div className="space-y-6 lg:col-span-2 sm:space-y-8">
              {/* Project Header */}
              <div className="p-4 shadow-lg card bg-base-100 sm:p-6 relative overflow-hidden border border-transparent before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/40 before:via-secondary/40 before:to-accent/40 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-base-100 after:-z-10">
                {/* 添加极光效果 */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-accent/10 via-primary/10 to-secondary/10 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10">
                  <div className="flex flex-wrap gap-1 mb-3 sm:gap-2 sm:mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="badge badge-primary text-[10px] sm:text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="mb-3 text-2xl font-bold sm:text-4xl sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">{project.title}</h1>
                  <div className="flex flex-wrap gap-2 items-center sm:gap-4">
                    <span className="text-xs opacity-70 sm:text-sm flex items-center">
                      Created by
                    </span>
                    <button className="inline-flex items-center justify-center px-2 text-xs font-medium text-primary border border-primary rounded hover:bg-primary/10 h-5 leading-none">
                      Agent
                    </button>
                    <span className="text-xs opacity-70 sm:text-sm flex items-center">
                      ({project.creator.slice(0, 6)}...{project.creator.slice(-4)})
                    </span>
                    <span className="hidden text-xs opacity-70 sm:text-sm sm:inline-flex sm:items-center">•</span>
                    <span
                      className={`badge badge-sm sm:badge-md ${project.status === "active" ? "badge-primary" : "badge-ghost"} flex items-center`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="shadow-lg card bg-base-100">
                <div className="p-1 rounded-t-2xl tabs tabs-boxed bg-base-200/50 sm:p-2">
                  <button
                    className={`tab text-xs sm:text-sm flex-1 ${activeTab === "details" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("details")}
                  >
                    <span className="material-icons text-xs align-text-bottom mr-1">info</span>
                    Details
                  </button>
                  <button
                    className={`tab text-xs sm:text-sm flex-1 ${activeTab === "roadmap" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("roadmap")}
                  >
                    <span className="material-icons text-xs align-text-bottom mr-1">map</span>
                    Roadmap
                  </button>
                  <button
                    className={`tab text-xs sm:text-sm flex-1 ${activeTab === "tasks" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("tasks")}
                  >
                    <span className="material-icons text-xs align-text-bottom mr-1">assignment</span>
                    Tasks
                  </button>
                </div>
                <div className="p-4 sm:p-6">{tabContent[activeTab]}</div>
              </div>
            </div>

            {/* Right Column - Funding & Support */}
            <div className="space-y-6 sm:space-y-8">
              {/* Funding Progress */}
              <div className="p-4 shadow-lg card bg-base-100 sm:p-6">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">trending_up</span>
                  Funding Progress
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold sm:text-2xl">
                      {currentRaisedAmount.toLocaleString()} / {project.fundingGoal.toLocaleString()} {selectedToken}
                    </span>
                    <span className="text-base opacity-70 sm:text-lg">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-base-300 sm:h-3">
                    <div
                      className="h-2 rounded-full transition-all duration-500 bg-primary sm:h-3"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center sm:gap-4 sm:mb-6">
                  <div>
                    <div className="text-lg font-bold sm:text-2xl">{daysLeft}</div>
                    <div className="text-xs opacity-70 sm:text-sm">
                      <span className="material-icons text-primary text-xs align-text-bottom mr-1">schedule</span>
                      Days Left
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold sm:text-2xl">{project.participants.length}</div>
                    <div className="text-xs opacity-70 sm:text-sm">
                      <span className="material-icons text-primary text-xs align-text-bottom mr-1">people</span>
                      Backers
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold sm:text-2xl">
                      {project.tasks.filter(task => task.status === "open").length}
                    </div>
                    <div className="text-xs opacity-70 sm:text-sm">
                      <span className="material-icons text-primary text-xs align-text-bottom mr-1">task</span>
                      Open Tasks
                    </div>
                  </div>
                </div>

                {project.status === "active" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor="token-select" className="text-sm font-semibold sm:text-base">
                        Select Token:
                      </label>
                      <select
                        id="token-select"
                        className="select select-bordered select-xs sm:select-sm"
                        value={selectedToken}
                        onChange={e => setSelectedToken(e.target.value)}
                        aria-label="Select payment token"
                      >
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="contribution-amount" className="mb-2 text-sm font-semibold sm:text-base">
                        <span className="material-icons text-primary text-sm align-text-bottom mr-1">payments</span>
                        Contribution Amount:
                      </label>
                      <div className="flex items-center">
                        <input
                          id="contribution-amount"
                          type="number"
                          className="w-full input input-bordered input-sm sm:input-md"
                          value={contributionAmount}
                          onChange={e => setContributionAmount(Number(e.target.value))}
                          min="1"
                          placeholder="Enter amount"
                        />
                        <span className="ml-2 text-sm font-medium">{selectedToken}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full btn btn-primary btn-sm sm:btn-md" 
                      onClick={handleBackProject}
                      disabled={isTransacting || !userAddress || !contributionAmount || contributionAmount <= 0}
                    >
                      {isTransacting ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-icons text-sm align-text-bottom mr-1">favorite</span>
                          Back This Project with {contributionAmount} {selectedToken}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Project Updates */}
              <div className="p-4 shadow-lg card bg-base-100 sm:p-6">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">update</span>
                  Latest Updates from Agent
                </h2>
                <div className="space-y-4">
                  {project.updates?.map((update, index) => (
                    <div key={index} className="pb-3 border-b border-base-300 last:border-0 sm:pb-4 last:pb-0">
                      <h3 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">{update.title}</h3>
                      <p className="mb-2 text-xs opacity-70 sm:text-sm">{update.content}</p>
                      <span className="text-[10px] sm:text-xs opacity-60">{update.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
