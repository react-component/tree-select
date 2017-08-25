/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { SHOW_PARENT } from '..';

describe('TreeSelect.checkable', () => {
  it('allow clear when controlled', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        label: 'label0',
        children: [
          {
            key: '1',
            value: '1',
            label: 'label1',
          },
        ],
      },
    ];

    class App extends React.Component {
      state = {
        value: [],
      }

      handleChange = (value) => {
        this.setState({ value });
      }

      render() {
        return (
          <TreeSelect
            treeData={treeData}
            treeCheckable
            allowClear
            showCheckedStrategy={SHOW_PARENT}
            value={this.state.value}
            onChange={this.handleChange}
          />
        );
      }
    }
    const wrapper = mount(<App />);
    // open
    jest.useFakeTimers();
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    // clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
  });

  // Fix https://github.com/ant-design/ant-design/issues/7312#issuecomment-324865971
  it('should be checkable when treeCheckStrictly is true', () => {
    const treeData = [
      { label: '1-1', value: '1-1', children: [] },
      { label: '1-2', value: '1-2', children: [] },
      {
        label: '1-3', value: '1-3', children: [
          { label: '2-1', value: '2-1', children: [] },
          { label: '2-2', value: '2-2', children: [] },
        ],
      },
    ];
    const handleChange = jest.fn();
    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        multiple
        onChange={handleChange}
      />
    );
    // open
    jest.useFakeTimers();
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').at(0).simulate('click');
    expect(handleChange).toBeCalled();
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(1);
    expect(wrapper.find('.rc-tree-select-selection__choice__content').at(0).text()).toBe('1-1');
  });
});
