import { FC, useState } from 'react';
import { SideSheet, Button, TextArea, Toast } from '@douyinfe/semi-ui';
import { IconSpin } from '@douyinfe/semi-icons';

interface FlowGenSideSheetProps {
  visible: boolean;
  onCancel: () => void;
}

export const FlowGenSideSheet: FC<FlowGenSideSheetProps> = ({ visible, onCancel }) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 确保事件处理函数正确处理输入
  const handleInputChange = (value: string) => {
    // 直接接收Semi UI TextArea组件传递的value
    setInput(value);
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      Toast.warning('请输入流程描述');
      return;
    }

    try {
      setLoading(true);
      
      // 获取URL中的agentId参数
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = urlParams.get('agentId');
      
      if (!agentId) {
        Toast.error('缺少agentId参数');
        setLoading(false);
        return;
      }

      // 调用API
      const response = await fetch('/workflow/txt2FlowSchema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          input: input.trim()
        }),
      });

      // 解析响应数据
      const result = await response.json();

      // 检查响应状态和返回的status字段
      if (!response.ok || result.status === 'failed') {
        // 提取错误信息，如果有
        const errorMessage = result.message || '生成流程失败';
        throw new Error(errorMessage);
      }

      Toast.success('流程生成成功');
      // 刷新页面
      window.location.reload();
    } catch (error) {
      console.error('生成流程出错:', error);
      // 显示错误信息，如果是Error对象则显示其message
      const errorMessage = error instanceof Error ? error.message : '生成流程失败，请重试';
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideSheet
      title="生成流程"
      visible={visible}
      mask={false}
      onCancel={onCancel}
      footer={
        <Button
          onClick={handleGenerate}
          loading={loading}
          icon={loading ? <IconSpin spin size="small" /> : null}
          style={{
            backgroundColor: 'rgba(77, 83, 232, 1)',
            borderRadius: '8px',
            color: '#fff',
            width: '100%',
            height: '40px',
          }}
        >
          生成
        </Button>
      }
    >
      <div style={{ padding: '0 16px' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#333',
          }}
        >
          流程描述
        </div>
        <TextArea
          placeholder="请输入流程描述，例如：生成一个带知识库问答的工作流..."
          style={{ height: 200, marginBottom: 16 }}
          value={input}
          // 使用Semi UI推荐的onChange用法，直接接收value
          onChange={handleInputChange}
          autoFocus
          // 确保组件没有被禁用
          disabled={false}
        />
        <div style={{ fontSize: 12, color: '#666' }}>
          提示：详细描述流程步骤和逻辑，将获得更精准的生成结果
        </div>
      </div>
    </SideSheet>
  );
};
