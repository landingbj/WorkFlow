// src/nodes/image2text/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png'; // 需添加对应的图像转文字图标

let image2DetectIndex = 0;

export const Image2detectNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.IMAGE2DETECT,
  info: {
    icon: iconImage,
    description: '从图片中提取文本内容，支持网络图片URL输入。'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `image2detect_${nanoid(5)}`,
      type: WorkflowNodeType.IMAGE2DETECT,
      data: {
        title: `图像对象检测_${++image2DetectIndex}`,
        inputsValues: {
          imageUrl: {
            type: 'constant',
            content: 'https://example.com/image.jpg'
          },
          model: {
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
              description: '图片URL（支持HTTP/HTTPS，必须为网络路径）',
            },
            model: {
              type: 'string',
              description: '图文对象检测模型名称（可选）',
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              description: '图像对象检测识别结果，包含提取的文本内容'
            }
          },
          required: ['result']
        }
      }
    };
  },
};