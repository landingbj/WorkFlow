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
import { APINodeRegistry } from './api';
import { ASRNodeRegistry } from './asr';
import { Image2TextNodeRegistry } from './image2text';
import { Image2detectNodeRegistry } from './imageDetect';
import { AgentNodeRegistry } from './agent';
import { DataBaseQueryNodeRegistry } from './database-query';
import { DatabaseUpdateNodeRegistry } from './database-update';
import { ParallelNodeRegistry } from './parallel';
import { McpAgentNodeRegistry } from './mcp';
export { WorkflowNodeType } from './constants';

export const nodeRegistries: FlowNodeRegistry[] = [
  ConditionNodeRegistry,
  StartNodeRegistry,
  EndNodeRegistry,
  LoopNodeRegistry,
  ParallelNodeRegistry,
  CommentNodeRegistry,
  BlockStartNodeRegistry,
  BlockEndNodeRegistry,
  KnowledgeBaseNodeRegistry,
  IntentDetectNodeRegistry,
  DataBaseQueryNodeRegistry,
  DatabaseUpdateNodeRegistry,
  APINodeRegistry,
  ProgramNodeRegistry,
  LLMNodeRegistry,
  Image2TextNodeRegistry,
  Image2detectNodeRegistry,
  AgentNodeRegistry,
  McpAgentNodeRegistry,
  ASRNodeRegistry,
];
