/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { SHOW_PARENT } from '../src';

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
});
