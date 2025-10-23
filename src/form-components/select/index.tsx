/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from 'react';
import { Select, Toast } from '@douyinfe/semi-ui';
import { IFlowValue } from '@flowgram/ai/form-materials';
import { JsonSchema } from '../../typings';

// 接口返回格式类型（保持与后端一致）
interface AgentOption {
  label: string;
  value: string | number; // 支持数字类型的选项值（符合Select原始定义）
}

interface FetchConfig {
  url: string;
  method: string;
}

interface SelectComponentProps {
  value?: IFlowValue;
  onChange?: (value: IFlowValue) => void;
  extra?: { fetchOptions?: FetchConfig } & Record<string, any>;
  readonly?: boolean;
  hasError?: boolean;
  parseResponse?: (responseData: any) => AgentOption[];
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  value,
  onChange,
  extra,
  readonly,
  hasError,
  // 接收外部解析函数，默认使用原有逻辑
  parseResponse = (data) => {
    if (Array.isArray(data.data)) {
      return data.data as AgentOption[];
    }
    throw new Error('接口返回格式不正确（默认解析逻辑）');
  },
}) => {
  const [options, setOptions] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchConfig = extra?.fetchOptions;

  // 加载下拉选项（保持原有逻辑）
  useEffect(() => {
    if (!fetchConfig?.url) return;

    const loadOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(fetchConfig.url, {
          method: fetchConfig.method || 'GET',
        });

        if (!response.ok) throw new Error('接口请求失败');
        
        const rawData = await response.json(); // 获取原始数据
        // 调用外部解析函数（或默认解析函数）处理数据
        const parsedOptions = parseResponse(rawData);
        setOptions(parsedOptions);
      } catch (err) {
        console.error('加载选项失败:', err);
        Toast.error('智能体列表加载失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [fetchConfig]);

  // 修正：onChange参数类型匹配Select原始定义（不限制为string）
  const handleChange = (val: string | number | object | undefined) => {
    // 业务逻辑：仅处理字符串或数字类型（根据实际需求调整）
    if (onChange && (typeof val === 'string' || typeof val === 'number')) {
      onChange({
        ...(value as IFlowValue),
        content: val.toString(), // 统一转为字符串存入content（或保留原始类型）
      });
    }
  };

  // 修正：不强行指定Select泛型，保持原有类型兼容性
  return (
    <Select
      // value类型匹配Select原始定义（支持string/number/object）
      value={(value as IFlowValue)?.content ?? ''}
      onChange={handleChange} // 现在参数类型匹配
      loading={loading}
      disabled={readonly}
      placeholder="请选择智能体"
      style={{ width: '100%', borderColor: hasError ? '#f93920' : undefined }}
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectComponent;