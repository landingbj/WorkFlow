// src/nodes/image2video/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let image2VideoIndex = 0;

export const Image2VideoNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.IMAGE2VIDEO,
  info: {
    icon: iconImage,
    description: '根据图像生成视频'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `image2video_${nanoid(5)}`,
      type: WorkflowNodeType.IMAGE2VIDEO,
      data: {
        title: `图生视频_${++image2VideoIndex}`,
        inputsValues: {
          imageUrl: {
            type: 'constant',
            content: 'https://example.com/image.jpg'
          },
          model: {
            type: 'constant',
            content: 'default'
          },
          prompt: {
            type: 'constant',
            content: ''
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
              description: '视频生成模型'
            },
            prompt: {
              type: 'string',
              description: '文本提示词'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              description: '视频任务响应对象'
            }
          },
          required: ['result']
        }
      }
    };
  },
};