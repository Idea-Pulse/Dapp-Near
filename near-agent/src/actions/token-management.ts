import { Action } from '@elizaos/core';
import { z } from 'zod';
import BigNumber from 'bignumber.js';
import { AIAgentProvider } from '../providers/ai-agent';

// 代币管理输入模型
const TokenManagementInput = z.object({
  action: z.enum(['allocate', 'release']),
  amount: z.string(), // BigNumber string
  recipient: z.string(),
  purpose: z.string(),
  lockupPeriod: z.number().optional(), // 锁定期(月)
  vestingSchedule: z.array(z.object({
    timestamp: z.number(),
    percentage: z.number()
  })).optional()
});

export class TokenManagementAction extends Action {
  async execute(input: z.infer<typeof TokenManagementInput>) {
    // 验证输入
    const validatedInput = TokenManagementInput.parse(input);
    
    // 获取 AI Agent
    const aiAgent = this.getProvider<AIAgentProvider>('ai-agent');
    
    // AI 审核代币操作
    const managementDecision = await aiAgent.manageTokenEconomy(
      validatedInput.action,
      {
        amount: new BigNumber(validatedInput.amount),
        recipient: validatedInput.recipient,
        purpose: validatedInput.purpose
      }
    );
    
    if (!managementDecision.approved) {
      return {
        success: false,
        reason: 'ai_rejected',
        conditions: managementDecision.conditions
      };
    }
    
    // 执行代币操作
    const amount = managementDecision.adjustedAmount || new BigNumber(validatedInput.amount);
    
    if (validatedInput.action === 'allocate') {
      // 分配代币
      await this.near.functionCall({
        contractId: this.config.get('TOKEN_CONTRACT'),
        methodName: 'allocate_tokens',
        args: {
          recipient: validatedInput.recipient,
          amount: amount.toString(),
          purpose: validatedInput.purpose,
          lockup_period: validatedInput.lockupPeriod,
          vesting_schedule: validatedInput.vestingSchedule
        }
      });
    } else {
      // 释放代币
      await this.near.functionCall({
        contractId: this.config.get('TOKEN_CONTRACT'),
        methodName: 'release_tokens',
        args: {
          recipient: validatedInput.recipient,
          amount: amount.toString()
        }
      });
    }
    
    return {
      success: true,
      amount: amount.toString(),
      action: validatedInput.action,
      recipient: validatedInput.recipient
    };
  }
} 