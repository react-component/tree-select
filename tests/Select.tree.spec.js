/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount, render } from 'enzyme';
import TreeSelect, { TreeNode as SelectNode } from '../src';
import { resetAriaId } from '../src/util';
// import { setMock } from './__mocks__/rc-animate';

describe('TreeSelect.tree', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetAriaId();
    // setMock(true);
  });

  afterEach(() => {
    jest.useRealTimers();
    // setMock(false);
  });

  const createSelect = props => (
    <TreeSelect {...props}>
      <SelectNode key="0-0" value="0-0">
        <SelectNode key="0-0-0" value="0-0-0">
          <SelectNode key="0-0-0-0" value="0-0-0-0" />
          <SelectNode key="0-0-0-1" />
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

    wrapper.find('.rc-tree-select-tree-switcher').simulate('click');
    expect(wrapper.state().treeExpandedKeys).toEqual(['0-0']);

    wrapper
      .find('.rc-tree-select-tree-switcher')
      .at(2)
      .simulate('click');
    expect(wrapper.state().treeExpandedKeys).toEqual(['0-0', '0-0-1']);

    wrapper.find('button.reset').simulate('click');
    expect(wrapper.find('Tree').instance().state.expandedKeys).toEqual([]);
  });

  it('warning if node has same value', () => {
    const spy = jest.spyOn(global.console, 'error');
    console.log(">>> Follow Warning is for test purpose. Don't be scared :)");
    render(
      <TreeSelect
        treeData={[
          { title: 'little', value: 'ttt', key: 'little' },
          { title: 'bamboo', value: 'ttt', key: 'bamboo' },
        ]}
      />,
    );
    expect(spy).toHaveBeenCalledWith(
      "Warning: Conflict! value of node 'bamboo' (ttt) has already used by node 'little'.",
    );
    spy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/14597
  it('empty string is also a value', () => {
    const wrapper = mount(
      <TreeSelect placeholder="Please select" value="">
        <SelectNode key="" value="" title="empty string" />
      </TreeSelect>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });
});
