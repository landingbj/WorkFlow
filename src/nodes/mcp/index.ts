/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconMcpAgent from '../../assets/icon-agent.png'; // 假设存在该图标

let index = 0;


export const McpAgentNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.MCP_AGENT, // 假设定义了 McpAgent 类型
  info: { 
    icon: iconMcpAgent,
    description: 'mcp智能体节点',
  },
  meta: {
    size: { width: 300, height: 120 },
  },
  onAdd() {
    return {
      id: `mcp_agent_${nanoid(5)}`,
      type: WorkflowNodeType.MCP_AGENT,
      data: {
        title: `MCP服务智能体_${++index}`,
        inputsValues: {
          agent: {
            type: 'constant',
            content: '', // 默认选中值
          },
          query: {
            type: 'constant',
            content: '',
          },
      },
      inputs: {
          type: 'object',
          required: ['agent'],
          properties: {
            mcp: {
              type: 'string',
            },
            query: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
              },
            },
        }},
        outputs: {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        },
      },
    };
  },
};