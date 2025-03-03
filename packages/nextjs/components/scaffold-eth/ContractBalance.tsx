"use client";

import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import externalContracts from "~~/contracts/externalContracts";
import { useDisplayUsdMode } from "~~/hooks/scaffold-eth/useDisplayUsdMode";
import { useGlobalState } from "~~/services/store/store";

type ContractBalanceProps = {
  className?: string;
  usdMode?: boolean;
};

/**
 * 显示SimpleTransaction合约中用户的余额
 */
export const ContractBalance = ({ className = "", usdMode }: ContractBalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);
  
  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  // 获取Aurora测试网上的SimpleTransaction合约
  const contractConfig = externalContracts[1313161555]?.SimpleTransaction;
  
  const { data, refetch } = useReadContract({
    address: contractConfig?.address as Address,
    abi: contractConfig?.abi,
    functionName: "getBalance",
    args: userAddress ? [userAddress] : undefined,
    chainId: targetNetwork.id,
    query: {
      enabled: !!userAddress,
      refetchInterval: 5000, // 每5秒刷新一次
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setBalance(data as bigint);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (userAddress) {
          await refetch();
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchBalance();
    // 设置定时器，每10秒刷新一次余额
    const intervalId = setInterval(fetchBalance, 10000);
    
    return () => clearInterval(intervalId);
  }, [userAddress, refetch]);

  if (!userAddress || isLoading || balance === null || (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0)) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-base-content/30 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer">
        <div className="text-warning">Error</div>
      </div>
    );
  }

  // 直接使用合约中的原始余额值
  const formattedBalance = Number(balance);

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleDisplayUsdMode}
      type="button"
    >
      <div className="w-full flex items-center justify-center">
        <span className="material-icons text-primary text-sm align-text-bottom mr-1">account_balance</span>
        {displayUsdMode ? (
          <>
            <span className="text-[0.8em] font-bold mr-1 text-primary">$</span>
            <span className="text-primary">{(formattedBalance * nativeCurrencyPrice).toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="text-primary">{formattedBalance.toFixed(0)}</span>
            <span className="text-[0.8em] font-bold ml-1 text-primary">USDT</span>
          </>
        )}
      </div>
    </button>
  );
}; 