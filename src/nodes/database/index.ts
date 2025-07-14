import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconDatabase from '../../assets/icon-database.jpg';

let index = 0;

export const DatabaseNodeRegistry: FlowNodeRegistry = {
    type: WorkflowNodeType.DATABASE,
    info: {
        icon: iconDatabase,
        description: '执行数据库查询，支持 SQL 语句或参数化模板。',
    },
    meta: {
        size: {
            width: 360,
            height: 360,
        },
    },
    onAdd() {
        return {
            id: `db_${nanoid(5)}`,
            type: 'database',
            data: {
                title: `数据库_${++index}`,
                inputsValues: {
                    query: {
                        type: 'constant',
                        content: 'SELECT * FROM table WHERE id = {{inputId}}',
                    },
                    connectionString: {
                        type: 'constant',
                        content: '',
                    },
                },
                inputs: {
                    type: 'object',
                    required: ['query', 'connectionString'],
                    properties: {
                        query: {
                            type: 'string',
                        },
                        connectionString: {
                            type: 'string',
                        },
                    },
                },
                outputs: {
                    type: 'object',
                    properties: {
                        result: { type: 'string' },
                    },
                },
            },
        };
    },
};
