import React from 'react';
import { mount } from 'enzyme';
import TreeSelect from '../src';

describe('TreeSelect.InternalAPI', () => {
  it('labelRender', () => {
    const wrapper = mount(
      <TreeSelect
        value="little"
        treeData={[
          {
            label: 'Bamboo',
            value: 'bamboo',
            children: [
              { label: 'Light', value: 'light', children: [{ label: 'Little', value: 'little' }] },
            ],
          },
        ]}
        labelRender={entity => {
          let current = entity;
          const nodes = [];

          while (current) {
            nodes.unshift(current.data.label);
            current = current.parent;
          }

          return nodes.join('>');
        }}
      />,
    );
    expect(wrapper.find('.rc-tree-select-selection-item').text()).toEqual('Bamboo>Light>Little');
  });
});
