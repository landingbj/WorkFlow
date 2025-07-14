import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconIntent from '../../assets/icon-intent.jpg';

let index = 0;

export const IntentDetectNodeRegistry: FlowNodeRegistry = {
    type: WorkflowNodeType.INTENT_RECOGNITION,
    info: {
        icon: iconIntent,
        description: '识别用户输入的意图，用于分支流程判断。',
    },
    meta: {
        size: {
            width: 360,
            height: 330,
        },
    },
    onAdd() {
        return {
            id: `intent_${nanoid(5)}`,
            type: 'intentRecognition',
            data: {
                title: `意图识别_${++index}`,
                inputsValues: {
                    text: {
                        type: 'constant',
                        content: '',
                    },
                },
                inputs: {
                    type: 'object',
                    required: ['text'],
                    properties: {
                        text: {
                            type: 'string',
                        },
                    },
                },
                outputs: {
                    type: 'object',
                    properties: {
                        intent: { type: 'string' },
                        confidence: { type: 'number' },
                    },
                },
            },
        };
    },
};
