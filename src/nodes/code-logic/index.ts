/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconProgram from '../../assets/icon-program.png';

let index = 0;

export const CodeLogicNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.CodeLogic,
  info: {
    icon: iconProgram,
    description: 'Code Logic Node - Code block with text editor',
  },
  meta: {
    size: {
      width: 360,
      height: 380,
    },
  },
  onAdd() {
    return {
      id: `code_logic_${nanoid(5)}`,
      type: WorkflowNodeType.CodeLogic,
      data: {
        title: `Code Logic_${++index}`,
        inputsValues: {
          code: {
            type: 'constant',
            content: '',
          },
        },
        inputs: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
              },
            },
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

