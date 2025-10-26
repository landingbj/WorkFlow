/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FormRenderProps, FormMeta, ValidateTrigger } from '@flowgram.ai/free-layout-editor';
import { syncVariableTitle } from '@flowgram.ai/form-materials';

import { FlowNodeJSON } from '../../typings';
import { useNodeRenderContext } from '../../hooks';
import { FormContent } from '../../form-components';
import { getIcon } from '../../form-components/form-header/utils';

// Custom header without menu buttons
const CustomFormHeader = ({ form }: { form: any }) => {
  const { node } = useNodeRenderContext();
  const title = form.values.title || '';
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {getIcon(node)}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          marginLeft: '8px',
          flex: 1,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const content = (form.values as any).content;
  
  return (
    <>
      <CustomFormHeader form={form} />
      <FormContent>
        <div
          style={{
            padding: '16px',
            fontSize: '14px',
            color: '#666',
            textAlign: 'left',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            userSelect: 'none',
          }}
        >
          {content}
        </div>
      </FormContent>
    </>
  );
};

export const formMeta: FormMeta<FlowNodeJSON> = {
  render: renderForm,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    title: ({ value }: { value: string }) => (value ? undefined : '标题为必填项'),
  },
  effect: {
    title: syncVariableTitle,
  },
};

