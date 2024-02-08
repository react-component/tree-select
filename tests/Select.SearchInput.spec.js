/* eslint-disable no-undef */
import React, { useState } from 'react';
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

  it('not trigger loadData when clearing the search', () => {
    let called = 0;
    const handleLoadData = jest.fn();
    const Demo = () => {
      const [value, setValue] = useState();
      const [treeData, setTreeData] = useState([]);

      const addDefaultTreeData = () => {
        setTreeData([
          { id: 1, pId: 0, value: '1', title: 'Expand to load' },
          { id: 2, pId: 0, value: '2', title: 'Expand to load' },
          { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
        ])
      }

      const genTreeNode = (parentId, isLeaf = false) => {
        const random = Math.random().toString(36).substring(2, 6);
        return {
          id: random,
          pId: parentId,
          value: random,
          title: isLeaf ? 'Tree Node' : 'Expand to load',
          isLeaf,
        };
      };

      const onLoadData = ({ id, ...rest }) =>
        new Promise((resolve) => {
          setTimeout(() => {
            called += 1;
            handleLoadData({ id, ...rest });
            setTreeData(
              treeData.concat([
                genTreeNode(id, false),
                genTreeNode(id, true),
                genTreeNode(id, true),
              ])
            );
            resolve(undefined);
          }, 300);
        });

      const onChange = (newValue) => {
        setValue(newValue);
      };

      return (
        <>
          <TreeSelect
            treeDataSimpleMode
            value={value}
            placeholder="Please select"
            onChange={onChange}
            loadData={onLoadData}
            treeData={treeData}
            treeNodeFilterProp="title"
            showSearch
            filterTreeNode={false}
          />
          <button onClick={addDefaultTreeData}>设置数据</button>
        </>
      );
    };
    const wrapper = mount(<Demo />);
    expect(wrapper.find('button').length).toBe(1);
    expect(handleLoadData).not.toHaveBeenCalled();

    function search(value) {
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value } });
      wrapper.update();
    }
    search('Tree Node');
    expect(handleLoadData).not.toHaveBeenCalled();

    search('');
    expect(handleLoadData).not.toHaveBeenCalled();

    expect(wrapper.find('.rc-tree-select-empty').length).toBe(1);

    wrapper.find('button').simulate('click');
    expect(wrapper.find('.rc-tree-select-empty').length).toBe(0);
    expect(wrapper.find('.rc-tree-select-tree').length).toBe(1);

    search('Tree Node');
    expect(handleLoadData).not.toHaveBeenCalled();

    search('');
    expect(handleLoadData).not.toHaveBeenCalled();
    expect(called).toBe(0);
  });
});
