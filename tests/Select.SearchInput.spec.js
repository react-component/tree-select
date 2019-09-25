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
});
