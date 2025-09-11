import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconProgram from '../../assets/icon-program.png';

let index = 0;

export const ProgramNodeRegistry: FlowNodeRegistry = {
    type: WorkflowNodeType.Program,
    info: {
        icon: iconProgram,
        description: '通用编程，使用groovy脚本语言',
    },
    meta: {
        size: {
            width: 360,
            height: 480,
        },
    },
    onAdd() {
        return {
            id: `program_${nanoid(5)}`,
            type: WorkflowNodeType.Program,
            data: {
                title: `程序_${++index}`,
                inputsValues: {
                    script: {
                        type: 'constant',
                        content: 'default',
                    }
                },
                inputs: {
                    type: 'object',
                    required: ['script'],
                    properties: {
                        script: {
                            type: 'string',
                            extra: {
                                formComponent: 'prompt-editor',
                            },
                        },
                    },
                },
                outputs: {
                    type: 'object',
                    properties: {
                        result: { type: 'string' },
                    },
                    required: ['result'],
                },
            },
        };
    },
};
