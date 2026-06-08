/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { render } from '@testing-library/react';
import type { TreeSelectProps } from '../src';
import TreeSelect from '../src';
import { selectNode } from './util';

describe('TreeSelect.FieldNames', () => {
  function mountTreeSelect(props?: TreeSelectProps) {
    return render(
      <TreeSelect
        treeDefaultExpandAll
        treeData={[
          {
            myLabel: 'Parent',
            myValue: 'parent',
            myChildren: [
              {
                myLabel: 'Sub 1',
                myValue: 'sub_1',
              },
              {
                myLabel: 'Sub 2',
                myValue: 'sub_2',
              },
            ],
          },
        ]}
        fieldNames={{
          label: 'myLabel',
          value: 'myValue',
          children: 'myChildren',
        }}
        {...props}
      />,
    );
  }

  it('render correctly', () => {
    const onChange = jest.fn();
    mountTreeSelect({ onChange, open: true });
    selectNode(1);

    expect(onChange).toHaveBeenCalledWith('sub_1', ['Sub 1'], expect.anything());
  });

  it('labelInValue', () => {
    const onChange = jest.fn();
    mountTreeSelect({ onChange, open: true, labelInValue: true });
    selectNode(2);

    expect(onChange).toHaveBeenCalledWith(
      { label: 'Sub 2', value: 'sub_2' },
      null,
      expect.anything(),
    );
  });

  it('multiple', () => {
    const onChange = jest.fn();
    mountTreeSelect({ onChange, open: true, multiple: true });

    selectNode(1);

    onChange.mockReset();
    selectNode(2);

    expect(onChange).toHaveBeenCalledWith(
      ['sub_1', 'sub_2'],
      ['Sub 1', 'Sub 2'],
      expect.anything(),
    );
  });

  it('onSelect', () => {
    const onSelect = jest.fn();
    mountTreeSelect({ onSelect, open: true });

    selectNode(0);

    expect(onSelect).toHaveBeenCalledWith('parent', {
      myChildren: [
        { myLabel: 'Sub 1', myValue: 'sub_1' },
        { myLabel: 'Sub 2', myValue: 'sub_2' },
      ],
      myLabel: 'Parent',
      myValue: 'parent',
    });
  });
});
