/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect from '..';

describe('TreeSelect.multiple', () => {
  const treeData = [
    { key: '0', value: '0', label: 'label0' },
    { key: '1', value: '1', label: 'label1' },
  ];
  const createSelect = (props) => (
    <TreeSelect
      treeData={treeData}
      multiple
      {...props}
    />
  );
  const select = (wrapper, index = 0) => {
    wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(index).simulate('click');
  };

  it('select multiple nodes', () => {
    const wrapper = mount(createSelect());
    const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
    select(treeWrapper, 0);
    select(treeWrapper, 1);
    const result = wrapper.find('.rc-tree-select-selection__rendered');
    const choices = result.find('.rc-tree-select-selection__choice__content');
    expect(result.is('ul')).toBe(true);
    expect(choices.at(0).prop('children')).toBe('label0');
    expect(choices.at(1).prop('children')).toBe('label1');
  });

  it('remove selected node', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper.find('.rc-tree-select-selection__choice__remove').first().simulate('click');
    const choice = wrapper.find('ul .rc-tree-select-selection__choice__content');
    expect(choice).toHaveLength(1);
    expect(choice.prop('children')).toBe('label1');
  });

  it('remove by backspace key', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    const choice = wrapper.find('ul .rc-tree-select-selection__choice__content');
    expect(choice).toHaveLength(1);
    expect(choice.prop('children')).toBe('label0');
  });

  // https://github.com/react-component/tree-select/issues/47
  it('remove by backspace key twice when treeCheckable and under controlled', () => {
    class App extends React.Component {
      state = {
        value: ['0', '1'],
      }

      handleChange = (value) => {
        this.setState({ value });
      }

      render() {
        return createSelect({
          value: this.state.value,
          onChange: this.handleChange,
          treeCheckable: true,
        });
      }
    }
    const wrapper = mount(<App />);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
    treeWrapper.find('.rc-tree-select-tree-checkbox').at(1).simulate('click');
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    const choice = wrapper.find('ul .rc-tree-select-selection__choice__content');
    expect(choice).toHaveLength(1);
    expect(choice.prop('children')).toBe('label0');
  });
});
