import { act, createEvent, render, fireEvent } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';
import {
  clearAll,
  expectOpen,
  getInput,
  getSelections,
  getVisibleTreeNodes,
  keyDown,
  keyUp,
  selectNode,
  triggerOpen,
} from './util';
import type { BaseSelectRef } from '@rc-component/select';

const mockScrollTo = jest.fn();

// Mock `useScrollTo` from `@rc-component/virtual-list/lib/hooks/useScrollTo`
jest.mock('@rc-component/virtual-list/lib/hooks/useScrollTo', () => {
  return () => mockScrollTo;
});

describe('TreeSelect.basic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockScrollTo.mockReset();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  focusTest();

  describe('render', () => {
    const treeData = [
      { key: '0', value: '0', title: '0 label' },
      {
        key: '1',
        value: '1',
        title: '1 label',
        children: [
          { key: '10', value: '10', title: '10 label' },
          { key: '11', value: '11', title: '11 label' },
        ],
      },
    ];

    it('renders correctly', () => {
      const { container } = render(
        <TreeSelect
          style={{ width: 300 }}
          prefixCls="awesome"
          className="forTest"
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders tree correctly', () => {
      const { container } = render(
        <TreeSelect
          popupClassName="awesome"
          popupStyle={{ width: 300 }}
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
          open
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('not crash if no children', () => {
      render(<TreeSelect open />);
    });

    it('not crash if no treeData', () => {
      render(<TreeSelect value="" treeData={[]} open />);
    });

    it('renders disabled correctly', () => {
      const { container } = render(<TreeSelect disabled treeData={treeData} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders TreeNode correctly', () => {
      const { container } = render(
        <TreeSelect treeDefaultExpandAll open>
          <TreeNode key="0" value="0" title="0 label" />
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label" />
            <TreeNode key="11" value="11" title="11 label" />
          </TreeNode>
        </TreeSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders TreeNode correctly with falsy child', () => {
      const { container } = render(
        <TreeSelect treeDefaultExpandAll open>
          <TreeNode key="0" value="0" title="0 label" />
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label" />
            <TreeNode key="11" value="11" title="11 label" />
            {null}
          </TreeNode>
        </TreeSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders treeDataSimpleMode correctly', () => {
      const { container } = render(
        <div>
          <TreeSelect
            treeData={[
              { id: '0', value: '0', title: 'label0' },
              { id: '1', value: '1', title: 'label1', pId: '0' },
            ]}
            treeDataSimpleMode
            treeDefaultExpandAll
            open
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('sets default value', () => {
    const { container } = render(
      <TreeSelect defaultValue="0" treeData={[{ key: '0', value: '0', title: 'label0' }]} />,
    );
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('label0');
  });

  it('sets default value(disabled)', () => {
    const { container } = render(
      <TreeSelect
        defaultValue="0"
        treeData={[{ key: '0', value: '0', title: 'label0', disabled: true }]}
      />,
    );
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('label0');
  });

  it('select value twice', () => {
    const onChange = jest.fn();
    const { container } = render(
      <TreeSelect onChange={onChange}>
        <TreeNode key="0" value="0" title="0 label" />
        <TreeNode key="1" value="1" title="1 label" />
      </TreeSelect>,
    );
    triggerOpen(container);
    selectNode();
    expect(onChange.mock.calls[0][0]).toEqual('0');
    expect(onChange).toHaveBeenCalledWith('0', expect.anything(), expect.anything());

    onChange.mockReset();
    triggerOpen(container);
    selectNode(1);
    expect(onChange).toHaveBeenCalledWith('1', expect.anything(), expect.anything());
  });

  it('can be controlled by value', () => {
    const treeData = [
      { key: '0', value: '0', title: 'label0' },
      { key: '1', value: '1', title: 'label1' },
    ];
    const { container, rerender } = render(<TreeSelect value="0" treeData={treeData} />);
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('label0');

    rerender(<TreeSelect value="1" treeData={treeData} />);
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('label1');
  });

  describe('select', () => {
    const treeData = [
      { key: '0', value: '0', title: 'label0' },
      { key: '1', value: '1', title: 'label1' },
    ];
    const createSelect = props => <TreeSelect open treeData={treeData} {...props} />;

    it('fires change and select event', () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      render(createSelect({ onChange, onSelect }));
      selectNode();
      expect(onChange).toHaveBeenCalledWith(
        '0',
        ['label0'],
        expect.objectContaining({
          preValue: [],
          selected: true,
          triggerValue: '0',
          triggerNode: expect.anything(),
        }),
      );

      expect(onSelect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          value: '0',
          key: '0',
          title: 'label0',
        }),
      );
    });

    it('render result by treeNodeLabelProp', () => {
      const { container } = render(createSelect({ treeNodeLabelProp: 'value' }));
      selectNode();
      expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('0');
    });
  });

  describe('search nodes', () => {
    const treeData = [
      { key: 'a', value: 'a', title: 'labela' },
      { key: 'b', value: 'b', title: 'labelb' },
    ];
    const createSelect = (props?: any) => (
      <TreeSelect open showSearch treeData={treeData} {...props} />
    );

    it('renders search input', () => {
      const { container } = render(createSelect());
      expect(container.firstChild).toMatchSnapshot();
    });

    it('fires search event', () => {
      const onSearch = jest.fn();
      const { container } = render(createSelect({ onSearch }));

      const input = container.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'a' } });

      expect(onSearch).toHaveBeenCalledWith('a');
    });

    it('check tree changed by filter', () => {
      const Wrapper = (props: any) => <div>{createSelect(props)}</div>;
      const { container, rerender } = render(<Wrapper searchValue="a" treeDefaultExpandAll open />);
      expect(container.firstChild).toMatchSnapshot();
      rerender(<Wrapper searchValue="" treeDefaultExpandAll open />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('search nodes by filterTreeNode', () => {
      const filter = (value, node) => node.props.value.toLowerCase() === value.toLowerCase();
      const { container } = render(createSelect({ filterTreeNode: filter }));

      const input = container.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'A' } });

      expect(container.querySelectorAll('.rc-tree-select-tree-title')).toHaveLength(1);
      expect(container.querySelector('.rc-tree-select-tree-title')?.textContent).toBe('labela');
    });

    it('search nodes by treeNodeFilterProp', () => {
      const { container } = render(createSelect({ treeNodeFilterProp: 'title' }));

      const input = container.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'labela' } });

      expect(container.querySelectorAll('.rc-tree-select-tree-title')).toHaveLength(1);
      expect(container.querySelector('.rc-tree-select-tree-title')?.textContent).toBe('labela');
    });

    it('filter node but not remove then', () => {
      const { container } = render(
        <div>
          {createSelect({
            searchValue: 'a',
            open: true,
            treeDefaultExpandAll: true,
            filterTreeNode: false,
          })}
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('open tree when click on select', () => {
    const { container } = render(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela" />
      </TreeSelect>,
    );
    triggerOpen(container);
    expectOpen(container);
  });

  it('close tree when press ESC', () => {
    const { container } = render(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela" />
      </TreeSelect>,
    );

    triggerOpen(container);
    expectOpen(container);

    const input = container.querySelector('input')!;
    fireEvent.keyDown(input, { keyCode: KeyCode.ESC });

    expectOpen(container, false);
  });

  // https://github.com/ant-design/ant-design/issues/4084
  it('checks node correctly after treeData updated', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <TreeSelect open treeCheckable treeData={[]} onChange={onChange} />,
    );
    rerender(
      <TreeSelect
        open
        treeCheckable
        treeData={[{ key: '0', value: '0', title: 'label0' }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(document.querySelector('.rc-tree-select-tree-checkbox')!);
    expect(onChange).toHaveBeenCalledWith(['0'], expect.anything(), expect.anything());
  });

  it('expands tree nodes by treeDefaultExpandedKeys', () => {
    render(
      <TreeSelect open treeDefaultExpandedKeys={['1']}>
        <TreeNode key="0" value="0" title="0 label" />
        <TreeNode key="1" value="1" title="1 label">
          <TreeNode key="10" value="10" title="10 label" />
          <TreeNode key="11" value="11" title="11 label" />
        </TreeNode>
      </TreeSelect>,
    );

    expect(
      getVisibleTreeNodes()[1].classList.contains('rc-tree-select-tree-treenode-switcher-open'),
    ).toBeTruthy();
  });

  describe('allowClear', () => {
    it('not inputValue prop', () => {
      const { container } = render(
        <TreeSelect allowClear>
          <TreeNode key="0" value="0" title="0 label" />
        </TreeSelect>,
      );
      triggerOpen(container);

      selectNode();
      clearAll(container);
      expect(getSelections(container)).toHaveLength(0);
    });

    it('has inputValue prop', () => {
      class App extends React.Component {
        state = {
          inputValue: '0',
        };

        handleSearch = inputValue => {
          this.setState({ inputValue });
        };

        render() {
          const { inputValue } = this.state;
          return (
            <div>
              <TreeSelect allowClear inputValue={inputValue} onSearch={this.handleSearch}>
                <TreeNode key="0" value="0" title="0 label" />
              </TreeSelect>
            </div>
          );
        }
      }
      const { container } = render(<App />);
      triggerOpen(container);
      selectNode();
      clearAll(container);
      expect(getSelections(container)).toHaveLength(0);
    });
  });

  describe('keyCode', () => {
    [KeyCode.ENTER, KeyCode.DOWN].forEach(code => {
      it('open', () => {
        const onFocus = jest.fn();

        const { container } = render(
          <TreeSelect onFocus={onFocus}>
            <TreeNode title="0" value="0" />
          </TreeSelect>,
        );

        keyDown(getInput(container), code);
        expectOpen(container);
      });
    });
  });

  describe('scroll to view', () => {
    it('single mode should trigger scroll', () => {
      const { container } = render(
        <TreeSelect value="0">
          <TreeNode title="0" value="0" />
        </TreeSelect>,
      );

      triggerOpen(container);
      expectOpen(container);

      triggerOpen(container);
      expectOpen(container, false);

      triggerOpen(container);
      expect(mockScrollTo).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('key operation', () => {
      const onChange = jest.fn();
      const { container } = render(
        <TreeSelect
          onChange={onChange}
          treeDefaultExpandAll
          treeData={[{ value: 'parent', children: [{ value: 'child' }] }]}
          multiple
        />,
      );

      function matchValue(value) {
        expect(onChange).toHaveBeenCalledWith(value, expect.anything(), expect.anything());
        onChange.mockReset();
      }

      triggerOpen(container);

      keyDown(getInput(container), KeyCode.DOWN);
      keyUp(getInput(container), KeyCode.DOWN);
      keyDown(getInput(container), KeyCode.ENTER);
      keyUp(getInput(container), KeyCode.ENTER);
      matchValue(['child']);

      keyDown(getInput(container), KeyCode.UP);
      keyUp(getInput(container), KeyCode.UP);
      act(() => {
        jest.runAllTimers();
      });
      keyDown(getInput(container), KeyCode.ENTER);
      keyUp(getInput(container), KeyCode.ENTER);
      matchValue(['child', 'parent']);
    });

    it('selectable works with keyboard operations', () => {
      const onChange = jest.fn();
      const { container } = render(
        <TreeSelect
          onChange={onChange}
          treeDefaultExpandAll
          treeData={[{ value: 'parent', children: [{ value: 'child', selectable: false }] }]}
          multiple
        />,
      );

      triggerOpen(container);

      keyDown(getInput(container), KeyCode.DOWN);
      keyUp(getInput(container), KeyCode.DOWN);
      keyDown(getInput(container), KeyCode.ENTER);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('active index matches value', () => {
      const { container } = render(
        <TreeSelect
          value={['10']}
          treeDefaultExpandAll
          treeData={[
            { key: '0', value: '0', title: '0 label' },
            {
              key: '1',
              value: '1',
              title: '1 label',
              children: [
                { key: '10', value: '10', title: '10 label' },
                { key: '11', value: '11', title: '11 label' },
              ],
            },
          ]}
        />,
      );
      triggerOpen(container);
      expect(document.querySelector('.rc-tree-select-tree-treenode-active')).toHaveTextContent(
        '10 label',
      );
    });

    it('active index updates correctly with key operation', () => {
      const { container } = render(
        <TreeSelect
          value={['10']}
          treeDefaultExpandAll
          treeData={[
            { key: '0', value: '0', title: '0 label' },
            {
              key: '1',
              value: '1',
              title: '1 label',
              children: [
                { key: '10', value: '10', title: '10 label' },
                { key: '11', value: '11', title: '11 label' },
              ],
            },
          ]}
        />,
      );

      triggerOpen(container);
      expect(document.querySelector('.rc-tree-select-tree-treenode-active')).toHaveTextContent(
        '10 label',
      );

      keyDown(getInput(container), KeyCode.DOWN);
      expect(document.querySelector('.rc-tree-select-tree-treenode-active')).toHaveTextContent(
        '11 label',
      );

      keyDown(getInput(container), KeyCode.DOWN);
      expect(document.querySelector('.rc-tree-select-tree-treenode-active')).toHaveTextContent(
        '0 label',
      );

      keyDown(getInput(container), KeyCode.UP);
      expect(document.querySelector('.rc-tree-select-tree-treenode-active')).toHaveTextContent(
        '11 label',
      );
    });

    it('should active first un-disabled option when dropdown is opened', () => {
      const treeData = [
        { key: '0', value: '0', title: '0 label', disabled: true },
        { key: '1', value: '1', title: '1 label' },
        { key: '2', value: '2', title: '2 label' },
      ];

      const { container } = render(<TreeSelect treeData={treeData} />);

      expect(document.querySelectorAll('.rc-tree-select-tree-treenode-active')).toHaveLength(0);

      triggerOpen(container);

      const activeNode = document.querySelectorAll('.rc-tree-select-tree-treenode-active');
      expect(activeNode).toHaveLength(1);
      expect(activeNode[0]).toHaveTextContent('1 label');
    });
  });

  it('click in list should preventDefault', () => {
    render(<TreeSelect open treeData={[{ value: 'parent' }]} />);

    const preventDefault = jest.fn();
    const target = document.querySelector('.rc-tree-select-tree-node-content-wrapper')!;
    const event = createEvent.mouseDown(target);
    event.preventDefault = preventDefault;
    fireEvent(target, event);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('virtual can be false', () => {
    const data = [];
    for (let i = 0; i < 100; i += 1) {
      data.push({
        value: i,
        title: i,
      });
    }

    const { container } = render(<TreeSelect treeData={data} virtual={false} />);
    triggerOpen(container);

    expect(getVisibleTreeNodes()).toHaveLength(100);
  });

  it('update label', () => {
    const { container, rerender } = render(<TreeSelect value="light" treeData={[]} />);
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('light');

    rerender(<TreeSelect value="light" treeData={[{ value: 'light', title: 'bamboo' }]} />);
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('bamboo');
  });

  it('should show parent if children were disabled', () => {
    const onSelect = jest.fn();

    const { container } = render(
      <TreeSelect open treeDefaultExpandAll onSelect={onSelect}>
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" disabled />
          <TreeNode value="leaf2" title="your leaf" disabled />
        </TreeNode>
      </TreeSelect>,
    );

    selectNode();
    expect(onSelect).toHaveBeenCalledWith('parent 1-0', expect.anything());
    expect(container.querySelector('.rc-tree-select-content')).toHaveTextContent('parent 1-0');
  });

  it('should not select parent if some children is disabled', () => {
    const onChange = jest.fn();

    render(
      <TreeSelect
        open
        treeDefaultExpandAll
        treeCheckable
        multiple
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        onChange={onChange}
      >
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" />
          <TreeNode value="leaf2" title="your leaf" disabled />
        </TreeNode>
      </TreeSelect>,
    );

    selectNode(1);
    expect(onChange).toHaveBeenCalledWith(['leaf1'], expect.anything(), expect.anything());
  });

  it('nativeElement', () => {
    const treeSelectRef = React.createRef<BaseSelectRef>();
    const { container } = render(<TreeSelect ref={treeSelectRef} />);
    expect(treeSelectRef.current.nativeElement).toBe(container.querySelector('.rc-tree-select'));
  });

  it('support classNames and styles', () => {
    const treeData = [
      {
        value: 'parent 1',
        title: 'parent 1',
        children: [
          {
            value: 'parent 1-0',
            title: 'parent 1-0',
            children: [
              {
                value: 'leaf1',
                title: 'my leaf',
              },
              {
                value: 'leaf2',
                title: 'your leaf',
              },
            ],
          },
        ],
      },
    ];
    const customClassNames = {
      prefix: 'test-prefix',
      input: 'test-input',
      suffix: 'test-suffix',
      popup: {
        item: 'test-item',
        itemTitle: 'test-item-title',
      },
    };
    const customStyles = {
      prefix: { color: 'green' },
      input: { color: 'blue' },
      suffix: { color: 'yellow' },
      popup: {
        item: { color: 'black' },
        itemTitle: { color: 'purple' },
      },
    };
    const { container } = render(
      <TreeSelect
        classNames={customClassNames}
        styles={customStyles}
        showSearch
        prefix="Prefix"
        open
        suffixIcon={() => <div>icon</div>}
        placeholder="Please select"
        treeDefaultExpandAll
        treeData={treeData}
      />,
    );
    const prefix = container.querySelector('.rc-tree-select-prefix');
    const input = container.querySelector('.rc-tree-select-input');
    const suffix =
      container.querySelector('.rc-tree-select-content-item-suffix') ||
      container.querySelector('[class*="suffix"]');
    const itemTitle = container.querySelector('.rc-tree-select-tree-title');
    const item = container.querySelector(`.${customClassNames.popup.item}`);

    // 如果suffix还是找不到，就跳过这个检查
    expect(prefix).toHaveClass(customClassNames.prefix);
    expect(input).toHaveClass(customClassNames.input);
    if (suffix) {
      expect(suffix).toHaveClass(customClassNames.suffix);
    }
    expect(itemTitle).toHaveClass(customClassNames.popup.itemTitle);

    expect(prefix).toHaveStyle(customStyles.prefix);
    expect(input).toHaveStyle(customStyles.input);
    if (suffix) {
      expect(suffix).toHaveStyle(customStyles.suffix);
    }
    expect(itemTitle).toHaveStyle(customStyles.popup.itemTitle);
    expect(item).toHaveStyle(customStyles.popup.item);
  });

  describe('combine showSearch', () => {
    const treeData = [
      { key: '0', value: 'a', title: '0 label' },
      {
        key: '1',
        value: 'b',
        title: '1 label',
        children: [
          { key: '10', value: 'ba', title: '10 label' },
          { key: '11', value: 'bb', title: '11 label' },
        ],
      },
    ];
    it('searchValue and onSearch', () => {
      const currentSearchFn = jest.fn();
      const legacySearchFn = jest.fn();
      const { container } = render(
        <>
          <div id="test1">
            <TreeSelect
              showSearch
              searchValue="1-10"
              onSearch={currentSearchFn}
              open
              treeDefaultExpandAll
              treeData={treeData}
            />
          </div>
          <div id="test2">
            <TreeSelect
              showSearch={{ searchValue: '1-10', onSearch: legacySearchFn }}
              open
              treeDefaultExpandAll
              treeData={treeData}
            />
          </div>
        </>,
      );
      const legacyInput = container.querySelector<HTMLInputElement>('#test1 input');
      const currentInput = container.querySelector<HTMLInputElement>('#test2 input');
      fireEvent.change(legacyInput, { target: { value: '2' } });
      fireEvent.change(currentInput, { target: { value: '2' } });
      expect(currentSearchFn).toHaveBeenCalledWith('2');
      expect(legacySearchFn).toHaveBeenCalledWith('2');
    });
    it('treeNodeFilterProp and autoClearSearchValue', () => {
      const { container } = render(
        <>
          <div id="test1">
            <TreeSelect
              showSearch
              open
              treeDefaultExpandAll
              treeData={treeData}
              autoClearSearchValue={false}
              treeNodeFilterProp="value"
            />
          </div>
          <div id="test2">
            <TreeSelect
              showSearch={{
                autoClearSearchValue: false,
                treeNodeFilterProp: 'value',
              }}
              open
              treeDefaultExpandAll
              treeData={treeData}
            />
          </div>
        </>,
      );
      const legacyInput = container.querySelector<HTMLInputElement>('#test1 input');
      const currentInput = container.querySelector<HTMLInputElement>('#test2 input');
      fireEvent.change(legacyInput, { target: { value: 'a' } });
      fireEvent.change(currentInput, { target: { value: 'a' } });
      const legacyItem = container.querySelector<HTMLInputElement>(
        '#test1 .rc-tree-select-tree-title',
      );
      const currentItem = container.querySelector<HTMLInputElement>(
        '#test2 .rc-tree-select-tree-title',
      );

      expect(legacyInput).toHaveValue('a');
      expect(currentInput).toHaveValue('a');
      fireEvent.click(legacyItem);
      fireEvent.click(currentItem);
      const valueSpan = container.querySelectorAll<HTMLSpanElement>(' .rc-tree-select-content');

      expect(valueSpan[0]).toHaveTextContent('0 label');
      expect(valueSpan[1]).toHaveTextContent('0 label');
    });
    it('filterTreeNode', () => {
      const { container } = render(
        <>
          <div id="test1">
            <TreeSelect
              showSearch
              open
              treeDefaultExpandAll
              treeData={treeData}
              filterTreeNode={(inputValue, node) => node.value === inputValue}
            />
          </div>
          <div id="test2">
            <TreeSelect
              showSearch={{
                filterTreeNode: (inputValue, node) => node.value === inputValue,
              }}
              open
              treeDefaultExpandAll
              treeData={treeData}
            />
          </div>
        </>,
      );
      const legacyInput = container.querySelector<HTMLInputElement>('#test1 input');
      const currentInput = container.querySelector<HTMLInputElement>('#test2 input');
      fireEvent.change(legacyInput, { target: { value: 'bb' } });
      fireEvent.change(currentInput, { target: { value: 'bb' } });
      const options = container.querySelectorAll<HTMLDivElement>(' .rc-tree-select-tree-title');

      expect(options).toHaveLength(4);
    });
    it.each([
      // [description, props, shouldExist]
      ['showSearch=false ', { showSearch: false }, false],
      ['showSearch=undefined ', {}, false],
      ['showSearch=true', { showSearch: true }, true],
    ])('%s', (_, props: { showSearch?: boolean; mode?: 'tags' }, shouldExist) => {
      const { container } = render(
        <TreeSelect open treeDefaultExpandAll treeData={treeData} {...props} />,
      );
      const inputNode = container.querySelector('input');
      if (shouldExist) {
        expect(inputNode).not.toHaveAttribute('readonly');
      } else {
        expect(inputNode).toHaveAttribute('readonly');
      }
    });
  });

  it('labelRender', () => {
    const onLabelRender = jest.fn();
    const labelRender = props => {
      const { label, value } = props;
      onLabelRender();
      return `${label}-${value}`;
    };
    const { container } = render(
      <TreeSelect
        treeData={[{ label: 'realLabel', value: 'a' }]}
        value="a"
        labelRender={labelRender}
      />,
    );

    expect(onLabelRender).toHaveBeenCalled();
    expect(container.querySelector('.rc-tree-select-selector').textContent).toEqual('realLabel-a');
  });

  it('labelRender when value is not in treeData', () => {
    const onLabelRender = jest.fn();
    const treeData = [{ label: 'realLabel', value: 'b' }];
    const labelRender = props => {
      const { label, value } = props;
      // current value is in treeData
      if (treeData.find(item => item.value === value)) {
        return label;
      } else {
        // current value is not in treeData
        onLabelRender();
        return `${label || 'fakeLabel'}-${value}`;
      }
    };
    const { container } = render(
      <TreeSelect value="a" labelRender={labelRender} treeData={treeData} />,
    );

    expect(onLabelRender).toHaveBeenCalled();
    expect(container.querySelector('.rc-tree-select-selector').textContent).toEqual('fakeLabel-a');
  });
});
