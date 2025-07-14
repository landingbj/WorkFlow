import { Button, Toast } from '@douyinfe/semi-ui';
import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { IconSave } from '@douyinfe/semi-icons';

export const SaveButton = (props: { disabled: boolean }) => {
  const clientContext = useClientContext();
  const saveData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('agentId');
    fetch('/workflow/saveFlowSchema', {
      method: 'POST',
      body: JSON.stringify({
        agentId: agentId,
        schema: clientContext.document.toJSON(),
      }),
    }).then((res) => {
      if (res.ok) {
        Toast.success('保存成功');
      } else {
        Toast.error('保存失败');
      }
    });
  };

  return (
    <Button
      disabled={props.disabled}
      onClick={saveData}
      icon={<IconSave size="small" />}
      style={{ backgroundColor: 'rgba(0,178,60,1)', borderRadius: '8px', color: '#fff' }}
    >
      保存
    </Button>
  );
};