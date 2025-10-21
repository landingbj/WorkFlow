/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconAgent from '../../assets/icon-agent.png';

let index = 0;
export const AgentNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.AGENT,
  info: {
    icon: iconAgent,
    description:
      '调用智能体，使用变量和用户输入生成响应。',
  },
  meta: {
    size: {
      width: 360,
      height: 390,
    },
  },
  onAdd() {
    return {
      id: `agent_${nanoid(5)}`,
      type: 'agent',
      data: {
        title: `智能体_${++index}`,
        inputsValues: {
          agent: {
            type: 'constant',
            content: '112',
          },
          query: {
            type: 'constant',
            content: '',
          },
        },
        inputs: {
          type: 'object',
          required: ['agent', 'query'],
          properties: {
            agent: {
              type: 'string',
            },
            query: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
              },
            }
          },
        },
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
