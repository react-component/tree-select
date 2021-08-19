/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount } from 'enzyme';
import { TreeNode } from 'rc-tree';
import TreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode as SelectNode } from '../src';

// Promisify timeout to let jest catch works
function timeoutPromise(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

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
  const createOpenSelect = (props = {}) =>
    createSelect({ open: true, treeDefaultExpandAll: true, ...props });

  it('className', () => {
    const wrapper = mount(createOpenSelect({ className: 'test-class' }));
    expect(wrapper.find('.rc-tree-select').hasClass('test-class')).toBeTruthy();
  });

  it('prefixCls', () => {
    const wrapper = mount(createOpenSelect({ prefixCls: 'another-cls' }));
    expect(wrapper.find('.another-cls').length).toBeTruthy();
  });

  describe('filterTreeNode', () => {
    it('function', () => {
      function filterTreeNode(input, child) {
        return String(child.props.title).indexOf(input) !== -1;
      }
      const wrapper = mount(createOpenSelect({ filterTreeNode, showSearch: true }));
      wrapper.search('Title 1');
      expect(wrapper.find('List').props().data).toHaveLength(1);

      wrapper.search('0-0');
      expect(wrapper.find('List').props().data).toHaveLength(2);
    });

    it('false', () => {
      const wrapper = mount(createOpenSelect({ filterTreeNode: false, showSearch: true }));
      wrapper.search('Title 1');
      expect(wrapper.find('List').props().data).toHaveLength(4);
    });
  });

  describe('allowClear', () => {
    it('functional works', () => {
      const handleChange = jest.fn();
      const wrapper = mount(
        createSelect({
          allowClear: true,
          onChange: handleChange,
          treeDefaultExpandAll: true,
          open: true,
        }),
      );

      wrapper.openSelect();

      // Click node 0-1
      wrapper.selectNode(2);
      expect(handleChange).toHaveBeenCalledWith(
        'Value 0-1',
        ['Title 0-1'],
        expect.objectContaining({
          preValue: [],
          selected: true,
          triggerValue: 'Value 0-1',
          triggerNode: expect.anything(),
        }),
      );
      handleChange.mockReset();

      // Click to clear
      wrapper.clearAll();
      expect(handleChange).toHaveBeenCalledWith(
        undefined,
        [],
        expect.objectContaining({
          preValue: [{ label: 'Title 0-1', value: 'Value 0-1' }],
        }),
      );
    });

    it('value not in tree should also display allow clear', () => {
      const wrapper = mount(
        createSelect({
          allowClear: true,
          value: 'not-exist-in-tree',
        }),
      );
      expect(wrapper.find('.rc-tree-select-clear').length).toBeTruthy();
    });
  });

  it('placeholder', () => {
    const wrapper = mount(
      createSelect({
        placeholder: 'RC Component',
      }),
    );
    expect(wrapper.find('.rc-tree-select-selection-placeholder').text()).toBe('RC Component');
  });

  // https://github.com/ant-design/ant-design/issues/11746
  it('async update treeData when has searchInput', () => {
    const treeData = [{ title: 'aaa', value: '111' }];
    const Wrapper = props => (
      <div>
        <TreeSelect treeData={treeData} searchValue="111" showSearch open {...props} />
      </div>
    );
    const wrapper = mount(<Wrapper />);
    expect(wrapper.find('List').props().data).toHaveLength(1);
    wrapper.setProps({
      treeData: [{ title: 'bbb', value: '222' }],
    });
    expect(wrapper.find('List').length).toBeFalsy();
  });

  describe('labelInValue', () => {
    it('basic', () => {
      const handleChange = jest.fn();
      const wrapper = mount(
        createOpenSelect({
          labelInValue: true,
          onChange: handleChange,
        }),
      );
      // Click node 0-1
      wrapper.selectNode(2);
      expect(handleChange).toHaveBeenCalledWith(
        { label: 'Title 0-1', value: 'Value 0-1' },
        null,
        expect.objectContaining({
          preValue: [],
          selected: true,
          triggerValue: 'Value 0-1',
          triggerNode: expect.anything(),
        }),
      );
    });

    it('set illegal value', () => {
      const wrapper = mount(
        createSelect({
          placeholder: 'showMe',
          labelInValue: true,
          value: [null],
        }),
      );
      expect(wrapper.find('.rc-tree-select-selection-placeholder').text()).toBe('showMe');
    });
  });

  it('onClick', () => {
    const handleClick = jest.fn();
    const wrapper = mount(
      createSelect({
        labelInValue: true,
        onClick: handleClick,
      }),
    );
    // `onClick` depends on origin event trigger. Needn't test args
    wrapper.find('.rc-tree-select').simulate('click');
    expect(handleClick).toHaveBeenCalled();
  });

  // onChange - is already test above

  it('onSelect', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      createOpenSelect({
        onSelect: handleSelect,
      }),
    );
    wrapper.selectNode(2);

    // TreeNode use cloneElement so that the node is not the same
    expect(handleSelect.mock.calls[0][0]).toEqual('Value 0-1');
    expect(handleSelect.mock.calls[0][1].props).toEqual(
      expect.objectContaining({
        value: 'Value 0-1',
        title: 'Title 0-1',
      }),
    );
  });

  // TODO: `onDeselect` is copy from `Select` component and not implement complete.
  // This should be removed.

  it('onSearch', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      createOpenSelect({
        onSearch: handleSearch,
      }),
    );
    wrapper.search('Search changed');
    expect(handleSearch).toHaveBeenCalledWith('Search changed');
  });

  it('showArrow', () => {
    const wrapper = mount(createOpenSelect({ showArrow: false }));
    expect(wrapper.find('.rc-tree-select-arrow').length).toBeFalsy();
  });

  it('dropdownClassName', () => {
    const wrapper = mount(
      createOpenSelect({
        dropdownClassName: 'test-dropdownClassName',
      }),
    );
    expect(wrapper.find('.test-dropdownClassName').length).toBeTruthy();
  });

  it('dropdownStyle', () => {
    const style = {
      background: 'red',
    };
    const wrapper = mount(
      createOpenSelect({
        dropdownClassName: 'test-dropdownClassName',
        dropdownStyle: style,
      }),
    );
    expect(wrapper.find('.test-dropdownClassName').first().props().style).toEqual(
      expect.objectContaining(style),
    );
  });

  it('notFoundContent', () => {
    const wrapper = mount(
      createOpenSelect({
        notFoundContent: <div className="not-match">Noting Matched!</div>,
        treeData: [],
      }),
    );
    expect(wrapper.find('.not-match').text()).toEqual('Noting Matched!');
  });

  describe('showCheckedStrategy', () => {
    const testList = [
      {
        strategy: SHOW_ALL,
        arg1: ['Value 0', 'Value 0-0', 'Value 0-1'],
        arg2: ['Title 0', 'Title 0-0', 'Title 0-1'],
        arg3: {
          allCheckedNodes: [
            expect.objectContaining({
              node: expect.anything(),
              pos: '0-0',
              children: expect.anything(),
            }),
          ],
          checked: true,
          preValue: [],
          triggerNode: expect.anything(),
          triggerValue: 'Value 0',
        },
      },
      {
        strategy: SHOW_CHILD,
        arg1: ['Value 0-0', 'Value 0-1'],
        arg2: ['Title 0-0', 'Title 0-1'],
        arg3: {
          allCheckedNodes: [
            expect.objectContaining({
              node: expect.anything(),
              pos: '0-0',
              children: expect.anything(),
            }),
          ],
          checked: true,
          preValue: [],
          triggerNode: expect.anything(),
          triggerValue: 'Value 0',
        },
      },
      {
        strategy: SHOW_PARENT,
        arg1: ['Value 0'],
        arg2: ['Title 0'],
        arg3: {
          allCheckedNodes: [
            expect.objectContaining({
              node: expect.anything(),
              pos: '0-0',
              children: expect.anything(),
            }),
          ],
          checked: true,
          preValue: [],
          triggerNode: expect.anything(),
          triggerValue: 'Value 0',
        },
      },
    ];
    testList.forEach(({ strategy, arg1, arg2, arg3 }) => {
      it(strategy, () => {
        const handleChange = jest.fn();
        const wrapper = mount(
          createOpenSelect({
            treeCheckable: true,
            showCheckedStrategy: strategy,
            onChange: handleChange,
          }),
        );
        // TreeSelect will convert SelectNode to TreeNode.
        // Transitional node should get before click event
        // Since after click will render new TreeNode
        // [Legacy] FIXME: This is so hard to test
        wrapper.selectNode(0);
        expect(handleChange).toHaveBeenCalledWith(arg1, arg2, expect.anything());
        const { triggerNode, allCheckedNodes, ...rest } = handleChange.mock.calls[0][2];
        expect({ ...rest, triggerNode, allCheckedNodes }).toEqual(arg3);
      });
    });
  });

  // treeCheckStrictly - already tested in Select.checkable.spec.js

  // treeDataSimpleMode - already tested in Select.spec.js

  it('treeDefaultExpandAll', () => {
    const expandWrapper = mount(
      createOpenSelect({
        treeDefaultExpandAll: true,
      }),
    );
    expect(expandWrapper.find('List').props().data).toHaveLength(4);

    const unExpandWrapper = mount(
      createOpenSelect({
        treeDefaultExpandAll: false,
      }),
    );
    expect(unExpandWrapper.find('List').props().data).toHaveLength(2);
  });

  // treeCheckable - already tested in Select.checkable.spec.js
  // treeCheckStrictly - already tested in Select.checkable.spec.js
  // treeNodeFilterProp - already tested in Select.spec.js
  // treeNodeLabelProp - already tested in Select.spec.js

  it('maxTagTextLength', () => {
    const wrapper = mount(
      createSelect({
        multiple: true,
        maxTagTextLength: 2,
        value: ['Value 0-0', 'Value 1', 'Value 0-1'],
      }),
    );
    for (let i = 0; i < 3; i += 1) {
      expect(wrapper.getSelection(0).text()).toBe('Ti...');
    }
  });

  // disabled - already tested in Select.spec.js
  // inputValue - already tested in Select.spec.js

  it('defaultValue', () => {
    const wrapper = mount(
      createSelect({
        defaultValue: 'Value 0-0',
      }),
    );
    expect(wrapper.getSelection(0).text()).toBe('Title 0-0');
  });

  // labelInValue - already tested in Select.spec.js
  // onSelect - already tested in Select.spec.js
  // onSearch - already tested in Select.spec.js
  // treeDefaultExpandedKeys - already tested in Select.spec.js
  // treeData - already tested in Select.spec.js

  it('loadData', () => {
    let called = 0;
    const handleLoadData = jest.fn();
    class Demo extends React.Component {
      state = {
        loaded: false,
      };

      loadData = (...args) => {
        called += 1;
        handleLoadData(...args);
        this.setState({ loaded: true });
        return Promise.resolve();
      };

      render() {
        const { loaded } = this.state;
        return (
          <TreeSelect loadData={this.loadData} open>
            <TreeNode key="0-0" value="0-0">
              {loaded ? <TreeNode key="0-0-0" /> : null}
            </TreeNode>
          </TreeSelect>
        );
      }
    }
    const wrapper = mount(<Demo />);
    expect(handleLoadData).not.toHaveBeenCalled();

    wrapper.find('.rc-tree-select-tree-switcher').simulate('click');

    return timeoutPromise().then(() => {
      expect(handleLoadData).toHaveBeenCalledWith(expect.objectContaining({ value: '0-0' }));
      expect(called).toBe(1);
      expect(wrapper.find('List').props().data).toHaveLength(2);
    });
  });

  it('treeLoadedKeys', () => {
    const loadData = jest.fn(() => Promise.resolve());
    mount(
      <TreeSelect
        open
        treeDefaultExpandAll
        loadData={loadData}
        treeLoadedKeys={['0-0']}
        treeData={[{ value: '0-0' }, { value: '0-1' }]}
      />,
    );

    expect(loadData).toHaveBeenCalledTimes(1);
    expect(loadData).toHaveBeenCalledWith(expect.objectContaining({ value: '0-1' }));
  });

  it('getPopupContainer', () => {
    const getPopupContainer = trigger => trigger.parentNode;
    const wrapper = mount(createOpenSelect({ getPopupContainer }));
    expect(wrapper.find('Trigger').first().props().getPopupContainer).toBe(getPopupContainer);
  });

  it('set value not in the Tree', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <div>
        <TreeSelect value={['not exist']} onChange={onChange} treeCheckable open>
          <SelectNode title="exist" value="exist" />
        </TreeSelect>
      </div>,
    );
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    const valueList = onChange.mock.calls[0][0];
    expect(valueList).toEqual(['not exist', 'exist']);
  });

  describe('onDeselect trigger', () => {
    const nodeProps1 = {
      title: 'bamboo',
      value: 'smart',
      customize: 'beautiful',
    };
    const nodeProps2 = {
      title: 'day',
      value: 'light',
      customize: 'well',
    };
    const propList = [nodeProps1, nodeProps2];
    const createDeselectWrapper = props =>
      mount(
        <TreeSelect open {...props}>
          <SelectNode {...nodeProps1} />
          <SelectNode {...nodeProps2} />
        </TreeSelect>,
      );
    const nodeMatcher = index =>
      expect.objectContaining({
        props: expect.objectContaining(propList[index]),
      });

    describe('single', () => {
      it('click on tree', () => {
        const onSelect = jest.fn();
        const onDeselect = jest.fn();
        const wrapper = createDeselectWrapper({
          onSelect,
          onDeselect,
          defaultValue: 'smart',
        });
        wrapper.selectNode(0);
        expect(onDeselect).not.toHaveBeenCalled();
        expect(onSelect).toHaveBeenCalledWith('smart', nodeMatcher(0));
      });
    });

    describe('multiple', () => {
      [
        {
          props: { multiple: true },
          match: {
            event: 'select',
            selected: false,
            selectedNodes: [nodeMatcher(1)],
          },
        },
        {
          props: { treeCheckable: true },
          match: {
            event: 'check',
            checked: false,
            checkedNodes: [nodeMatcher(1)],
            checkedNodesPositions: [{ node: nodeMatcher(1), pos: '0-1' }],
            halfCheckedKeys: [],
          },
          selectorSkip: ['halfCheckedKeys'],
        },
      ].forEach(({ props }) => {
        it('click on tree', () => {
          const onSelect = jest.fn();
          const onDeselect = jest.fn();
          const wrapper = createDeselectWrapper({
            onSelect,
            onDeselect,
            defaultValue: ['smart', 'light'],
            ...props,
          });

          wrapper.selectNode(0);
          expect(onSelect).not.toHaveBeenCalled();
          expect(onDeselect).toHaveBeenCalledWith('smart', nodeMatcher(0));
        });

        it('click on selector', () => {
          const onSelect = jest.fn();
          const onDeselect = jest.fn();
          const wrapper = createDeselectWrapper({
            onSelect,
            onDeselect,
            defaultValue: ['smart', 'light'],
            ...props,
          });

          wrapper.clearSelection(0);
          expect(onSelect).not.toHaveBeenCalled();
          expect(onDeselect).toHaveBeenCalledWith('smart', nodeMatcher(0));
        });
      });
    });
  });
});
