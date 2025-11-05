// src/nodes/text2video/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let text2VideoIndex = 0;

export const Text2VideoNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.TEXT2VIDEO,
  info: {
    icon: iconImage,
    description: '根据文本提示生成视频'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `text2video_${nanoid(5)}`,
      type: WorkflowNodeType.TEXT2VIDEO,
      data: {
        title: `文生视频_${++text2VideoIndex}`,
        inputsValues: {
          prompt: {
            type: 'constant',
            content: ''
          },
          model: {
            type: 'constant',
            content: 'default'
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
              description: '视频生成模型'
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