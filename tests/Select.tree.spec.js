/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from 'rc-util/lib/warning';
import TreeSelect, { TreeNode as SelectNode } from '../src';

describe('TreeSelect.tree', () => {
  const createSelect = props => (
    <TreeSelect {...props}>
      <SelectNode key="0-0" value="0-0">
        <SelectNode key="0-0-0" value="0-0-0">
          <SelectNode key="0-0-0-0" value="0-0-0-0" />
          <SelectNode key="0-0-0-1" />
          invalid element
        </SelectNode>
        <SelectNode key="0-0-1" value="0-0-1">
          <SelectNode key="0-0-1-0" value="0-0-1-0" />
          <SelectNode key="0-0-1-1" value="0-0-1-1" />
        </SelectNode>
      </SelectNode>
    </TreeSelect>
  );

  it('treeExpandedKeys', () => {
    class Test extends React.Component {
      state = {
        treeExpandedKeys: [],
      };

      onTreeExpand = treeExpandedKeys => {
        this.setState({
          treeExpandedKeys,
        });
      };

      onReset = () => {
        this.setState({
          treeExpandedKeys: [],
        });
      };

      render() {
        const { treeExpandedKeys } = this.state;
        return (
          <div>
            {createSelect({
              open: true,
              treeExpandedKeys,
              onTreeExpand: this.onTreeExpand,
            })}
            <button type="button" onClick={this.onReset} className="reset">
              Reset
            </button>
          </div>
        );
      }
    }

    const wrapper = mount(<Test />);

    wrapper.switchNode();
    expect(wrapper.find('Tree').props().expandedKeys).toEqual(['0-0']);

    wrapper.switchNode(2);
    expect(wrapper.find('Tree').props().expandedKeys).toEqual(['0-0', '0-0-1']);

    wrapper.find('button.reset').simulate('click');
    expect(wrapper.find('Tree').props().expandedKeys).toEqual([]);
  });

  it('warning if node key are not same as value', () => {
    resetWarned();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<TreeSelect treeData={[{ title: 'little', value: 'ttt', key: 'little' }]} />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `key` or `value` with TreeNode must be the same or you can remove one of them. key: little, value: ttt.',
    );
    spy.mockRestore();
  });

  it('warning if node has same value', () => {
    resetWarned();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(
      <TreeSelect
        treeData={[{ title: 'little', value: 'ttt' }, { title: 'bamboo', value: 'ttt' }]}
      />,
    );
    expect(spy).toHaveBeenCalledWith('Warning: Same `value` exist in the tree: ttt');
    spy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/14597
  it('empty string is also a value', () => {
    const wrapper = mount(
      <TreeSelect placeholder="Please select" value="">
        <SelectNode key="" value="" title="empty string" />
      </TreeSelect>,
    );

    expect(wrapper.getSelection(0).text()).toEqual('empty string');
  });

  describe('treeNodeLabelProp', () => {
    [
      { name: 'treeDate', treeData: [{ title: 'a light', op: 'Light', value: 'light' }] },
      {
        name: 'children',
        children: <SelectNode title="a light" op="Light" value="light" />,
      },
    ].forEach(({ name, ...restProps }) => {
      it(name, () => {
        const wrapper = mount(
          <TreeSelect
            open
            treeDefaultExpandAll
            treeNodeLabelProp="op"
            value="light"
            {...restProps}
          />,
        );

        expect(wrapper.find('.rc-tree-select-tree-title').text()).toEqual('a light');
        expect(wrapper.find('.rc-tree-select-selection-item').text()).toEqual('Light');
      });
    });
  });
});
