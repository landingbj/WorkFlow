import { Button } from '@douyinfe/semi-ui';

export const PublishButton = (props: { disabled: boolean }) => {
  const publishData = async () => {
    try {
      const response = await fetch('/api/agent/testConnection');
      const data = await response.json();
      alert(data.message); // 弹出后端返回的内容
    } catch (error) {
      alert('请求失败，请检查服务是否启动');
      console.error(error);
    }
  };

  return (
    <Button
      data-testid="demo.free-layout.publish-button"
      color="warning"
      style={{ backgroundColor: 'rgba(171,181,255,0.3)', borderRadius: '8px' }}
      disabled={props.disabled}
      onClick={publishData}
    >
      发布
    </Button>
  );
};
