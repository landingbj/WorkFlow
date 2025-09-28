// src/nodes/api/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconAPI from '../../assets/icon-api.png';

let index = 0;

export const APINodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.API,
  info: {
    icon: iconAPI,
    description: '调用外部API接口，支持多种HTTP方法和自定义参数配置。'
  },
  meta: {
    size: {
      width: 360,
      height: 480,
    },
  },
  onAdd() {
    return {
      id: `api_${nanoid(5)}`,
      type: WorkflowNodeType.API,
      data: {
        title: `API调用_${++index}`,
        inputsValues: {
          url: {
            type: 'constant',
            content: 'https://api.example.com'
          },
          method: {
            type: 'constant',
            content: 'GET'
          },
          query: {
            type: 'template',
            content: '{}'
          },
          headers: {
            type: 'template',
            content: '{"Content-Type": "application/json"}'
          },
          body: {
            type: 'template',
            content: '{}'
          }
        },
        inputs: {
          type: 'object',
          required: ['url', 'method'],
          properties: {
            url: {
              type: 'string',
              description: 'API请求地址'
            },
            method: {
              type: 'string',
              enum: ['POST', 'PUT', 'DELETE', 'PATCH', 'GET'],
              description: 'HTTP请求方法'
            },
            query: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                placeholder: '查询参数(JSON格式)'
              },
              description: 'URL查询参数'
            },
            headers: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                placeholder: '请求头(JSON格式)'
              },
              description: '请求头信息'
            },
            body: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                language: 'json',
                placeholder: '请求体数据'
              },
              description: '请求体内容'
            }
          }
        },
        outputs: {
          type: 'object',
          properties: {
            statusCode: { 
              type: 'number',
              description: 'HTTP响应状态码'
            },
            body: { 
              type: 'string',
              description: 'HTTP响应体内容'
            }
          },
          required: ['statusCode', 'body']
        }
      }
    };
  },
};