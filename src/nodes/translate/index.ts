// src/nodes/translate/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let translateIndex = 0;

export const TranslateNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.TRANSLATE,
  info: {
    icon: iconImage,
    description: '将文本翻译成目标语言'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `translate_${nanoid(5)}`,
      type: WorkflowNodeType.TRANSLATE,
      data: {
        title: `翻译_${++translateIndex}`,
        inputsValues: {
          text: {
            type: 'constant',
            content: ''
          },
          targetLanguage: {
            type: 'constant',
            content: 'en'
          }
        },
        inputs: {
          type: 'object',
          required: ['text', 'targetLanguage'],
          properties: {
            text: {
              type: 'string',
              description: '要翻译的文本'
            },
            targetLanguage: {
              type: 'string',
              description: '目标语言（en/english/zh/chinese）'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
              description: '翻译后的文本'
            },
            sourceText: {
              type: 'string',
              description: '源文本'
            }
          },
          required: ['result', 'sourceText']
        }
      }
    };
  },
};