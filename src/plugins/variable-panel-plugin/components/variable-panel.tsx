/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState, useContext } from 'react';

import { Button, Collapsible, Tabs, Tooltip } from '@douyinfe/semi-ui';
import { IconMinus } from '@douyinfe/semi-icons';

import { ToolbarContext } from '../../../context/toolbar-context';
import iconVariable from '../../../assets/icon-variable.png';
// import { GlobalVariableEditor } from './global-variable-editor';
import { FullVariableList } from './full-variable-list';

import styles from './index.module.less';

export function VariablePanel() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { isCodeFlowMode } = useContext(ToolbarContext);

  // Hide variable panel when in code flow mode
  if (isCodeFlowMode) {
    return null;
  }

  return (
    <div className={styles['panel-wrapper']}>
      <Tooltip content="切换变量面板">
        <Button
          className={`${styles['variable-panel-button']} ${isOpen ? styles.close : ''}`}
          theme={isOpen ? 'borderless' : 'light'}
          onClick={() => setOpen((_open) => !_open)}
        >
          {isOpen ? <IconMinus /> : <img src={iconVariable} width={20} height={20} />}
        </Button>
      </Tooltip>
      <Collapsible isOpen={isOpen}>
        <div className={styles['panel-container']}>
          <Tabs>
            <Tabs.TabPane itemKey="variables" tab="变量列表">
              <FullVariableList />
            </Tabs.TabPane>
            {/* <Tabs.TabPane itemKey="global" tab="全局编辑器">
              <GlobalVariableEditor />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </Collapsible>
    </div>
  );
}
