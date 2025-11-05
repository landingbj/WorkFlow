// src/nodes/image2enhance/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let image2EnhanceIndex = 0;

export const Image2EnhanceNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.IMAGE2ENHANCE,
  info: {
    icon: iconImage,
    description: '对图像进行增强处理'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `image2enhance_${nanoid(5)}`,
      type: WorkflowNodeType.IMAGE2ENHANCE,
      data: {
        title: `图像增强_${++image2EnhanceIndex}`,
        inputsValues: {
          imageUrl: {
            type: 'constant',
            content: 'https://example.com/image.jpg'
          },
          model: {
            type: 'constant',
            content: 'default'
          }
        },
        inputs: {
          type: 'object',
          required: ['imageUrl'],
          properties: {
            imageUrl: {
              type: 'string',
              description: '图像URL地址'
            },
            model: {
              type: 'string',
              description: '图像增强模型'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              description: '图像增强结果'
            }
          },
          required: ['result']
        }
      }
    };
  },
};