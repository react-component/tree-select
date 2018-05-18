/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect from '../src';
import focusTest from './shared/focusTest';

const { TreeNode } = TreeSelect;

describe('TreeSelect.basic', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  focusTest('single');

  describe('render', () => {
    let treeData = [
      { key: '0', value: '0', label: '0 label' },
      {
        key: '1', value: '1', label: '1 label', children: [
          { key: '10', value: '10', label: '10 label' },
          { key: '11', value: '11', label: '11 label' },
        ],
      },
    ];

    it('renders correctly', () => {
      const wrapper = render(
        <TreeSelect
          style={{ width: 300 }}
          prefixCls="awesome"
          className="forTest"
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders tree correctly', () => {
      const wrapper = render(
        <TreeSelect
          dropdownClassName="awesome"
          dropdownStyle={{ width: 300 }}
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders disabled correctly', () => {
      const wrapper = render(
        <TreeSelect disabled treeData={treeData} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders TreeNode correctly', () => {
      const wrapper = render(
        <TreeSelect treeDefaultExpandAll>
          <TreeNode key="0" value="0" title="0 label"/>
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label"/>
            <TreeNode key="11" value="11" title="11 label"/>
          </TreeNode>
        </TreeSelect>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders TreeNode correctly with falsy child', () => {
      const wrapper = render(
        <TreeSelect treeDefaultExpandAll>
          <TreeNode key="0" value="0" title="0 label"/>
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label"/>
            <TreeNode key="11" value="11" title="11 label"/>
            {null}
          </TreeNode>
        </TreeSelect>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders treeDataSimpleMode correctly', () => {
      treeData = [
        { id: '0', value: '0', label: 'label0' },
        { id: '1', value: '1', label: 'label1', pId: '0' },
      ];
      const wrapper = render(
        <TreeSelect treeData={treeData} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('sets default value', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
    ];
    const wrapper = mount(
      <TreeSelect defaultValue="0" treeData={treeData} />
    );
    expect(
      wrapper.find('.rc-tree-select-selection__rendered > span').props().children
    ).toBe('label0');
  });

  it('can be controlled by value', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const wrapper = mount(
      <TreeSelect value="0" treeData={treeData} />
    );
    let choice = wrapper.find('.rc-tree-select-selection__rendered > span');
    expect(choice.prop('children')).toBe('label0');
    wrapper.setProps({ value: '1' });
    choice = wrapper.find('.rc-tree-select-selection__rendered > span');
    expect(choice.prop('children')).toBe('label1');
  });

  describe('select', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const createSelect = (props) => (
      <TreeSelect
        open
        treeData={treeData}
        {...props}
      />
    );

    it('fires change and select event', () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const wrapper = mount(createSelect({ onChange, onSelect }));
      wrapper.selectNode(0);
      const selectedNode = wrapper.find('TreeNode').first().instance();

      expect(onChange).toBeCalledWith('0', ['label0'], {
        preValue: [],
        selected: true,
        triggerNode: selectedNode,
        triggerValue: '0',
      });

      const args = onSelect.mock.calls[0];
      expect(args[1]).toBe(selectedNode);
      expect(args[2]).toMatchObject({
        event: 'select',
        selected: true,
      });
    });

    it('render result by treeNodeLabelProp', () => {
      const wrapper = mount(createSelect({ treeNodeLabelProp: 'value' }));
      wrapper.selectNode(0);
      expect(wrapper.find('.rc-tree-select-selection__rendered > span').prop('children')).toBe('0');
    });
  });

  describe('search nodes', () => {
    const treeData = [
      { key: 'a', value: 'a', label: 'labela' },
      { key: 'b', value: 'b', label: 'labelb' },
    ];
    const createSelect = (props) => (
      <TreeSelect
        open
        showSearch
        treeData={treeData}
        {...props}
      />
    );

    it('renders search input', () => {
      const wrapper = render(createSelect());
      expect(wrapper).toMatchSnapshot();
    });

    it('fires search event', () => {
      const onSearch = jest.fn();
      const wrapper = mount(createSelect({ onSearch }));
      wrapper.find('input').simulate('change', { target: { value: 'a' } });
      expect(onSearch).toBeCalledWith('a');
    });

    it('search nodes by filterTreeNode', () => {
      const filter = (value, node) => node.props.value.toLowerCase() === value.toLowerCase();
      const wrapper = mount(createSelect({ filterTreeNode: filter }));
      wrapper.find('input').simulate('change', { target: { value: 'A' } });
      expect(wrapper.find('TreeNode')).toHaveLength(1);
      expect(wrapper.find('TreeNode').prop('value')).toBe('a');
    });

    it('search nodes by treeNodeFilterProp', () => {
      const wrapper = mount(createSelect({ treeNodeFilterProp: 'label' }));
      wrapper.find('input').simulate('change', { target: { value: 'labela' } });
      expect(wrapper.find('TreeNode')).toHaveLength(1);
      expect(wrapper.find('TreeNode').prop('value')).toBe('a');
    });
  });

  it('open tree when click on select', () => {
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela"/>
      </TreeSelect>
    );
    wrapper.openSelect();
    expect(wrapper.state('open')).toBe(true);
  });

  it('close tree when press ESC', () => {
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela"/>
      </TreeSelect>
    );
    wrapper.setState({ open: true });
    wrapper.find('.rc-tree-select-search__field').simulate('keyDown', { keyCode: KeyCode.ESC });
    expect(wrapper.state('open')).toBe(false);
  });

  // https://github.com/ant-design/ant-design/issues/4084
  it('checks node correctly after treeData updated', () => {
    const wrapper = mount(
      <TreeSelect open treeCheckable treeData={[]} />
    );
    wrapper.setProps({ treeData: [{ key: '0', value: '0', label: 'label0' }] });
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    expect(wrapper.state().value).toEqual([{ value: '0', label: 'label0' }]);
  });

  it('expands tree nodes by treeDefaultExpandedKeys', () => {
    const wrapper = mount(
      <TreeSelect open treeDefaultExpandedKeys={['1']}>
        <TreeNode key="0" value="0" title="0 label"/>
        <TreeNode key="1" value="1" title="1 label">
          <TreeNode key="10" value="10" title="10 label"/>
          <TreeNode key="11" value="11" title="11 label"/>
        </TreeNode>
      </TreeSelect>
    );
    const node = wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(1);
    expect(node.hasClass('rc-tree-select-tree-node-content-wrapper-open')).toBe(true);
  });

  describe('allowClear', () => {
    it('not inputValue prop', () => {
      const wrapper = mount(
        <TreeSelect allowClear>
          <TreeNode key="0" value="0" title="0 label"/>
        </TreeSelect>
      );
      wrapper.openSelect();
      wrapper.find('.rc-tree-select-tree-title').simulate('click');
      wrapper.find('.rc-tree-select-selection__clear').simulate('click');
      expect(wrapper.state().value).toEqual([]);
    });

    it('has inputValue prop', () => {
      class App extends React.Component {
        state = {
          inputValue: '0',
        }

        handleSearch = (inputValue) => {
          this.setState({ inputValue });
        }

        render() {
          return (
            <div>
              <TreeSelect
                allowClear
                inputValue={this.state.inputValue}
                onSearch={this.handleSearch}
              >
                <TreeNode key="0" value="0" title="0 label"/>
              </TreeSelect>
            </div>
          );
        }
      }
      const wrapper = mount(<App />);
      wrapper.openSelect();
      wrapper.selectNode(0);
      wrapper.find('.rc-tree-select-selection__clear').simulate('click');
      expect(wrapper.find(TreeSelect).instance().state.value).toEqual([]);
    });
  });

  describe('propTypes', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    afterEach(() => {
      spy.mockReset();
    });

    afterAll(() => {
      spy.mockRestore();
    });

    it('warns on invalid value when labelInValue', () => {
      mount(
        <TreeSelect
          labelInValue
          value="foo"
        />
      );
      expect(spy.mock.calls[0][0]).toMatch(
        'Invalid prop `value` supplied to `Select`, when `labelInValue` ' +
        'is `true`, `value` should in shape of `{ value: string, label?: string }`'
      );
    });

    it('warns on invalid value when treeCheckable and treeCheckStrictly', () => {
      mount(
        <TreeSelect
          treeCheckable
          treeCheckStrictly
          value="foo"
        />
      );
      expect(spy.mock.calls[0][0]).toMatch(
        'Invalid prop `value` supplied to `Select`, when `treeCheckable` ' +
        'and `treeCheckStrictly` are `true`, `value` should in shape of ' +
        '`{ value: string, label?: string }`'
      );
    });

    it('warns on invalid value when multiple', () => {
      mount(
        <TreeSelect
          multiple
          value=""
        />
      );
      expect(spy.mock.calls[0][0]).toMatch(
        'Invalid prop `value` of type `string` supplied to `Select`, ' +
        'expected `array` when `multiple` is `true`'
      );
    });

    it('check title when label is a object', () => {
      const wrapper = render(
        <TreeSelect defaultValue="0">
          <TreeNode title={<span>Do not show</span>} value="0" key="0" />
        </TreeSelect>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
