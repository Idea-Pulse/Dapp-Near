import { Action } from '@elizaos/core';
import { z } from 'zod';
import { AIAgentProvider } from '../providers/ai-agent';

// 创意提案输入模型
const IdeaProposalInput = z.object({
  idea: z.string(),
  creator: z.string(), // 创建者地址
  socialPlatform: z.enum(['twitter', 'farcaster']),
  socialId: z.string(), // 社交平台ID
});

export class IdeaProposalAction extends Action {
  async execute(input: z.infer<typeof IdeaProposalInput>) {
    // 验证输入
    const validatedInput = IdeaProposalInput.parse(input);
    
    // 获取 AI Agent
    const aiAgent = this.getProvider<AIAgentProvider>('ai-agent');
    
    // 处理提案
    const proposal = await aiAgent.processIdeaProposal(validatedInput.idea);
    
    // 创建链上提案
    const proposalTx = await this.near.functionCall({
      contractId: this.config.get('DAO_CONTRACT'),
      methodName: 'create_proposal',
      args: {
        proposal_type: 'idea',
        description: validatedInput.idea,
        technical_path: proposal.technicalPath,
        budget: proposal.budget.toString(),
        milestones: proposal.milestones,
        risk_assessment: proposal.riskAssessment,
        creator: validatedInput.creator,
        social_platform: validatedInput.socialPlatform,
        social_id: validatedInput.socialId
      }
    });
    
    return {
      proposalId: proposalTx.transaction_outcome.id,
      ...proposal
    };
  }
} 