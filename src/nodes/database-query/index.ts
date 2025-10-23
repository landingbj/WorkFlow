// src/nodes/data-query/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconDataQuery from '../../assets/icon-data-query.png'; // 假设存在该图标

let queryIndex = 0;

export const DataBaseQueryNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.DATABASE_QUERY,
  info: {
    icon: iconDataQuery,
    description: '执行数据库查询操作，支持SQL语句和参数化查询。',
  },
  meta: {
    size: {
      width: 360,
      height: 420,
    },
  },
  onAdd() {
    return {
      id: `data_query_${nanoid(5)}`,
      type: WorkflowNodeType.DATABASE_QUERY,
      data: {
        title: `数据查询_${++queryIndex}`,
        inputsValues: {
          databaseName: {
            type: 'constant',
            content: '',
          },
          sql: {
            type: 'template',
            content: 'SELECT * FROM table WHERE id = {{params.id}}',
          },
          parameters: {
            type: 'template',
            content: '[]',
          },
        },
        inputs: {
          type: 'object',
          required: ['databaseName', 'sql'],
          properties: {
            databaseName: {
              type: 'string',
              description: '数据库连接名称',
            },
            sql: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                language: 'sql',
              },
              description: 'SQL查询语句（支持模板变量）',
            },
            parameters: {
              type: 'array',
              items: {
                type: 'string',
              },
              extra: {
                formComponent: 'prompt-editor',
                language: 'json',
              },
              description: '查询参数数组（JSON格式）',
            },
          },
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
              description: '查询结果（JSON字符串）',
            },
          },
          required: ['result'],
        },
      },
    };
  },
};