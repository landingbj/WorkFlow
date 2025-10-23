// src/nodes/database-update/index.ts
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconDatabaseUpdate from '../../assets/icon-database-update.png'; // 假设存在该图标

let updateIndex = 0;

export const DatabaseUpdateNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.DATABASE_UPDATE,
  info: {
    icon: iconDatabaseUpdate,
    description: '执行数据库更新或插入操作，支持配置操作类型和数据。',
  },
  meta: {
    size: {
      width: 360,
      height: 450,
    },
  },
  onAdd() {
    return {
      id: `db_update_${nanoid(5)}`,
      type: WorkflowNodeType.DATABASE_UPDATE,
      data: {
        title: `数据库操作_${++updateIndex}`,
        inputsValues: {
          databaseName: {
            type: 'constant',
            content: '',
          },
          operationType: {
            type: 'constant',
            content: 'insert',
          },
          tableName: {
            type: 'constant',
            content: '',
          },
          data: {
            type: 'template',
            content: '{"key": "value"}',
          },
          where: {
            type: 'template',
            content: '{"key": "value"}',
          },
        },
        inputs: {
          type: 'object',
          required: ['databaseName', 'operationType', 'tableName', 'data'],
          properties: {
            databaseName: {
              type: 'string',
              description: '数据库连接名称',
            },
            operationType: {
              type: 'string',
              enum: ['update', 'insert'],
              description: '操作类型',
            },
            tableName: {
              type: 'string',
              description: '操作的表名',
            },
            data: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                language: 'json',
              },
              description: '操作数据（JSON格式，支持模板变量）',
            },
            where: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
                language: 'json',
              },
              description: '所需更新的变量筛选条件 （JSON格式，支持模板变量',
            },
          },
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
              description: '操作结果（包含影响行数等信息）',
            },
          },
          required: ['result'],
        },
      },
    };
  },
};