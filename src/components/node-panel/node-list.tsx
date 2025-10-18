/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { FC, useState, useEffect } from 'react';

import styled from 'styled-components';
import { NodePanelRenderProps } from '@flowgram.ai/free-node-panel-plugin';
import { useClientContext } from '@flowgram.ai/free-layout-editor';

import { FlowNodeRegistry } from '../../typings';
import { nodeRegistries } from '../../nodes';

const NodeWrap = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 19px;
  padding: 0 15px;
  &:hover {
    background-color: hsl(252deg 62% 55% / 9%);
    color: hsl(252 62% 54.9%);
  }
`;

const NodeLabel = styled.div`
  font-size: 12px;
  margin-left: 10px;
`;

interface NodeProps {
  label: string;
  icon: JSX.Element;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled: boolean;
}

function Node(props: NodeProps) {
  return (
    <NodeWrap
      data-testid={`demo-free-node-list-${props.label}`}
      onClick={props.disabled ? undefined : props.onClick}
      style={props.disabled ? { opacity: 0.3 } : {}}
    >
      <div style={{ fontSize: 14 }}>{props.icon}</div>
      <NodeLabel>{props.label}</NodeLabel>
    </NodeWrap>
  );
}

const NodesWrap = styled.div`
  max-height: 500px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// 加载状态样式
const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #666;
  font-size: 12px;
`;

const getNodeTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'start': '开始',
    'end': '结束',
    'llm': '大语言模型',
    'condition': '条件判断',
    'loop': '循环',
    'block-start': '块开始',
    'block-end': '块结束',
    'comment': '注释',
    'knowledge-base': '知识库',
    'program': '通用编程',
    'intent-recognition': '意图识别',
    'api': 'api 调用',
    'asr': '语音识别',
    'image2text': '图转文',
    'code-logic': '代码逻辑',
  };

  return typeLabels[type] || type;
};

interface NodeListProps {
  onSelect: NodePanelRenderProps['onSelect'];
}

export const NodeList: FC<NodeListProps> = (props) => {
  const { onSelect } = props;
  const context = useClientContext();
  const [validNodes, setValidNodes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 调用API获取有效节点列表
  useEffect(() => {
    const fetchValidNodes = async () => {
      setValidNodes(nodeRegistries.map(registry => registry.type as string));
      setLoading(false);
      return; // 暂时注释掉API调用，直接使用本地节点列表
      try {
        setLoading(true);
        const response = await fetch('/workflow/getValidNodes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 检查API返回格式是否正确
        if (result.code === 0 && Array.isArray(result.data)) {
          setValidNodes(result.data);
          setError(null);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Failed to fetch valid nodes:', err);
        setError('获取节点列表失败，请稍后重试');
        // 出错时显示所有节点作为 fallback
        setValidNodes(nodeRegistries.map(registry => registry.type as string));
      } finally {
        setLoading(false);
      }
    };

    fetchValidNodes();
  }, []);

  const handleClick = (e: React.MouseEvent, registry: FlowNodeRegistry) => {
    const json = registry.onAdd?.(context);
    onSelect({
      nodeType: registry.type as string,
      selectEvent: e,
      nodeJSON: json,
    });
  };

  // 加载状态显示
  if (loading) {
    return (
      <NodesWrap style={{ width: 80 * 2 + 20 }}>
        <LoadingWrap>加载节点列表中...</LoadingWrap>
      </NodesWrap>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <NodesWrap style={{ width: 80 * 2 + 20 }}>
        <LoadingWrap>{error}</LoadingWrap>
      </NodesWrap>
    );
  }

  return (
    <NodesWrap style={{ width: 80 * 2 + 20 }}>
      {nodeRegistries
        // 先过滤掉不应该在面板显示的节点
        .filter((register) => register.meta.nodePanelVisible !== false)
        // 再根据API返回的有效节点列表进行过滤
        .filter((register) => validNodes.includes(register.type as string))
        .map((registry) => (
          <Node
            key={registry.type}
            disabled={!(registry.canAdd?.(context) ?? true)}
            icon={
              <img style={{ width: 10, height: 10, borderRadius: 4 }} src={registry.info?.icon} />
            }
            label={getNodeTypeLabel(registry.type as string)}
            onClick={(e) => handleClick(e, registry)}
          />
        ))}
    </NodesWrap>
  );
};
