// src/nodes/parallel/index.ts
import { nanoid } from 'nanoid';
import {
  WorkflowNodeEntity,
  PositionSchema,
  FlowNodeTransformData,
} from '@flowgram.ai/free-layout-editor';
import { provideJsonSchemaOutputs, syncVariableTitle } from '@flowgram.ai/form-materials';

import { defaultFormMeta } from '../default-form-meta';
import { FlowNodeRegistry } from '../../typings';
import iconParallel from '../../assets/icon-parallel.png';
import { ParallelFormRender } from './parallel-form-render';
import { WorkflowNodeType } from '../constants';

// 参考 LLM 节点的索引生成逻辑
let index = 0;
export const ParallelNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Parallel,
  info: {
    icon: iconParallel,
    description: '并行执行多个分支任务（同 LLM 节点数据处理逻辑）',
  },
  meta: {
    // 作为容器节点，允许子节点存在（参考 LLM 节点的容器配置）
    isContainer: true,
    size: {
      width: 560,
      height: 400,
    },
    /**
     * The subcanvas padding setting
     * 子画布 padding 设置
     */
    padding: () => ({
      top: 120,
      bottom: 60,
      left: 100,
      right: 100,
    }),
    // 选中逻辑：点击子画布区域不选中父节点（同 LLM 容器行为）
    selectable(node: WorkflowNodeEntity, mousePos?: PositionSchema): boolean {
      if (!mousePos) return true;
      const transform = node.getData<FlowNodeTransformData>(FlowNodeTransformData);
      return !transform.bounds.contains(mousePos.x, mousePos.y);
    },
    expandable: false,
    wrapperStyle: { border: '1px solid #e5e7eb' }, // 边框样式对齐 LLM 节点
  },
  // 节点添加时的初始化数据（完全对齐 LLM 节点的输出格式）
  onAdd() {
    return {
      id: `parallel_${nanoid(5)}`,
      type: WorkflowNodeType.Parallel,
      data: {
        title: `并行任务_${++index}`,
        // 输出结构完全参考 LLM 节点的 JSON Schema 格式
        outputs: {
          type: 'object',
          properties: {
            parallelResults: { // 字段名参考 LLM 节点的 output 命名习惯
              type: 'array',
              description: '所有并行分支的结果数组',
              items: { type: 'object' } // 每个分支结果为对象（同 LLM 输出结构）
            }
          },
          required: ['parallelResults']
        }
      },
      // 初始化并行分支的开始/结束块（类似 LLM 节点的内部块）
      blocks: [
        {
          id: `parallel_start_${nanoid(5)}`,
          type: WorkflowNodeType.BlockStart,
          meta: { position: { x: -80, y: 0 } },
          data: {},
        },
        {
          id: `parallel_end_${nanoid(5)}`,
          type: WorkflowNodeType.BlockEnd,
          meta: { position: { x: 80, y: 0 } },
          data: {},
        },
      ],
    };
  },
  // 表单元数据：完全参考 LLM 节点，去掉所有表单相关配置
  formMeta: {
    ...defaultFormMeta,
    render: ParallelFormRender, // 使用仅含画布的渲染组件
    effect: {
      title: syncVariableTitle, // 同步标题到变量（LLM 节点核心逻辑）
      outputs: provideJsonSchemaOutputs, // 输出处理完全复用 LLM 逻辑
    },
    plugins: [], // 移除所有表单插件（关键：避免表单渲染）
    // 禁用表单验证（LLM 节点无复杂验证）
  },
};