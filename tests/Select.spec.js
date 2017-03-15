/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect from '..';

const { TreeNode } = TreeSelect;

describe('TreeSelect', () => {
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
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders tree correctly', () => {
      const wrapper = mount(
        <TreeSelect
          dropdownClassName="awesome"
          dropdownStyle={{ width: 300 }}
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
        />
      );
      const treeWrapper = render(wrapper.find('Trigger').node.getComponent());
      expect(renderToJson(treeWrapper)).toMatchSnapshot();
    });

    it('renders disabled correctly', () => {
      const wrapper = render(
        <TreeSelect disabled treeData={treeData} />
      );
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders TreeNode correctly', () => {
      const wrapper = mount(
        <TreeSelect treeDefaultExpandAll>
          <TreeNode key="0" value="0" title="0 label"/>
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label"/>
            <TreeNode key="11" value="11" title="11 label"/>
          </TreeNode>
        </TreeSelect>
      );
      const treeWrapper = render(wrapper.find('Trigger').node.getComponent());
      expect(renderToJson(treeWrapper)).toMatchSnapshot();
    });

    it('renders treeDataSimpleMode correctly', () => {
      treeData = [
        { id: '0', value: '0', label: 'label0' },
        { id: '1', value: '1', label: 'label1', pId: '0' },
      ];
      const wrapper = mount(
        <TreeSelect treeData={treeData} />
      );
      const treeWrapper = render(wrapper.find('Trigger').node.getComponent());
      expect(renderToJson(treeWrapper)).toMatchSnapshot();
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
    const choice = wrapper.find('.rc-tree-select-selection__rendered > span');
    expect(choice.prop('children')).toBe('label0');
    wrapper.setProps({ value: '1' });
    expect(choice.prop('children')).toBe('label1');
  });

  describe('select', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const createSelect = (props) => (
      <TreeSelect
        treeData={treeData}
        {...props}
      />
    );
    const select = (wrapper, index = 0) => {
      wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(index).simulate('click');
    };

    it('fires change and select event', () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const wrapper = mount(createSelect({ onChange, onSelect }));
      const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      select(treeWrapper);
      const selectedNode = treeWrapper.find('TreeNode').first().node;

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
      const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      select(treeWrapper);
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
        showSearch
        treeData={treeData}
        {...props}
      />
    );

    it('renders search input', () => {
      const wrapper = mount(createSelect());
      const treeWrapper = render(wrapper.find('Trigger').node.getComponent());
      expect(renderToJson(treeWrapper)).toMatchSnapshot();
    });

    it('fires search event', () => {
      const onSearch = jest.fn();
      const wrapper = mount(createSelect({ onSearch }));
      const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      treeWrapper.find('input').simulate('change', { target: { value: 'a' } });
      expect(onSearch).toBeCalledWith('a');
    });

    it('search nodes by filterTreeNode', () => {
      const filter = (value, node) => node.props.value.toLowerCase() === value.toLowerCase();
      const wrapper = mount(createSelect({ filterTreeNode: filter }));
      let treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      treeWrapper.find('input').simulate('change', { target: { value: 'A' } });
      treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      expect(treeWrapper.find('TreeNode')).toHaveLength(1);
      expect(treeWrapper.find('TreeNode').prop('value')).toBe('a');
    });

    it('search nodes by treeNodeFilterProp', () => {
      const wrapper = mount(createSelect({ treeNodeFilterProp: 'label' }));
      let treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      treeWrapper.find('input').simulate('change', { target: { value: 'labela' } });
      treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
      expect(treeWrapper.find('TreeNode')).toHaveLength(1);
      expect(treeWrapper.find('TreeNode').prop('value')).toBe('a');
    });
  });

  it('open tree when click on select', () => {
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela"/>
      </TreeSelect>
    );
    jest.useFakeTimers();
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    expect(wrapper.state('open')).toBe(true);
  });

  it('close tree when press ESC', () => {
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela"/>
      </TreeSelect>
    );
    wrapper.setState({ open: true });
    jest.useFakeTimers();
    wrapper.find('.rc-tree-select-selection').simulate('keyDown', { keyCode: KeyCode.ESC });
    jest.runAllTimers();
    expect(wrapper.state('open')).toBe(false);
  });

  // https://github.com/ant-design/ant-design/issues/4084
  it('checks node correctly after treeData updated', () => {
    const wrapper = mount(
      <TreeSelect treeCheckable treeData={[]} />
    );
    wrapper.setProps({ treeData: [{ key: '0', value: '0', label: 'label0' }] });
    const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
    treeWrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    expect(wrapper.state().value).toEqual([{ value: '0', label: 'label0' }]);
  });

  it('expands tree nodes by treeDefaultExpandedKeys', () => {
    const wrapper = mount(
      <TreeSelect treeDefaultExpandedKeys={['1']}>
        <TreeNode key="0" value="0" title="0 label"/>
        <TreeNode key="1" value="1" title="1 label">
          <TreeNode key="10" value="10" title="10 label"/>
          <TreeNode key="11" value="11" title="11 label"/>
        </TreeNode>
      </TreeSelect>
    );
    const treeWrapper = mount(wrapper.find('Trigger').node.getComponent());
    const node = treeWrapper.find('.rc-tree-select-tree-node-content-wrapper').at(1);
    expect(node.hasClass('rc-tree-select-tree-node-content-wrapper-open')).toBe(true);
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
  });
});
