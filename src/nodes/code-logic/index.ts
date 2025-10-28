/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import iconProgram from '../../assets/icon-program.png';
import { formMeta } from './form-meta';

let index = 0;

export const CodeLogicNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.CodeLogic,
  info: {
    icon: iconProgram,
    description: 'Code Logic Node - Code block with text editor',
  },
  meta: {
    size: {
      width: 360,
      height: 200,
    },
    deleteDisable: true,
    copyDisable: true,
    sidebarDisabled: true,
    nodePanelVisible: false,
  },
  formMeta,
  canDelete: () => false,
  onAdd() {
    return {
      id: `code_logic_${nanoid(5)}`,
      type: WorkflowNodeType.CodeLogic,
      data: {
        title: `Code Logic_${++index}`,
        content: '代码逻辑测试'
      },
    };
  },
};

