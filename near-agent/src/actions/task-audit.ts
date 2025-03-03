import { Action } from '@elizaos/core';
import { z } from 'zod';
import { AIAgentProvider } from '../providers/ai-agent';

// 任务审核输入模型
const TaskAuditInput = z.object({
  taskId: z.string(),
  submissionId: z.string(),
  contributor: z.string(),
  submission: z.any() // 提交内容(代码/文档等)
});

export class TaskAuditAction extends Action {
  async execute(input: z.infer<typeof TaskAuditInput>) {
    // 验证输入
    const validatedInput = TaskAuditInput.parse(input);
    
    // 获取 AI Agent
    const aiAgent = this.getProvider<AIAgentProvider>('ai-agent');
    
    // 审核贡献者资质
    const contributorAudit = await aiAgent.auditContributor(
      validatedInput.contributor,
      validatedInput.taskId
    );
    
    if (!contributorAudit.qualified) {
      return {
        passed: false,
        reason: 'contributor_not_qualified',
        feedback: contributorAudit.feedback
      };
    }
    
    // 审计开发成果
    const developmentAudit = await aiAgent.auditDevelopment(
      validatedInput.taskId,
      validatedInput.submission
    );
    
    // 更新链上任务状态
    if (developmentAudit.passed) {
      await this.near.functionCall({
        contractId: this.config.get('DAO_CONTRACT'),
        methodName: 'complete_task',
        args: {
          task_id: validatedInput.taskId,
          submission_id: validatedInput.submissionId,
          quality_score: developmentAudit.quality,
          audit_result: {
            passed: true,
            issues: developmentAudit.issues,
            suggestions: developmentAudit.suggestions
          }
        }
      });
    }
    
    return {
      passed: developmentAudit.passed,
      quality: developmentAudit.quality,
      issues: developmentAudit.issues,
      suggestions: developmentAudit.suggestions
    };
  }
} 