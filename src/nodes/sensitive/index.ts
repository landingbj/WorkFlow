// src/nodes/sensitive/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let sensitiveIndex = 0;

export const SensitiveNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.SENSITIVE,
  info: {
    icon: iconImage,
    description: '对文本进行敏感词过滤'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `sensitive_${nanoid(5)}`,
      type: WorkflowNodeType.SENSITIVE,
      data: {
        title: `敏感词过滤_${++sensitiveIndex}`,
        inputsValues: {
          text: {
            type: 'constant',
            content: ''
          }
        },
        inputs: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: '要过滤的文本'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
              description: '过滤后的文本'
            }
          },
          required: ['result']
        }
      }
    };
  },
};