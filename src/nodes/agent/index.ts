/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconAgent from '../../assets/icon-agent.png'; // 假设存在该图标

let index = 0;

const getUserIdFromCookie = (): string => {
  if (typeof document === 'undefined') {
    // 非浏览器环境（如SSR）返回空字符串
    return '';
  }
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'userId') {
      // 解码cookie值（处理特殊字符）
      return decodeURIComponent(value);
    }
  }
  return ''; // 未找到userId时返回空
};


export const AgentNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.AGENT, // 假设定义了 Agent 类型
  info: {
    icon: iconAgent,
    description: '智能体节点',
  },
  meta: {
    size: { width: 300, height: 120 },
  },
  onAdd() {
    return {
      id: `agent_${nanoid(5)}`,
      type: WorkflowNodeType.AGENT,
      data: {
        title: `智能体_${++index}`,
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
            agent: {
              type: 'string',
              extra: {
                formComponent: 'select', // 指定使用 select 组件
                fetchOptions: {
                  url: '/agent/getAgentLabel?lagiUserId=' + getUserIdFromCookie(), // 拉取选项的接口
                  method: 'GET',
                },
              },
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