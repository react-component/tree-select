/* eslint-disable no-undef */
import React, { useState } from 'react';
import { mount } from 'enzyme';
import TreeSelect, { TreeNode } from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

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
    expect(wrapper.find('input').first().props().value).toBeFalsy();
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
      wrapper.find('input').first().simulate('change', { target: { value } });
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
        ]);
      };

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
        new Promise(resolve => {
          called += 1;
          handleLoadData({ id, ...rest });
          setTreeData(
            treeData.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]),
          );
          resolve(undefined);
        });

      const onChange = newValue => {
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
          />
          <button onClick={addDefaultTreeData}>设置数据</button>
        </>
      );
    };
    const wrapper = mount(<Demo />);
    expect(wrapper.find('button').length).toBe(1);
    expect(handleLoadData).not.toHaveBeenCalled();

    function search(value) {
      wrapper.find('input').first().simulate('change', { target: { value } });
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

    search('ex');
    const nodes = wrapper.find(`[title="${'Expand to load'}"]`).hostNodes();
    nodes.first().simulate('click');
    expect(called).toBe(0); // should not trrigger all nodes to load data
  });

  it('should trrigger `loadData` when click node', () => {
    let called = 0;
    const Demo = () => {
      const [value, setValue] = useState();
      const onLoadData = ({ id, ...rest }) =>
        new Promise(resolve => {
          called += 1;
          resolve(undefined);
        });

      const onChange = newValue => {
        setValue(newValue);
      };

      return (
        <TreeSelect
          treeDataSimpleMode
          value={value}
          placeholder="Please select"
          onChange={onChange}
          loadData={onLoadData}
          treeData={[
            { id: 1, pId: 0, value: '1', title: 'Expand to load' },
            { id: 2, pId: 0, value: '2', title: 'Expand to load' },
            { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
          ]}
          treeNodeFilterProp="title"
          treeExpandAction="click"
          showSearch
        />
      );
    };
    const wrapper = mount(<Demo />);

    function search(value) {
      wrapper.find('input').first().simulate('change', { target: { value } });
      wrapper.update();
    }

    search('ex');
    const nodes = wrapper.find(`[title="${'Expand to load'}"]`).hostNodes();
    nodes.first().simulate('click');
    expect(called).toBe(1);
  });

  describe('keyboard events', () => {
    it('should select first matched node when press enter', () => {
      const onSelect = jest.fn();
      const wrapper = mount(
        <TreeSelect
          showSearch
          onSelect={onSelect}
          open
          treeData={[
            { value: '1', label: '1' },
            { value: '2', label: '2', disabled: true },
            { value: '3', label: '3' },
          ]}
        />,
      );

      // Search and press enter, should select first matched non-disabled node
      wrapper.search('1');
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).toHaveBeenCalledWith('1', expect.anything());

      onSelect.mockReset();

      // Search disabled node and press enter, should not select
      wrapper.search('2');
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should not select any node when no search value and press enter', () => {
      const onSelect = jest.fn();
      const wrapper = mount(
        <TreeSelect
          showSearch
          onSelect={onSelect}
          open
          treeData={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
        />,
      );

      // Press enter without search value, should not select any node
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).not.toHaveBeenCalled();

      // Search and press enter, should select first matched node
      wrapper.search('1');
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).toHaveBeenCalledWith('1', expect.anything());
    });

    it('should not select node when no matches found', () => {
      const onSelect = jest.fn();
      const wrapper = mount(
        <TreeSelect
          showSearch
          onSelect={onSelect}
          open
          treeData={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
        />,
      );

      // Search non-existent value and press enter, should not select any node
      wrapper.search('not-exist');
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should ignore enter press when all matched nodes are disabled', () => {
      const onSelect = jest.fn();
      const wrapper = mount(
        <TreeSelect
          showSearch
          onSelect={onSelect}
          open
          treeData={[
            { value: '1', label: '1', disabled: true },
            { value: '2', label: '2', disabled: true },
          ]}
        />,
      );

      // When all matched nodes are disabled, press enter should not select any node
      wrapper.search('1');
      wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should activate first matched node when searching', () => {
      const wrapper = mount(
        <TreeSelect
          showSearch
          open
          treeData={[
            { value: '1', label: '1' },
            { value: '2', label: '2', disabled: true },
            { value: '3', label: '3' },
          ]}
        />,
      );

      // When searching, first matched non-disabled node should be activated
      wrapper.search('1');
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('1');

      // Should skip disabled nodes
      wrapper.search('2');
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').length).toBe(0);
    });
  });
});
