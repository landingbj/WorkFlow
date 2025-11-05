// src/nodes/ocr/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconImage from '../../assets/icon-image.png';

let ocrIndex = 0;

export const OcrNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.OCR,
  info: {
    icon: iconImage,
    description: '对图像进行OCR文字识别'
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `ocr_${nanoid(5)}`,
      type: WorkflowNodeType.OCR,
      data: {
        title: `OCR_${++ocrIndex}`,
        inputsValues: {
          imageUrl: {
            type: 'constant',
            content: 'https://example.com/image.jpg'
          }
        },
        inputs: {
          type: 'object',
          required: ['imageUrl'],
          properties: {
            imageUrl: {
              type: 'string',
              description: '图像URL地址或本地文件路径'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'array',
              description: 'OCR识别的文字列表'
            }
          },
          required: ['result']
        }
      }
    };
  },
};