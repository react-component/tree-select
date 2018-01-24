/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { SHOW_PARENT } from '../src';

describe('TreeSelect.checkable', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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
    wrapper.openSelect();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    // clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
  });

  // https://github.com/ant-design/ant-design/issues/6731
  it('clear all should clear cache at the same time', () => {
    const treeData = [{
      label: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [{
        label: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      }],
    }, {
      label: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [{
        label: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      }, {
        label: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      }, {
        label: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      }],
    }];

    class App extends React.Component {
      state = {
        value: ['0-0-0'],
        disabled: false,
      }

      handleChange = (value) => {
        this.setState({ value });
      }
      switch = (checked) => {
        this.setState({ disabled: checked });
      }
      render() {
        return (<div>
          <TreeSelect
            treeData={treeData}
            treeCheckable
            allowClear
            multiple
            showCheckedStrategy={SHOW_PARENT}
            value={this.state.value}
            onChange={this.handleChange}
            disabled={this.state.disabled}
          />
          <input type="checkbox" onChange={e => this.switch(e.target.checked)} id="checkbox"/> 禁用
          </div>
        );
      }
    }
    const wrapper = mount(<App />);
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(1);
    // open
    wrapper.openSelect();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').at(2).simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(2);
    // clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
    // disabled
    wrapper.find('#checkbox').simulate('change', { target: { checked: true } });
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
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').at(0).simulate('click');
    expect(handleChange).toBeCalled();
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(1);
    expect(wrapper.find('.rc-tree-select-selection__choice__content').at(0).text()).toBe('1-1');
  });

  // Fix https://github.com/ant-design/ant-design/issues/8581
  it('Label should be click when treeCheckable is true', () => {
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
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    // select
    wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(0).simulate('click');
    expect(handleChange).toBeCalled();
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(1);
    expect(wrapper.find('.rc-tree-select-selection__choice__content').at(0).text()).toBe('1-1');
    // clear
    wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(0).simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(0);
  });

  it('clear selected value and input value', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        label: 'label0',
      },
    ];

    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        allowClear
        showCheckedStrategy={SHOW_PARENT}
      />
    );
    wrapper.openSelect();
    wrapper.find('.rc-tree-select-tree-checkbox').at(0).simulate('click');
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.state().value).toEqual([]);
    expect(wrapper.state().inputValue).toBe('');
  });
});
