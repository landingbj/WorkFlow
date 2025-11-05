// src/nodes/video2enhance/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let video2EnhanceIndex = 0;

export const Video2EnhanceNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.VIDEO2ENHANCE,
  info: {
    icon: iconImage,
    description: '对视频进行增强处理'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `video2enhance_${nanoid(5)}`,
      type: WorkflowNodeType.VIDEO2ENHANCE,
      data: {
        title: `视频增强_${++video2EnhanceIndex}`,
        inputsValues: {
          videoUrl: {
            type: 'constant',
            content: 'https://example.com/video.mp4'
          },
          model: {
            type: 'constant',
            content: 'default'
          }
        },
        inputs: {
          type: 'object',
          required: ['videoUrl'],
          properties: {
            videoUrl: {
              type: 'string',
              description: '视频URL地址'
            },
            model: {
              type: 'string',
              description: '视频增强模型'
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