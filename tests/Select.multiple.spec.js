/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect from '../src';
import focusTest from './shared/focusTest';

describe('TreeSelect.multiple', () => {
  focusTest('multiple');

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
    const wrapper = mount(createSelect({ open: true }));
    select(wrapper, 0);
    select(wrapper, 1);
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
          open: true,
          value: this.state.value,
          onChange: this.handleChange,
          treeCheckable: true,
        });
      }
    }
    const wrapper = mount(<App />);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    wrapper.find('.rc-tree-select-tree-checkbox').at(1).simulate('click');
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    const choice = wrapper.find('ul .rc-tree-select-selection__choice__content');
    expect(choice).toHaveLength(1);
    expect(choice.prop('children')).toBe('label0');
  });

  it('click X to delete select', () => {
    const treeDataWithProps = [
      { key: '0', value: '0', label: 'label0', foo: 0 },
      { key: '1', value: '1', label: 'label1', foo: 1 },
    ];

    const handleChange = jest.fn();
    const wrapper = mount(createSelect({
      open: true,
      value: ['0', '1'],
      onChange: handleChange,
      treeCheckable: true,
      treeData: treeDataWithProps,
    }));

    const $remove = wrapper
      .find('.rc-tree-select-selection__rendered')
      .find('.rc-tree-select-selection__choice')
      .find('.rc-tree-select-selection__choice__remove')
      .at(1);

    $remove.simulate('click');

    expect(handleChange).toBeCalledWith(['0'], ['label0'], expect.objectContaining({
      allCheckedNodes: [{
        node: {
          disabled: false,
          isLeaf: undefined,
          key: '0',
          foo: 0,
          selectable: false,
          props: {
            label: 'label0',
            title: 'label0',
            value: '0',
          },
        },
        pos: '0-0',
      }],
    }));
  });

  it('renders clear button', () => {
    const wrapper = render(createSelect({ allowClear: true }));

    expect(wrapper.find('.rc-tree-select-selection__clear')).toMatchSnapshot();
  });

  it('should focus and clear search input after select and unselect item', () => {
    const wrapper = mount(createSelect());
    wrapper.find('input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('input').getDOMNode().value).toBe('0');
    select(wrapper, 0);
    expect(wrapper.find('input').getDOMNode().value).toBe('');
    wrapper.find('input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('input').getDOMNode().value).toBe('0');
    select(wrapper, 0);  // unselect
    expect(wrapper.find('input').getDOMNode().value).toBe('');
  });

  it('do not open tree when close button click', () => {
    const wrapper = mount(createSelect());
    wrapper.find('.rc-tree-select-selection').simulate('click');
    select(wrapper, 0);
    select(wrapper, 1);
    wrapper.setState({ open: false });
    wrapper.find('.rc-tree-select-selection__choice__remove').at(0).simulate('click');
    expect(wrapper.state('open')).toBe(false);
    expect(wrapper.state('value')).toEqual([{ label: 'label1', value: '1' }]);
  });
});
