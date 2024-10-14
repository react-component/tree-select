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

  it('labelInValue', () => {
    const onChange = jest.fn();
    const wrapper = mountTreeSelect({ onChange, open: true, labelInValue: true });
    wrapper.selectNode(2);

    expect(onChange).toHaveBeenCalledWith(
      { label: 'Sub 2', value: 'sub_2' },
      null,
      expect.anything(),
    );
  });

  it('multiple', () => {
    const onChange = jest.fn();
    const wrapper = mountTreeSelect({ onChange, open: true, multiple: true });

    wrapper.selectNode(1);

    onChange.mockReset();
    wrapper.selectNode(2);

    expect(onChange).toHaveBeenCalledWith(
      ['sub_1', 'sub_2'],
      ['Sub 1', 'Sub 2'],
      expect.anything(),
    );
  });

  it('onSelect', () => {
    const onSelect = jest.fn();
    const wrapper = mountTreeSelect({ onSelect, open: true });

    wrapper.selectNode(0);

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
