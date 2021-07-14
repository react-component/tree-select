/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount } from 'enzyme';
import type { TreeSelectProps } from '../src';
import TreeSelect from '../src';

describe('TreeSelect.FieldNames', () => {
  function mountTreeSelect(props?: TreeSelectProps) {
    return mount(
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
    const wrapper = mountTreeSelect({ onChange, open: true });
    wrapper.selectNode(1);

    expect(onChange).toHaveBeenCalledWith('sub_1', ['Sub 1'], expect.anything());
  });
});
