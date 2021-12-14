/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { TreeNode } from '../src';

describe('TreeSelect.SearchInput', () => {
  it('select item will clean searchInput', () => {
    const onSearch = jest.fn();

    const wrapper = mount(
      <TreeSelect onSearch={onSearch} open>
        <TreeNode value="test" />
      </TreeSelect>,
    );

    wrapper.search('test');
    expect(onSearch).toHaveBeenCalledWith('test');
    onSearch.mockReset();

    wrapper.selectNode();
    expect(onSearch).not.toHaveBeenCalled();
    expect(
      wrapper
        .find('input')
        .first()
        .props().value,
    ).toBeFalsy();
  });

  it('expandedKeys', () => {
    const wrapper = mount(
      <TreeSelect
        open
        showSearch
        treeExpandedKeys={['bamboo', 'light']}
        treeData={[
          {
            title: 'bamboo',
            value: 'bamboo',
            children: [{ title: '111', value: '111' }],
          },
          {
            title: 'light',
            value: 'light',
            children: [{ title: '222', value: '222' }],
          },
        ]}
      />,
    );

    expect(wrapper.find('NodeList').prop('expandedKeys')).toEqual(['bamboo', 'light']);

    function search(value) {
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value } });
      wrapper.update();
    }

    function listProps() {
      return wrapper.find('NodeList').props();
    }

    // Clean up
    search('bambooA');

    // Return back
    search('bamboo');

    // Back to default
    search('');
    expect(listProps().expandedKeys).toEqual(['bamboo', 'light']);
  });
});
