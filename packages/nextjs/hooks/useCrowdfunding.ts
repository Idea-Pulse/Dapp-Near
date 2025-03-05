import { useContractRead, useContractWrite, useTransaction } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

export interface FundingInfo {
  fundingGoal: bigint;
  raisedAmount: bigint;
  startTime: bigint;
  endTime: bigint;
  hasMetFundingGoal: boolean;
  paymentToken: string;
}

export const useCrowdfunding = (projectId?: string) => {
  const { data: crowdfundingFacet } = useDeployedContractInfo("CrowdfundingFacet");
  const chainId = getTargetNetworks()[0].id;

  // Get funding info
  const { data: fundingInfo, isLoading: isLoadingFundingInfo } = useContractRead({
    address: crowdfundingFacet?.address,
    abi: crowdfundingFacet?.abi,
    functionName: "getFundingInfo",
    args: [projectId],
    chainId,
    watch: !!projectId,
  });

  // Contribute to project
  const { data: contributeData, writeAsync: contribute, isLoading: isContributing } = useContractWrite({
    address: crowdfundingFacet?.address,
    abi: crowdfundingFacet?.abi,
    functionName: "contribute",
  });

  // Wait for contribution transaction
  const { isLoading: isWaitingForContribution } = useTransaction({
    hash: contributeData?.hash,
  });

  // Get user contribution
  const { data: userContribution, isLoading: isLoadingUserContribution } = useContractRead({
    address: crowdfundingFacet?.address,
    abi: crowdfundingFacet?.abi,
    functionName: "getContribution",
    args: [projectId],
    chainId,
    watch: !!projectId,
  });

  return {
    fundingInfo: fundingInfo as FundingInfo,
    contribute: (amount: bigint) => contribute?.({ args: [projectId, amount] }),
    userContribution,
    isLoading:
      isLoadingFundingInfo ||
      isContributing ||
      isWaitingForContribution ||
      isLoadingUserContribution,
  };
};