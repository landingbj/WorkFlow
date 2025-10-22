import { FormRenderProps, FlowNodeJSON, Field } from '@flowgram.ai/free-layout-editor';
import { SubCanvasRender } from '@flowgram.ai/free-container-plugin';
import { BatchOutputs, IFlowRefValue } from '@flowgram.ai/form-materials';

import { useIsSidebar, useNodeRenderContext } from '../../hooks';
import { FormHeader, FormContent, FormOutputs, FormItem, Feedback } from '../../form-components';

interface ParallelNodeJSON extends FlowNodeJSON {
  data: {
  };
}

export const ParallelFormRender = ({ form }: FormRenderProps<ParallelNodeJSON>) => {
  const isSidebar = useIsSidebar();
  const { readonly } = useNodeRenderContext();
  const formHeight = 85;

  const batchOutputs = (
    <Field<Record<string, IFlowRefValue | undefined> | undefined> name={`batchOutputs`}>
      {({ field, fieldState }) => (
        <FormItem name="并行输出" type="object" vertical>
          <BatchOutputs
            style={{ width: '100%' }}
            value={field.value}
            onChange={(val) => field.onChange(val)}
            readonly={readonly}
            hasError={Object.keys(fieldState?.errors || {}).length > 0}
          />
          <Feedback errors={fieldState?.errors} />
        </FormItem>
      )}
    </Field>
  );

  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          {/* {batchFor} */}
          {batchOutputs}
          <FormOutputs />
        </FormContent>
      </>
    );
  }
  return (
    <>
      <FormHeader />
      <FormContent>
        {/* {batchFor} */}
        <SubCanvasRender offsetY={-formHeight} />
        <FormOutputs />
      </FormContent>
    </>
  );
};
