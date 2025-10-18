/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';
import { ToolbarContext } from './context/toolbar-context';

export const Editor = () => {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [isCodeFlowMode, setIsCodeFlowMode] = useState(false);

  return (
    <div className="doc-free-feature-overview">
      <FreeLayoutEditorProvider {...editorProps}>
        <ToolbarContext.Provider value={{ toolbarVisible, setToolbarVisible, isCodeFlowMode, setIsCodeFlowMode }}>
          <SidebarProvider>
            <div className="demo-container">
              <EditorRenderer className="demo-editor" />
            </div>
            <DemoTools />
            <SidebarRenderer />
          </SidebarProvider>
        </ToolbarContext.Provider>
      </FreeLayoutEditorProvider>
    </div>
  );
};
