/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { FlowNodeRegistry } from '../../typings';
import iconCondition from '../../assets/icon-condition.svg';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';

export const ConditionNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Condition,
  info: {
    icon: iconCondition,
    description:
      '连接多个分支节点，仅当满足设定条件时才会执行对应的分支。',
  },
  meta: {
    defaultPorts: [{ type: 'input' }],
    // Condition Outputs use dynamic port
    useDynamicPort: true,
    expandable: false, // disable expanded
  },
  formMeta,
  onAdd() {
    return {
      id: `condition_${nanoid(5)}`,
      type: 'condition',
      data: {
        title: '条件判断',
        conditions: [
          {
            key: `if_${nanoid(5)}`,
            value: {},
          },
          {
            key: `if_${nanoid(5)}`,
            value: {},
          },
        ],
      },
    };
  },
};
