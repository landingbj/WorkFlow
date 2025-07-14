/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowDocumentJSON } from './typings';

export const getInitialData = async (): Promise<FlowDocumentJSON> => {
  const urlParams = new URLSearchParams(window.location.search);
  const agentId = urlParams.get('agentId');
  const response = await fetch(`/workflow/getFlowSchema?agentId=${agentId}`);
  const data = await response.json();
  const schema = data.schema;
  const flowDocumentJSON = JSON.parse(schema) as FlowDocumentJSON;
  return flowDocumentJSON;
};

export const initialData: FlowDocumentJSON = await getInitialData();
