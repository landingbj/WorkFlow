/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowNodeRegistry } from '../typings';
import { StartNodeRegistry } from './start';
import { LoopNodeRegistry } from './loop';
import { LLMNodeRegistry } from './llm';
import { EndNodeRegistry } from './end';
import { ConditionNodeRegistry } from './condition';
import { CommentNodeRegistry } from './comment';
import { BlockStartNodeRegistry } from './block-start';
import { BlockEndNodeRegistry } from './block-end';
import { KnowledgeBaseNodeRegistry } from './knowledge-base';
import { IntentDetectNodeRegistry } from './intent-detect';
import { ProgramNodeRegistry } from './program';
export { WorkflowNodeType } from './constants';

export const nodeRegistries: FlowNodeRegistry[] = [
  ConditionNodeRegistry,
  StartNodeRegistry,
  EndNodeRegistry,
  LLMNodeRegistry,
  LoopNodeRegistry,
  CommentNodeRegistry,
  BlockStartNodeRegistry,
  BlockEndNodeRegistry,
  KnowledgeBaseNodeRegistry,
  ProgramNodeRegistry,
  IntentDetectNodeRegistry,
];
