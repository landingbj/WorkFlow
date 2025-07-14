import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconKnowledgeBase from '../../assets/icon-knowledge-base.jpg';

let index = 0;

export const KnowledgeBaseNodeRegistry: FlowNodeRegistry = {
    type: WorkflowNodeType.KNOWLEDGE_BASE,
    info: {
        icon: iconKnowledgeBase,
        description: '从知识库中检索相关内容，用于丰富上下文或响应生成。',
    },
    meta: {
        size: {
            width: 360,
            height: 340,
        },
    },
    onAdd() {
        return {
            id: `kb_${nanoid(5)}`,
            type: 'knowledgeBase',
            data: {
                title: `知识库_${++index}`,
                inputsValues: {
                    query: {
                        type: 'constant',
                        content: '',
                    },
                    topK: {
                        type: 'constant',
                        content: 3,
                    },
                },
                inputs: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                        query: {
                            type: 'string',
                        },
                        topK: {
                            type: 'number',
                        },
                    },
                },
                outputs: {
                    type: 'object',
                    properties: {
                        context: { type: 'string' },
                    },
                },
            },
        };
    },
};
