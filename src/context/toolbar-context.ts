/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createContext } from 'react';

interface ToolbarContextType {
  toolbarVisible: boolean;
  setToolbarVisible: (visible: boolean) => void;
  isCodeFlowMode: boolean;
  setIsCodeFlowMode: (isCodeFlow: boolean) => void;
}

export const ToolbarContext = createContext<ToolbarContextType>({
  toolbarVisible: true,
  setToolbarVisible: () => {},
  isCodeFlowMode: false,
  setIsCodeFlowMode: () => {},
});

