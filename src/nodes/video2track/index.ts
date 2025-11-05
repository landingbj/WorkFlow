// src/nodes/video2track/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let video2TrackIndex = 0;

export const Video2TrackNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.VIDEO2TRACK,
  info: {
    icon: iconImage,
    description: '对视频进行目标追踪处理'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `video2track_${nanoid(5)}`,
      type: WorkflowNodeType.VIDEO2TRACK,
      data: {
        title: `视频追踪_${++video2TrackIndex}`,
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
              description: '视频追踪模型'
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