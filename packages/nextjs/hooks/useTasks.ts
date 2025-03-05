import { useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

export interface Task {
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

export const useTasks = (projectId?: string) => {
  const { data: taskMarketFacet } = useDeployedContractInfo("TaskMarketFacet");
  const chainId = getTargetNetworks()[0].id;

  const { data: taskCount, isLoading: isLoadingCount } = useContractRead({
    address: taskMarketFacet?.address,
    abi: taskMarketFacet?.abi,
    functionName: "getProjectTaskCount",
    args: [projectId],
    chainId,
    watch: !!projectId,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useContractRead({
    address: taskMarketFacet?.address,
    abi: taskMarketFacet?.abi,
    functionName: "getProjectTasks",
    args: [projectId],
    chainId,
    watch: !!projectId && taskCount !== undefined,
  });

  return {
    tasks: tasks as Task[],
    isLoading: isLoadingCount || isLoadingTasks,
    taskCount,
  };
};