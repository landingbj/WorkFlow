/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

export enum WorkflowNodeType {
  Start = 'start',
  End = 'end',
  LLM = 'llm',
  Condition = 'condition',
  Loop = 'loop',
  BlockStart = 'block-start',
  BlockEnd = 'block-end',
  Comment = 'comment',
  KNOWLEDGE_BASE = 'knowledge-base',
  INTENT_RECOGNITION = 'intent-recognition',
  Program = 'program',
  API = 'api',
  ASR = 'asr',
  IMAGE2TEXT = 'image2text',
  CodeLogic = 'code-logic',
  IMAGE2DETECT = 'image2detect',
  AGENT = 'agent',
  DATABASE_QUERY = 'database-query',
  DATABASE_UPDATE = 'database-update',
}
