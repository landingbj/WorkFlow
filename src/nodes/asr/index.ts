// src/nodes/asr/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconASR from '../../assets/icon-asr.png'; // 需添加对应的ASR图标

let asrIndex = 0;

export const ASRNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.ASR,
  info: {
    icon: iconASR,
    description: '将音频文件转换为文本，支持多种音频格式和自定义模型参数。'
  },
  meta: {
    size: {
      width: 360,
      height: 480,
    },
  },
  onAdd() {
    return {
      id: `asr_${nanoid(5)}`,
      type: WorkflowNodeType.ASR,
      data: {
        title: `ASR识别_${++asrIndex}`,
        inputsValues: {
          audioUrl: {
            type: 'constant',
            content: 'https://example.com/audio.wav'
          },
          model: {
            type: 'constant',
            content: ''
          },
          format: {
            type: 'constant',
            content: 'wav'
          },
          sample_rate: {
            type: 'constant',
            content: 16000
          }
        },
        inputs: {
          type: 'object',
          required: ['audioUrl'],
          properties: {
            audioUrl: {
              type: 'string',
              description: '音频文件URL（支持HTTP/HTTPS）',
            },
            model: {
              type: 'string',
              description: '语音识别模型名称（可选）'
            },
            format: {
              type: 'string',
              description: '音频格式（如wav、mp3等，可选）'
            },
            sample_rate: {
              type: 'number',
              description: '音频采样率（如16000，可选）'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              description: '语音识别结果，包含识别文本及相关信息'
            }
          },
          required: ['result']
        }
      }
    };
  },
};