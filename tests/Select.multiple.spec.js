/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect, { TreeNode } from '../src';
import Selection from '../src/Selector/MultipleSelector/Selection';
import { resetAriaId } from '../src/util';
import focusTest from './shared/focusTest';

describe('TreeSelect.multiple', () => {
  focusTest('multiple');

  const treeData = [
    { key: '0', value: '0', title: 'label0' },
    { key: '1', value: '1', title: 'label1' },
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

  beforeEach(() => {
    resetAriaId();
  });

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

  // TODO: Check preVal, it's not correct
  it('click X to delete select', () => {
    const handleChange = jest.fn();
    const children = [
      <TreeNode key="0" value="0" title="label0" foo={0} />,
      <TreeNode key="1" value="1" title="label1" foo={1} />,
    ];
    const wrapper = mount(createSelect({
      open: true,
      value: ['0', '1'],
      onChange: handleChange,
      treeCheckable: true,
      treeData: null,
      children,
    }));

    const $remove = wrapper
      .find('.rc-tree-select-selection__rendered')
      .find('.rc-tree-select-selection__choice')
      .find('.rc-tree-select-selection__choice__remove')
      .at(1);

    $remove.simulate('click');

    expect(handleChange).toBeCalledWith(['0'], ['label0'], expect.objectContaining({
      allCheckedNodes: [
        expect.objectContaining({
          props: expect.objectContaining(children[0].props),
        })
      ],
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
    expect(wrapper.state('valueList')).toEqual([{ label: 'label1', value: '1' }]);
  });

  describe('maxTagCount', () => {
    it('legal', () => {
      const wrapper = render(createSelect({
        maxTagCount: 1,
        value: ['0', '1'],
      }));

      expect(wrapper.find('.rc-tree-select-selection')).toMatchSnapshot();
    });

    it('illegal', () => {
      const wrapper = render(createSelect({
        maxTagCount: 1,
        value: ['0', 'not exist'],
      }));

      expect(wrapper.find('.rc-tree-select-selection')).toMatchSnapshot();
    });

    it('zero', () => {
      const wrapper = render(createSelect({
        maxTagCount: 0,
        value: ['0', '1'],
      }));

      expect(wrapper.find('.rc-tree-select-selection')).toMatchSnapshot();
    });

    describe('maxTagPlaceholder', () => {
      it('string', () => {
        const wrapper = render(createSelect({
          maxTagCount: 1,
          value: ['0', '1'],
          maxTagPlaceholder: 'bamboo',
        }));

        expect(wrapper.find('.rc-tree-select-selection')).toMatchSnapshot();
      });

      it('function', () => {
        const wrapper = render(createSelect({
          maxTagCount: 1,
          value: ['0', '1'],
          maxTagPlaceholder: list => `${list.length} bamboo...`,
        }));

        expect(wrapper.find('.rc-tree-select-selection')).toMatchSnapshot();
      });
    });
  });

  it('number types', () => {
    const myTreeData = [
      { key: 0, value: 0, title: 0 },
      { key: 1, value: 1, title: 1, children: [
        { key: 2, value: 2, title: 2 },
        { key: 3, value: 3, title: 3 },
      ]},
      { key: 4, value: 4, title: 4 },
    ];

    const onChange = jest.fn();

    const wrapper = mount(createSelect({
      open: true,
      treeCheckable: true,
      defaultValue: [4],
      treeData: myTreeData,
      onChange,
    }));

    select(wrapper, 0);
    select(wrapper, 1);

    expect(onChange.mock.calls[0][0]).toEqual([0, 4]);
    expect(onChange.mock.calls[1][0]).toEqual([0, 2, 3, 4]);
  });

  // https://github.com/ant-design/ant-design/issues/12315
  it('select searched node', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <TreeSelect
        showSearch
        value={['leaf1']}
        multiple
        onChange={onChange}
      >
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title="sss" key="random3" />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
    );

    wrapper.find('.rc-tree-select-search__field').simulate('change', { target: { value: 'sss' } });
    wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(2).simulate('click');

    expect(onChange.mock.calls[0][0]).toEqual(['leaf1', 'sss']);
  });

  it('do not crash when value has empty string', () => {
    const wrapper = mount(
      <TreeSelect multiple value={['']}>
        <TreeNode value="" title="empty str" key="empty str" />
      </TreeSelect>
    );

    expect(wrapper.find(Selection).length).toEqual(1);
  });
});
