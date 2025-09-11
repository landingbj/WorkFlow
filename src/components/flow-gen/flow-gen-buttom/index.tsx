// flowgen/flowgen-button/index.tsx
import { useState } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconEdit } from '@douyinfe/semi-icons';

import { FlowGenSideSheet } from '../flow-gen-sidesheet';

export function FlowGenButton(props: { disabled: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        disabled={props.disabled}
        onClick={() => setVisible(true)}
        icon={<IconEdit size="small" />}
        style={{ backgroundColor: 'rgba(77, 83, 232, 1)', borderRadius: '8px', color: '#fff', marginLeft: 8 }}
      >
        生成流程
      </Button>
      <FlowGenSideSheet visible={visible} onCancel={() => setVisible(false)} />
    </>
  );
}