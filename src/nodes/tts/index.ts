// src/nodes/tts/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconASR from '../../assets/icon-asr.png';

let ttsIndex = 0;

export const TTSNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.TTS,
  info: {
    icon: iconASR,
    description: '将文本转换为语音'
  },
  meta: {
    size: {
      width: 360,
      height: 480,
    },
  },
  onAdd() {
    return {
      id: `tts_${nanoid(5)}`,
      type: WorkflowNodeType.TTS,
      data: {
        title: `TTS_${++ttsIndex}`,
        inputsValues: {
          text: {
            type: 'constant',
            content: ''
          },
          model: {
            type: 'constant',
            content: 'default'
          },
          voice: {
            type: 'constant',
            content: ''
          },
          volume: {
            type: 'constant',
            content: 50
          },
          format: {
            type: 'constant',
            content: 'mp3'
          }
        },
        inputs: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: '要合成的文本'
            },
            model: {
              type: 'string',
              description: '语音合成模型'
            },
            voice: {
              type: 'string',
              description: '音色'
            },
            volume: {
              type: 'number',
              description: '音量'
            },
            format: {
              type: 'string',
              description: '音频格式'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
              description: '语音合成结果'
            }
          },
          required: ['result']
        }
      }
    };
  },
};