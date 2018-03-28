/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
// import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect from '../src';
import { TreeNode } from 'rc-tree';

// import diff from 'rc-util/lib/debug/diff';
// import focusTest from './shared/focusTest';


const { TreeNode: SelectNode } = TreeSelect;

// Convert wrapper to render json
const wrapperToJson = (wrapper) => (
  renderToJson(wrapper.render())
);

describe('TreeSelect.props', () => {
  // Must wrap with `div` since enzyme will only return first child of fragment
  const createSelect = (props = {}) => (
    <div>
      <TreeSelect {...props}>
        <SelectNode value="Value 0" title="Title 0" key="key 0">
          <SelectNode value="Value 0-0" title="Title 0-0" key="key 0-0" />
          <SelectNode value="Value 0-1" title="Title 0-1" key="key 0-1" />
        </SelectNode>
        <SelectNode value="Value 1" title="Title 1" key="key 1" />
      </TreeSelect>
    </div>
  );

  const createOpenSelect = (props = {}) => (
    createSelect({ open: true, treeDefaultExpandAll: true, ...props })
  );

  /* beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  }); */

  it('basic', () => {
    const wrapper = mount(createSelect());
    expect(wrapperToJson(wrapper)).toMatchSnapshot();

    wrapper.find('.rc-tree-select').simulate('click');
    expect(wrapperToJson(wrapper)).toMatchSnapshot();
  });

  it('prefixCls', () => {
    const wrapper = mount(createOpenSelect({ prefixCls: 'another-cls' }));
    expect(wrapperToJson(wrapper)).toMatchSnapshot();
  });

  it('filterTreeNode', () => {
    function filterTreeNode(input, child) {
      return String(child.props.title).indexOf(input) !== -1;
    }
    const wrapper = mount(createOpenSelect({ filterTreeNode }));
    wrapper.find('input').simulate('change', { target: { value: 'Title 1' } });
    expect(wrapperToJson(wrapper)).toMatchSnapshot();

    wrapper.find('input').simulate('change', { target: { value: '0-0' } });
    expect(wrapperToJson(wrapper)).toMatchSnapshot();
  });

  it('showSearch', () => {
    const wrapper = mount(createOpenSelect({ showSearch: false }));
    expect(wrapperToJson(wrapper)).toMatchSnapshot();
  });

  it('allowClear', () => {
    let $node;
    const handleChange = jest.fn();

    const wrapper = mount(createOpenSelect({
      allowClear: true,
      onChange: handleChange,
    }));
    expect(wrapperToJson(wrapper)).toMatchSnapshot();

    // Click node 0-1
    $node = wrapper.find(TreeNode).at(2);
    $node.find('.rc-tree-select-tree-node-content-wrapper').simulate('click');

    expect(wrapperToJson(wrapper)).toMatchSnapshot();
    expect(handleChange).toBeCalledWith(
      'Value 0-1',
      ['Title 0-1'],
      {
        preValue: [],
        selected: true,
        triggerValue: 'Value 0-1',
        triggerNode: $node.instance(),
      },
    );
    handleChange.mockReset();

    // Click to clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');

    expect(wrapperToJson(wrapper)).toMatchSnapshot();
    expect(handleChange).toBeCalledWith(
      undefined,
      [],
      {
        preValue: [{ label: 'Title 0-1', value: 'Value 0-1' }],
      },
    );
  });

  it('placeholder', () => {
    const wrapper = render(createSelect({
      placeholder: 'Ant Design',
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
