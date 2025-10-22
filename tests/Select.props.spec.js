/* eslint-disable no-undef, react/no-multi-comp, no-console */
import { mount } from 'enzyme';
import Tree, { TreeNode } from '@rc-component/tree';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode as SelectNode } from '../src';
import { search } from './util';

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
    const { container } = render(createOpenSelect({ className: 'test-class' }));
    expect(container.querySelector('.rc-tree-select')).toHaveClass('test-class');
  });

  it('prefixCls', () => {
    const { container } = render(createOpenSelect({ prefixCls: 'another-cls' }));
    expect(container.querySelector('.another-cls')).toBeTruthy();
  });

  describe('filterTreeNode', () => {
    it('as function', () => {
      function filterTreeNode(input, child) {
        return String(child.props.title).indexOf(input) !== -1;
      }
      const { container } = render(createOpenSelect({ filterTreeNode, showSearch: true }));
      search(container, 'Title 1');
      expect(
        container.querySelectorAll('.rc-tree-select-tree-treenode:not([aria-hidden="true"])'),
      ).toHaveLength(1);

      search(container, '0-0');
      expect(
        container.querySelectorAll('.rc-tree-select-tree-treenode:not([aria-hidden="true"])'),
      ).toHaveLength(2);
    });

    it('false', () => {
      const { container } = render(createOpenSelect({ filterTreeNode: false, showSearch: true }));
      search(container, 'Title 1');
      expect(container.querySelectorAll('.rc-tree-select-tree-treenode')).toHaveLength(4);
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
    const { container } = render(
      createSelect({
        placeholder: 'RC Component',
      }),
    );
    const placeholderElement = container.querySelector('.rc-tree-select-placeholder');
    expect(placeholderElement).not.toBeNull();
    expect(placeholderElement).toHaveTextContent('RC Component');
  });

  // https://github.com/ant-design/ant-design/issues/11746
  it('async update treeData when has searchInput', () => {
    const treeData = [{ title: 'aaa', value: '111' }];
    const Wrapper = ({ treeData: propTreeData = treeData }) => (
      <div>
        <TreeSelect treeData={propTreeData} searchValue="111" showSearch open />
      </div>
    );
    const { container, rerender } = render(<Wrapper />);
    // Filter out hidden nodes and only count visible ones
    const visibleNodes = container.querySelectorAll(
      '.rc-tree-select-tree-treenode:not([aria-hidden="true"])',
    );
    expect(visibleNodes).toHaveLength(1);
    rerender(<Wrapper treeData={[{ title: 'bbb', value: '222' }]} />);
    const visibleNodesAfter = container.querySelectorAll(
      '.rc-tree-select-tree-treenode:not([aria-hidden="true"])',
    );
    expect(visibleNodesAfter).toHaveLength(0);
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
      const { container } = render(
        createSelect({
          placeholder: 'showMe',
          labelInValue: true,
          value: [null],
        }),
      );
      expect(container.querySelector('.rc-tree-select-placeholder')).toHaveTextContent('showMe');
    });

    it('use user provided one', () => {
      // Not exist
      const { container } = render(
        createSelect({
          labelInValue: true,
          value: { value: 'not-exist-value', label: 'Bamboo' },
        }),
      );
      expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('Bamboo');

      // Exist not same
      const { container: container2 } = render(
        createSelect({
          labelInValue: true,
          value: { value: 'Value 1', label: 'Bamboo' },
        }),
      );
      expect(container2.querySelector('.rc-tree-select-content-value')).toHaveTextContent('Bamboo');
    });
  });

  it('onClick', () => {
    const handleClick = jest.fn();
    const { container } = render(
      createSelect({
        labelInValue: true,
        onClick: handleClick,
      }),
    );
    // `onClick` depends on origin event trigger. Needn't test args
    fireEvent.click(container.querySelector('.rc-tree-select'));
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
    const { container } = render(
      createOpenSelect({
        onSearch: handleSearch,
      }),
    );
    search(container, 'Search changed');
    expect(handleSearch).toHaveBeenCalledWith('Search changed');
  });

  it('onPopupScroll', async () => {
    const onPopupScroll = jest.fn(e => {
      // Prevents React from resetting its properties:
      e.persist();
    });
    render(
      <TreeSelect
        open
        treeDefaultExpandAll
        onPopupScroll={onPopupScroll}
        treeData={new Array(10).fill(0).map((_, index) => ({
          title: `Title ${index}`,
          value: index,
        }))}
      />,
    );

    fireEvent.scroll(document.querySelector('.rc-tree-select-tree-list-holder'), {
      scrollY: 100,
    });

    expect(onPopupScroll).toHaveBeenCalled();
    expect(onPopupScroll.mock.calls[0][0].target).toBe(
      document.querySelector('.rc-tree-select-tree-list-holder'),
    );
  });

  it('showArrow', () => {
    const wrapper = mount(createOpenSelect({ suffixIcon: null }));
    expect(wrapper.find('.rc-tree-select-arrow').length).toBeFalsy();
  });

  it('popupClassName', () => {
    const wrapper = mount(
      createOpenSelect({
        popupClassName: 'test-popupClassName',
      }),
    );
    expect(wrapper.find('.test-popupClassName').length).toBeTruthy();
  });

  it('popupStyle', () => {
    const style = {
      background: 'red',
    };
    const wrapper = mount(
      createOpenSelect({
        popupClassName: 'test-popupClassName',
        popupStyle: style,
      }),
    );
    expect(wrapper.find('.test-popupClassName').first().props().style).toEqual(
      expect.objectContaining(style),
    );
  });

  it('notFoundContent', () => {
    const { container } = render(
      createOpenSelect({
        notFoundContent: <div className="not-match">Noting Matched!</div>,
        treeData: [],
      }),
    );
    expect(container.querySelector('.not-match')).toHaveTextContent('Noting Matched!');
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
    const { container } = render(
      createSelect({
        defaultValue: 'Value 0-0',
      }),
    );
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('Title 0-0');
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
        treeDefaultExpandedKeys={['0-0', '0-1']}
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
      it('click on tree node', () => {
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

      it('popupMatchSelectWidth={false} should turn off virtual list', () => {
        const wrapper = mount(
          <TreeSelect style={{ width: 120 }} open treeDefaultExpandAll>
            <TreeNode value="parent 1" title="parent 1">
              <TreeNode value="parent 1-0 sdfsdfsdsdfsd" title="parent 1-0 sdfsdfsd">
                <TreeNode value="leaf1  sdfsdf" title="leaf1" />
                <TreeNode value="leaf2 sdfsdfsdf" title="leaf2" />
              </TreeNode>
              <TreeNode value="parent 1-1 sdfsdfsdf" title="parent 1-1 sdfsdfsd">
                <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
              </TreeNode>
              <TreeNode value="parent 1-2 sdfsdfsdf" title="parent 1-2 sdfsdfsd">
                <TreeNode value="leaf4" title={<b style={{ color: '#08c' }}>leaf3</b>} />
              </TreeNode>
              <TreeNode value="parent 1-3 sdfsdfsdf" title="parent 1-2 sdfsdfsd">
                <TreeNode value="leaf5" title={<b style={{ color: '#08c' }}>leaf3</b>} />
              </TreeNode>
              <TreeNode value="parent 1-4 sdfsdfsdf" title="parent 1-4 sdfsdfsd">
                <TreeNode value="leaf6" title={<b style={{ color: '#08c' }}>leaf3</b>} />
              </TreeNode>
              <TreeNode value="parent 1-5 2sdfsdfsdf" title="parent 1-5 sdfsdfsd">
                <TreeNode value="leaf7" title={<b style={{ color: '#08c' }}>leaf3</b>} />
              </TreeNode>
            </TreeNode>
          </TreeSelect>,
        );
        expect(wrapper.find(Tree).props().virtual).toBe(true);
        wrapper.setProps({ popupMatchSelectWidth: false });
        expect(wrapper.find(Tree).props().virtual).toBe(false);
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

    describe('title render', () => {
      const treeData = [
        { label: 'Label 0-0', value: 'Value 0-0', key: 'key 0-0' },
        { label: 'Label 0-1', value: 'Value 0-1', key: 'key 0-1' },
        { label: 'Label 1-0', value: 'Value 1-0', key: 'key 1-0' },
      ];
      it('basic', () => {
        const { container } = render(
          <div>
            <TreeSelect
              defaultValue={'Value 0-0'}
              treeTitleRender={node => node.value}
              treeData={treeData}
            />
          </div>,
        );
        expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent(
          'Value 0-0',
        );
      });

      it('with fieldNames', () => {
        const { container } = render(
          <div>
            <TreeSelect
              defaultValue={'parent'}
              treeTitleRender={node => node.myLabel}
              fieldNames={{
                label: 'myLabel',
                value: 'myValue',
                children: 'myChildren',
              }}
              treeData={[
                {
                  myLabel: 'Parent',
                  myValue: 'parent',
                  myChildren: [
                    {
                      myLabel: 'Sub 1',
                      myValue: 'sub_1',
                    },
                    {
                      myLabel: 'Sub 2',
                      myValue: 'sub_2',
                    },
                  ],
                },
              ]}
            />
          </div>,
        );
        expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent(
          'Parent',
        );
      });
    });
  });
});
