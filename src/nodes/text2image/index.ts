// src/nodes/text2image/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let text2ImageIndex = 0;

export const Text2ImageNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.TEXT2IMAGE,
  info: {
    icon: iconImage,
    description: '根据文本提示生成图像'
  },
  meta: {
    size: {
      width: 360,
      height: 480,
    },
  },
  onAdd() {
    return {
      id: `text2image_${nanoid(5)}`,
      type: WorkflowNodeType.TEXT2IMAGE,
      data: {
        title: `文生图_${++text2ImageIndex}`,
        inputsValues: {
          prompt: {
            type: 'constant',
            content: ''
          },
          model: {
            type: 'constant',
            content: 'default'
          },
          negative_prompt: {
            type: 'constant',
            content: ''
          },
          style: {
            type: 'constant',
            content: ''
          }
        },
        inputs: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: {
              type: 'string',
              description: '文本提示词'
            },
            model: {
              type: 'string',
              description: '图像生成模型'
            },
            negative_prompt: {
              type: 'string',
              description: '负面提示词'
            },
            style: {
              type: 'string',
              description: '图像风格'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              description: '图像生成结果'
            }
          },
          required: ['result']
        }
      }
    };
  },
};