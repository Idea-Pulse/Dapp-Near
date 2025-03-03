import type { Plugin } from "@elizaos/core";
import { walletProvider } from "./providers/wallet";
// import { executeCreateToken } from "./actions/createToken";
import { executeSwap } from "./actions/swap";
import { executeTransfer } from "./actions/transfer";
import { AIAgentProvider } from './providers/ai-agent';
import { IdeaProposalAction, TaskAuditAction, TokenManagementAction } from './actions/idea-proposal';

export const nearPlugin: Plugin = {
    name: "NEAR",
    description: "Near Protocol Plugin for Eliza",
    providers: [walletProvider],
    actions: [executeSwap, executeTransfer],
    evaluators: [],
};

export default nearPlugin;

export * from './providers/ai-agent';
export * from './actions/idea-proposal';
export * from './actions/task-audit';
export * from './actions/token-management';

// 导出插件配置类型
export interface PluginConfig {
  DAO_CONTRACT: string;
  TOKEN_CONTRACT: string;
  AI_AGENT: {
    tokenReserveRatio: number;
    proposalThreshold: number;
    votingPeriod: number;
    auditInterval: number;
  };
}

// 导出插件实例创建函数
export function createPlugin(config: PluginConfig) {
  return {
    providers: {
      'ai-agent': new AIAgentProvider(config.AI_AGENT)
    },
    actions: {
      'idea-proposal': IdeaProposalAction,
      'task-audit': TaskAuditAction,
      'token-management': TokenManagementAction
    }
  };
}
