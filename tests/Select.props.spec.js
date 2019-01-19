/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from 'rc-tree';
import Trigger from 'rc-trigger';
import TreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode as SelectNode } from '../src';
import { resetAriaId } from '../src/util';
import { setMock } from './__mocks__/rc-animate';

// Promisify timeout to let jest catch works
function timeoutPromise(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

describe('TreeSelect.props', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetAriaId();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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

  it('basic', () => {
    const wrapper = mount(createSelect());
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('.rc-tree-select').simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('className', () => {
    const wrapper = mount(createOpenSelect({ className: 'test-class' }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('prefixCls', () => {
    const wrapper = mount(createOpenSelect({ prefixCls: 'another-cls' }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('animation', () => {
    setMock(true);
    const wrapper = mount(createSelect({
      animation: 'test-animation',
    }));
    wrapper.find('.rc-tree-select').simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
    setMock(false);
  });

  it('transitionName', () => {
    setMock(true);
    const wrapper = mount(createSelect({
      transitionName: 'test-transitionName',
    }));
    wrapper.find('.rc-tree-select').simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
    setMock(false);
  });

  it('choiceTransitionName', () => {
    setMock(true);
    class Wrapper extends React.Component {
      state = {
        value: [],
      };

      doValueUpdate = () => {
        this.setState({
          value: ['Value 0'],
        });
      };

      render() {
        return (
          <div>
            <TreeSelect
              choiceTransitionName="test-choiceTransitionName"
              value={this.state.value}
              multiple
            >
              <SelectNode value="Value 0" title="Title 0" key="key 0" />
            </TreeSelect>
          </div>
        );
      }
    }

    const wrapper = mount(<Wrapper />);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.instance().doValueUpdate();
    expect(wrapper.render()).toMatchSnapshot();
    setMock(false);
  });

  describe('filterTreeNode', () => {
    it('function', () => {
      function filterTreeNode(input, child) {
        return String(child.props.title).indexOf(input) !== -1;
      }
      const wrapper = mount(createOpenSelect({ filterTreeNode }));
      wrapper.find('input').simulate('change', { target: { value: 'Title 1' } });
      expect(wrapper.render()).toMatchSnapshot();
  
      wrapper.find('input').simulate('change', { target: { value: '0-0' } });
      expect(wrapper.render()).toMatchSnapshot();
    });
    
    it('false', () => {
      const wrapper = mount(createOpenSelect({ filterTreeNode: false }));
      wrapper.find('input').simulate('change', { target: { value: 'Title 1' } });
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('showSearch', () => {
    const wrapper = mount(createOpenSelect({ showSearch: false }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('allowClear', () => {
    it('functional works', () => {
      const handleChange = jest.fn();

      const wrapper = mount(createSelect({
        allowClear: true,
        onChange: handleChange,
        treeDefaultExpandAll: true,
        open: true,
      }));
      wrapper.find('.rc-tree-select').simulate('click');
      expect(wrapper.render()).toMatchSnapshot();

      // Click node 0-1
      const $node = wrapper.find(TreeNode).at(2);
      $node.find('.rc-tree-select-tree-node-content-wrapper').simulate('click');

      expect(wrapper.render()).toMatchSnapshot();
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

      expect(wrapper.render()).toMatchSnapshot();
      expect(handleChange).toBeCalledWith(
        undefined,
        [],
        {
          preValue: [{ label: 'Title 0-1', value: 'Value 0-1' }],
        },
      );
    });

    it('value not in tree should also display allow clear', () => {
      const wrapper = mount(createSelect({
        allowClear: true,
        value: 'not-exist-in-tree',
      }));
      expect(
        wrapper.find('.rc-tree-select-selection__clear').length
      ).toBeTruthy();
    });
  });

  it('placeholder', () => {
    const wrapper = render(createSelect({
      placeholder: 'RC Component',
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('searchPlaceholder', () => {
    const wrapper = mount(createOpenSelect({
      searchPlaceholder: 'RC Component',
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/11746
  it('async update treeData when has searchInput', () => {
    const treeData = [{ title: 'aaa', value: '111' }];
    const Wrapper = (props) => (
      <div>
        <TreeSelect
          treeData={treeData}
          searchValue="111"
          open
          {...props}
        />
      </div>
    );
    const wrapper = mount(<Wrapper />);

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      treeData: [{ title: 'bbb', value: '222' }],
    });

    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('labelInValue', () => {
    it('basic', () => {
      const handleChange = jest.fn();
      const wrapper = mount(createOpenSelect({
        labelInValue: true,
        onChange: handleChange,
      }));

      // Click node 0-1
      const $node = wrapper.find(TreeNode).at(2);
      $node.find('.rc-tree-select-tree-node-content-wrapper').simulate('click');

      expect(handleChange).toBeCalledWith(
        { label: 'Title 0-1', value: 'Value 0-1' },
        null,
        {
          preValue: [],
          selected: true,
          triggerValue: 'Value 0-1',
          triggerNode: $node.instance(),
        },
      );
    });

    it('set illegal value', () => {
      const wrapper = mount(createSelect({
        labelInValue: true,
        value: [null],
      }));

      expect(wrapper.find(TreeSelect).instance().state.valueList).toEqual(
        []
      );
      expect(wrapper.find(TreeSelect).instance().state.missValueList).toEqual(
        [{ label: '', value: '' }]
      );
    });
  });

  it('onClick', () => {
    const handleClick = jest.fn();
    const wrapper = mount(createSelect({
      labelInValue: true,
      onClick: handleClick,
    }));

    // `onClick` depends on origin event trigger. Need't test args
    wrapper.find('.rc-tree-select').simulate('click');
    expect(handleClick).toBeCalled();
  });

  // onChange - is already test above

  it('onSelect', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(createOpenSelect({
      onSelect: handleSelect,
    }));

    const $paren = wrapper.find(TreeNode).at(0);
    const $node = wrapper.find(TreeNode).at(2);
    $node.find('.rc-tree-select-tree-node-content-wrapper').simulate('click');

    // TreeNode use cloneElement so that the node is not the same
    expect(handleSelect).toBeCalledWith(
      'Value 0-1',
      $node.instance(),
      {
        event: 'select',
        node: $node.instance(),
        selected: true,
        selectedNodes: [$paren.props().children[1]],
        nativeEvent: expect.objectContaining({}), // Native event object
      },
    );
  });

  // TODO: `onDeselect` is copy from `Select` component and not implement complete.
  // This should be removed.

  it('onSearch', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(createOpenSelect({
      onSearch: handleSearch,
    }));

    wrapper.find('input').simulate('change', { target: { value: 'Search changed' } });
    expect(handleSearch).toBeCalledWith('Search changed');
  });

  it('showArrow', () => {
    const wrapper = mount(createOpenSelect({ showArrow: false }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('dropdownMatchSelectWidth', () => {
    it('default', () => {
      const wrapper = mount(createOpenSelect());
      expect(wrapper.render()).toMatchSnapshot();
    });

    [true, false].forEach((dropdownMatchSelectWidth) => {
      it(String(dropdownMatchSelectWidth), () => {
        const wrapper = mount(createOpenSelect({
          dropdownMatchSelectWidth,
        }));
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });

  it('dropdownClassName', () => {
    const wrapper = mount(createOpenSelect({
      dropdownClassName: 'test-dropdownClassName',
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('dropdownStyle', () => {
    const wrapper = mount(createOpenSelect({
      dropdownStyle: {
        background: 'red',
      },
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('dropdownPopupAlign', () => {
    const dropdownPopupAlign = {
      forPassPropTest: true,
    };

    const wrapper = mount(createOpenSelect({ dropdownPopupAlign }));

    expect(wrapper.find(Trigger).props().popupAlign).toBe(dropdownPopupAlign);
  });

  it('onDropdownVisibleChange', () => {
    let canProcess = true;

    const handleDropdownVisibleChange = jest.fn();
    const wrapper = mount(createSelect({
      onDropdownVisibleChange: (...args) => {
        handleDropdownVisibleChange(...args);
        return canProcess;
      },
    }));

    const $select = wrapper.find('.rc-tree-select');

    // Simulate when can process
    $select.simulate('click');
    expect(handleDropdownVisibleChange).toBeCalledWith(
      true, { documentClickClose: false });
    handleDropdownVisibleChange.mockReset();

    // https://github.com/ant-design/ant-design/issues/9857
    // Both use blur to hide. click not affect this.
    $select.simulate('click');
    expect(handleDropdownVisibleChange).toBeCalledWith(
      false, { documentClickClose: true }
    );
    handleDropdownVisibleChange.mockReset();

    $select.simulate('blur');
    jest.runAllTimers();
    expect(handleDropdownVisibleChange).not.toBeCalled();
    handleDropdownVisibleChange.mockReset();

    // Simulate when can't process
    canProcess = false;

    $select.simulate('click');
    expect(handleDropdownVisibleChange).toBeCalledWith(
      true, { documentClickClose: false });
    handleDropdownVisibleChange.mockReset();

    $select.simulate('click');
    expect(handleDropdownVisibleChange).toBeCalledWith(
      true, { documentClickClose: false });
    handleDropdownVisibleChange.mockReset();

    $select.simulate('blur');
    jest.runAllTimers();
    expect(handleDropdownVisibleChange).not.toBeCalled();
  });

  it('notFoundContent', () => {
    const wrapper = mount(createOpenSelect({
      notFoundContent: 'Noting Matched!',
      treeData: [],
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('showCheckedStrategy', () => {
    const testList = [
      {
        strategy: SHOW_ALL,
        arg1: ['Value 0', 'Value 0-0', 'Value 0-1'],
        arg2: ['Title 0', 'Title 0-0', 'Title 0-1'],
        arg3: ($node, $oriNode) => {
          const children = $node.props().children;

          return {
            allCheckedNodes: [{
              node: $oriNode,
              pos: '0-0',
              children: [
                { node: children[0], pos: '0-0-0' },
                { node: children[1], pos: '0-0-1' },
              ],
            }],
            checked: true,
            preValue: [],
            triggerNode: $node.instance(),
            triggerValue: 'Value 0',
          };
        },
      },
      {
        strategy: SHOW_CHILD,
        arg1: ['Value 0-0', 'Value 0-1'],
        arg2: ['Title 0-0', 'Title 0-1'],
        arg3: ($node, $oriNode) => {
          const children = $node.props().children;

          return {
            allCheckedNodes: [{
              node: $oriNode,
              pos: '0-0',
              children: [
                { node: children[0], pos: '0-0-0' },
                { node: children[1], pos: '0-0-1' },
              ],
            }],
            checked: true,
            preValue: [],
            triggerNode: $node.instance(),
            triggerValue: 'Value 0',
          };
        },
      },
      {
        strategy: SHOW_PARENT,
        arg1: ['Value 0'],
        arg2: ['Title 0'],
        arg3: ($node, $oriNode) => {
          const children = $node.props().children;

          return {
            allCheckedNodes: [{
              node: $oriNode,
              pos: '0-0',
              children: [
                { node: children[0], pos: '0-0-0' },
                { node: children[1], pos: '0-0-1' },
              ],
            }],
            checked: true,
            preValue: [],
            triggerNode: $node.instance(),
            triggerValue: 'Value 0',
          };
        },
      },
    ];

    testList.forEach(({ strategy, arg1, arg2, arg3 }) => {
      it(strategy, () => {
        const handleChange = jest.fn();

        const wrapper = mount(createOpenSelect({
          treeCheckable: true,
          showCheckedStrategy: strategy,
          onChange: handleChange,
        }));


        // TreeSelect will convert SelectNode to TreeNode.
        // Transitional node should get before click event
        // Since after click will render new TreeNode
        // [Legacy] FIXME: This is so hard to test
        const $tree = wrapper.find(Tree);
        const $oriNode = $tree.props().children[0];

        const $node = wrapper.find(TreeNode).at(0);
        $node.find('.rc-tree-select-tree-checkbox').first().simulate('click');

        expect(handleChange).toBeCalledWith(arg1, arg2, arg3($node, $oriNode));
      });
    });
  });

  // treeCheckStrictly - already tested in Select.checkable.spec.js

  it('treeIcon', () => {
    const wrapper = mount(createOpenSelect({
      treeIcon: true,
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('treeLine', () => {
    const wrapper = mount(createOpenSelect({
      treeLine: true,
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  // treeDataSimpleMode - already tested in Select.spec.js

  it('treeDefaultExpandAll', () => {
    const expandWrapper = mount(createOpenSelect({
      treeDefaultExpandAll: true,
    }));
    expect(expandWrapper.render()).toMatchSnapshot();

    const unexpandWrapper = mount(createOpenSelect({
      treeDefaultExpandAll: false,
    }));
    expect(unexpandWrapper.render()).toMatchSnapshot();
  });

  // treeCheckable - already tested in Select.checkable.spec.js
  // treeCheckStrictly - already tested in Select.checkable.spec.js
  // treeNodeFilterProp - already tested in Select.spec.js
  // treeNodeLabelProp - already tested in Select.spec.js

  it('maxTagTextLength', () => {
    const wrapper = mount(createSelect({
      multiple: true,
      maxTagTextLength: 2,
      value: ['Value 0-0', 'Value 1', 'Value 0-1'],
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  // disabled - already tested in Select.spec.js
  // inputValue - already tested in Select.spec.js

  it('defaultValue', () => {
    const wrapper = mount(createSelect({
      defaultValue: 'Value 0-0',
    }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  // labelInValue - already tested in Select.spec.js
  // onSelect - already tested in Select.spec.js
  // onSearch - already tested in Select.spec.js
  // treeDefaultExpandedKeys - already tested in Select.spec.js
  // treeData - already tested in Select.spec.js

  it('loadData', () => {
    jest.useRealTimers();

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
        return (
          <TreeSelect loadData={this.loadData} open>
            <TreeNode key="0-0" value="0-0">
              {this.state.loaded ? <TreeNode key="0-0-0" /> : null}
            </TreeNode>
          </TreeSelect>
        );
      }
    }

    const wrapper = mount(<Demo />);

    expect(handleLoadData).not.toBeCalled();

    const switcher = wrapper.find('.rc-tree-select-tree-switcher');
    const node = wrapper.find(TreeNode).instance();
    switcher.simulate('click');

    return timeoutPromise().then(() => {
      expect(handleLoadData).toBeCalledWith(node);
      expect(called).toBe(1);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('getPopupContainer', () => {
    const getPopupContainer = (trigger) => trigger.parentNode;

    const wrapper = mount(createOpenSelect({ getPopupContainer }));

    expect(wrapper.find(Trigger).props().getPopupContainer).toBe(getPopupContainer);
  });

  it('set value not in the Tree', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <div>
        <TreeSelect value={['not exist']} onChange={onChange} treeCheckable open>
          <SelectNode title="exist" value="exist" />
        </TreeSelect>
      </div>
    );

    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');

    const valueList = onChange.mock.calls[0][0];
    expect(valueList).toEqual(['not exist', 'exist']);
  });

  it('warning if use label', () => {
    const spy = jest.spyOn(global.console, 'error');
    console.log('>>> Follow Warning is for test purpose. Don\'t be scared :)');
    render(
      <TreeSelect treeData={[{ label: 'old school', value: 'hip hop' }]} />
    );
    expect(spy).toHaveBeenCalledWith(
      'Warning: \'label\' in treeData is deprecated. Please use \'title\' instead.'
    );
    spy.mockRestore();
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

    const createDeselectWrapper = (props) => mount(
      <TreeSelect open {...props}>
        <SelectNode {...nodeProps1} />
        <SelectNode {...nodeProps2} />
      </TreeSelect>
    );

    const nodeMatcher = (index) => (
      expect.objectContaining({
        props: expect.objectContaining(propList[index]),
      })
    );

    describe('single', () => {
      it('click on tree', () => {
        const onSelect = jest.fn();
        const onDeselect = jest.fn();
        const wrapper = createDeselectWrapper({ onSelect, onDeselect, defaultValue: 'smart' });
        wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(0).simulate('click');
        expect(onSelect).not.toBeCalled();
        expect(onDeselect.mock.calls[0][0]).toEqual('smart');
        expect(onDeselect.mock.calls[0][1]).toEqual(nodeMatcher(0));
        expect(onDeselect.mock.calls[0][2]).toEqual({
          event: 'select',
          selected: false,
          nativeEvent: expect.objectContaining({}), // Not check native event
          node: nodeMatcher(0),
          selectedNodes: [],
        });
      });
    });

    describe('multiple', () => {
      [
        {
          props: { multiple: true },
          match: { event: 'select', selected: false, selectedNodes: [nodeMatcher(1)] }
        },
        {
          props: { treeCheckable: true },
          match: {
            event: 'check',
            checked: false,
            checkedNodes: [nodeMatcher(1)],
            checkedNodesPositions: [ { node: nodeMatcher(1), pos: '0-1' } ],
            halfCheckedKeys: [],
          },
          selectorSkip: ['halfCheckedKeys'],
        },
      ].forEach(({ props, match, selectorSkip = [] }) => {
        it('click on tree', () => {
          const onSelect = jest.fn();
          const onDeselect = jest.fn();
          const wrapper = createDeselectWrapper({
            onSelect,
            onDeselect,
            defaultValue: ['smart', 'light'],
            ...props
          });
          wrapper.find('.rc-tree-select-tree-node-content-wrapper').at(0).simulate('click');
          expect(onSelect).not.toBeCalled();
          expect(onDeselect.mock.calls[0][0]).toEqual('smart');
          expect(onDeselect.mock.calls[0][1]).toEqual(nodeMatcher(0));
          expect(onDeselect.mock.calls[0][2]).toEqual({
            nativeEvent: expect.objectContaining({}), // Not check native event
            node: nodeMatcher(0),
            ...match,
          });
        });

        it('click on selector', () => {
          const onSelect = jest.fn();
          const onDeselect = jest.fn();
          const wrapper = createDeselectWrapper({
            onSelect,
            onDeselect,
            defaultValue: ['smart', 'light'],
            ...props
          });
          wrapper.find('.rc-tree-select-selection__choice__remove').at(0).simulate('click');
          expect(onSelect).not.toBeCalled();
          expect(onDeselect.mock.calls[0][0]).toEqual('smart');
          expect(onDeselect.mock.calls[0][1]).toEqual(nodeMatcher(0));

          const tgtArg3 = {
            nativeEvent: expect.objectContaining({}), // Not check native event
            node: nodeMatcher(0),
            ...match,
          };

          Object.keys(tgtArg3).forEach((key) => {
            if (selectorSkip.includes(key)) return;

            const tgtVal = tgtArg3[key];
            expect(onDeselect.mock.calls[0][2][key]).toEqual(tgtVal);
          });
        });
      });
    });
  });
});
