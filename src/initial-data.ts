/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowDocumentJSON } from './typings';

// 创建一个空的工作流数据结构
const createEmptyWorkflow = (): FlowDocumentJSON => {
  return {
    nodes: [],
    edges: [],
  };
};

// 创建一个包含开始和结束节点的默认工作流
const createDefaultWorkflow = (): FlowDocumentJSON => {
  return {
    nodes: [
      {
        id: 'start_0',
        type: 'start',
        meta: {
          position: { x: 180, y: 0 },
        },
        data: {
          title: '开始',
          outputs: {
            type: 'object',
            properties: {
              input: {
                type: 'string',
              }
            },
            required: ['input'],
          },
        },
      },
      {
        id: 'end_0',
        type: 'end',
        meta: {
          position: { x: 180, y: 180 },
        },
        data: {
          title: '结束',
          inputs: {
            type: 'object',
            properties: {
              output: {
                type: 'string',
              }
            },
            required: ['output'],
          },
        },
      },
    ],
    edges: [],
  };
};

// 显示错误提示
const showWorkflowLoadError = (message: string) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 6px;
    padding: 12px 16px;
    color: #cf1322;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const messageSpan = document.createElement('span');
  messageSpan.textContent = `工作流加载失败: ${message}`;
  messageSpan.style.flex = '1';

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: #cf1322;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  `;

  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = 'rgba(207, 19, 34, 0.1)';
  });

  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
  });

  const closeError = () => {
    if (document.body.contains(errorDiv)) {
      document.body.removeChild(errorDiv);
    }
  };

  closeButton.addEventListener('click', closeError);

  errorDiv.appendChild(messageSpan);
  errorDiv.appendChild(closeButton);

  document.body.appendChild(errorDiv);
};

export const getInitialData = async (): Promise<FlowDocumentJSON> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('agentId');

    if (!agentId) {
      console.warn('未提供 agentId 参数');
      showWorkflowLoadError('未提供 agentId 参数');
      return createEmptyWorkflow();
    }

    const response = await fetch(`/workflow/getFlowSchema?agentId=${agentId}`);

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status} ${response.statusText}`;
      console.error(`工作流加载失败: ${errorMessage}`);
      showWorkflowLoadError(errorMessage);
      return createEmptyWorkflow();
    }

    const data = await response.json();

    // 检查 data.status 为 success 但 data.schema 为空的情况
    if (data.status === 'success' && (!data.schema || data.schema === '')) {
      console.log('工作流数据为空，创建默认工作流');
      return createDefaultWorkflow();
    }

    if (!data || !data.schema) {
      console.error('工作流数据格式错误');
      showWorkflowLoadError('数据格式错误');
      return createEmptyWorkflow();
    }

    const schema = data.schema;
    const flowDocumentJSON = JSON.parse(schema) as FlowDocumentJSON;
    return flowDocumentJSON;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('工作流加载失败:', error);
    showWorkflowLoadError(errorMessage);
    return createEmptyWorkflow();
  }
};

export const initialData: FlowDocumentJSON = await getInitialData();
