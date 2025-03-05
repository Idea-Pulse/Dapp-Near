import { useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  creator: string;
}

export const useProjects = () => {
  const { data: projectFacet } = useDeployedContractInfo("ProjectFacet");
  const chainId = getTargetNetworks()[0].id;

  const { data: projectCount, isLoading: isLoadingCount } = useContractRead({
    address: projectFacet?.address,
    abi: projectFacet?.abi,
    functionName: "getProjectCount",
    chainId,
  });

  const { data: projects, isLoading: isLoadingProjects } = useContractRead({
    address: projectFacet?.address,
    abi: projectFacet?.abi,
    functionName: "getAllProjects",
    chainId,
    watch: projectCount !== undefined,
  });

  return {
    projects: projects as Project[],
    isLoading: isLoadingCount || isLoadingProjects,
    projectCount,
  };
};