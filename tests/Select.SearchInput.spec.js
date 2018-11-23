/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { TreeNode } from '../src';
import { resetAriaId } from '../src/util';

describe('TreeSelect.SearchInput', () => {
  beforeEach(() => {
    resetAriaId();
  });

  const createSelect = (props) => {
    return mount(
      <div>
        <input className="pre-focus" />
        <TreeSelect
          searchPlaceholder="ZOMBIE HERE"
          open
          {...props}
        >
          <TreeNode />
        </TreeSelect>
      </div>
    );
  }

  describe('click placeholder to get focus', () => {
    it('single', (done) => {
      const wrapper = createSelect({ showSearch: true });

      setTimeout(() => {
        // Focus outside
        wrapper.find('.pre-focus').instance().focus();

        // Click placeholder
        wrapper.find('.rc-tree-select-search__field__placeholder').simulate('click');

        const $input = wrapper.find('input.rc-tree-select-search__field').instance();
        expect($input).toBe(document.activeElement);

        done();
      }, 10);
    });

    it('multiple', (done) => {
      const wrapper = createSelect({ multiple: true });

      setTimeout(() => {
        // Focus outside
        wrapper.find('.pre-focus').instance().focus();

        // Click placeholder
        wrapper.find('.rc-tree-select-search__field__placeholder').simulate('click');

        const $input = wrapper.find('input.rc-tree-select-search__field').instance();
        expect($input).toBe(document.activeElement);

        done();
      }, 10);
    });
  });

  it('select item will clean searchInput', () => {
    const onSearch = jest.fn();

    const wrapper = mount(
      <TreeSelect onSearch={onSearch} open>
        <TreeNode value="test" />
      </TreeSelect>
    );

    wrapper.find('.rc-tree-select-search__field').simulate('change', { target: { value: 'test' } });
    expect(onSearch).toBeCalledWith('test');
    onSearch.mockReset();

    wrapper.find('.rc-tree-select-tree-node-content-wrapper').simulate('click');
    expect(onSearch).toBeCalledWith('');
  });
});
