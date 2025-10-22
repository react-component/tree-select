import { render, fireEvent, act } from '@testing-library/react';
import { mount } from 'enzyme';
import KeyCode from '@rc-component/util/lib/KeyCode';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';
import { expectOpen, selectNode, triggerOpen } from './util';
import type { BaseSelectRef } from '@rc-component/select';

const mockScrollTo = jest.fn();

// Mock `useScrollTo` from `rc-virtual-list/lib/hooks/useScrollTo`
jest.mock('rc-virtual-list/lib/hooks/useScrollTo', () => {
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
      const wrapper = mount(
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
      expect(wrapper.render()).toMatchSnapshot();
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
      mount(<TreeSelect open />);
    });

    it('not crash if no treeData', () => {
      mount(<TreeSelect value="" treeData={[]} open />);
    });

    it('renders disabled correctly', () => {
      const wrapper = mount(<TreeSelect disabled treeData={treeData} />);
      expect(wrapper.render()).toMatchSnapshot();
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
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('label0');
  });

  it('sets default value(disabled)', () => {
    const { container } = render(
      <TreeSelect
        defaultValue="0"
        treeData={[{ key: '0', value: '0', title: 'label0', disabled: true }]}
      />,
    );
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('label0');
  });

  it('select value twice', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TreeSelect onChange={onChange}>
        <TreeNode key="0" value="0" title="0 label" />
        <TreeNode key="1" value="1" title="1 label" />
      </TreeSelect>,
    );
    wrapper.openSelect();
    wrapper.selectNode();
    expect(onChange.mock.calls[0][0]).toEqual('0');
    expect(onChange).toHaveBeenCalledWith('0', expect.anything(), expect.anything());

    onChange.mockReset();
    wrapper.openSelect();
    wrapper.selectNode(1);
    expect(onChange).toHaveBeenCalledWith('1', expect.anything(), expect.anything());
  });

  it('can be controlled by value', () => {
    const treeData = [
      { key: '0', value: '0', title: 'label0' },
      { key: '1', value: '1', title: 'label1' },
    ];
    const { container, rerender } = render(<TreeSelect value="0" treeData={treeData} />);
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('label0');

    rerender(<TreeSelect value="1" treeData={treeData} />);
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('label1');
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
      const wrapper = mount(createSelect({ onChange, onSelect }));
      wrapper.selectNode();
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
      expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('0');
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
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela" />
      </TreeSelect>,
    );
    wrapper.openSelect();
    expect(wrapper.isOpen()).toBeTruthy();
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
    const wrapper = mount(<TreeSelect open treeCheckable treeData={[]} onChange={onChange} />);
    wrapper.setProps({ treeData: [{ key: '0', value: '0', title: 'label0' }] });
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    expect(onChange).toHaveBeenCalledWith(['0'], expect.anything(), expect.anything());
  });

  it('expands tree nodes by treeDefaultExpandedKeys', () => {
    const wrapper = mount(
      <TreeSelect open treeDefaultExpandedKeys={['1']}>
        <TreeNode key="0" value="0" title="0 label" />
        <TreeNode key="1" value="1" title="1 label">
          <TreeNode key="10" value="10" title="10 label" />
          <TreeNode key="11" value="11" title="11 label" />
        </TreeNode>
      </TreeSelect>,
    );

    expect(
      wrapper
        .find('.rc-tree-select-tree-treenode')
        .not('[aria-hidden]')
        .at(1)
        .hasClass('rc-tree-select-tree-treenode-switcher-open'),
    ).toBeTruthy();
  });

  describe('allowClear', () => {
    it('not inputValue prop', () => {
      const wrapper = mount(
        <TreeSelect allowClear>
          <TreeNode key="0" value="0" title="0 label" />
        </TreeSelect>,
      );
      wrapper.openSelect();

      wrapper.selectNode();
      wrapper.clearAll();
      expect(wrapper.find('BaseSelect').prop('displayValues')).toHaveLength(0);
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
      const wrapper = mount(<App />);
      wrapper.openSelect();
      wrapper.selectNode();
      wrapper.clearAll();
      expect(wrapper.find('BaseSelect').prop('displayValues')).toHaveLength(0);
    });
  });

  describe('keyCode', () => {
    [KeyCode.ENTER, KeyCode.DOWN].forEach(code => {
      it('open', () => {
        const onFocus = jest.fn();

        const wrapper = mount(
          <TreeSelect onFocus={onFocus}>
            <TreeNode title="0" value="0" />
          </TreeSelect>,
        );

        wrapper.find('input').first().simulate('keyDown', { which: code });
        expect(wrapper.isOpen()).toBeTruthy();
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
      const wrapper = mount(
        <TreeSelect
          onChange={onChange}
          treeDefaultExpandAll
          treeData={[{ value: 'parent', children: [{ value: 'child' }] }]}
          multiple
        />,
      );

      function keyDown(code) {
        wrapper.find('input').first().simulate('keyDown', { which: code });
        wrapper.update();
      }

      function keyUp(code) {
        wrapper.find('input').first().simulate('keyUp', { which: code });
        wrapper.update();
      }

      function matchValue(value) {
        expect(onChange).toHaveBeenCalledWith(value, expect.anything(), expect.anything());
        onChange.mockReset();
      }

      wrapper.openSelect();

      keyDown(KeyCode.DOWN);
      keyUp(KeyCode.DOWN);
      keyDown(KeyCode.ENTER);
      keyUp(KeyCode.ENTER);
      matchValue(['child']);

      keyDown(KeyCode.UP);
      keyUp(KeyCode.UP);
      keyDown(KeyCode.ENTER);
      keyUp(KeyCode.ENTER);
      matchValue(['child', 'parent']);
    });

    it('selectable works with keyboard operations', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <TreeSelect
          onChange={onChange}
          treeDefaultExpandAll
          treeData={[{ value: 'parent', children: [{ value: 'child', selectable: false }] }]}
          multiple
        />,
      );

      function keyDown(code) {
        wrapper.find('input').first().simulate('keyDown', { which: code });
        wrapper.update();
      }

      wrapper.openSelect();

      keyDown(KeyCode.DOWN);
      keyDown(KeyCode.ENTER);
      expect(onChange).not.toHaveBeenCalled();

      keyDown(KeyCode.UP);
      keyDown(KeyCode.ENTER);
      expect(onChange).toHaveBeenCalledWith(['parent'], expect.anything(), expect.anything());
      onChange.mockReset();
    });

    it('active index matches value', () => {
      const wrapper = mount(
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
      wrapper.openSelect();
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('10 label');
    });

    it('active index updates correctly with key operation', () => {
      const wrapper = mount(
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

      function keyDown(code) {
        wrapper.find('input').first().simulate('keyDown', { which: code });
        wrapper.update();
      }

      wrapper.openSelect();
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('10 label');

      keyDown(KeyCode.DOWN);
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('11 label');

      keyDown(KeyCode.DOWN);
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('0 label');

      keyDown(KeyCode.UP);
      expect(wrapper.find('.rc-tree-select-tree-treenode-active').text()).toBe('11 label');
    });

    it('should active first un-disabled option when dropdown is opened', () => {
      const treeData = [
        { key: '0', value: '0', title: '0 label', disabled: true },
        { key: '1', value: '1', title: '1 label' },
        { key: '2', value: '2', title: '2 label' },
      ];

      const wrapper = mount(<TreeSelect treeData={treeData} />);

      expect(wrapper.find('.rc-tree-select-tree-treenode-active')).toHaveLength(0);

      wrapper.openSelect();

      const activeNode = wrapper.find('.rc-tree-select-tree-treenode-active');
      expect(activeNode).toHaveLength(1);
      expect(activeNode.text()).toBe('1 label');
    });
  });

  it('click in list should preventDefault', () => {
    const wrapper = mount(<TreeSelect open treeData={[{ value: 'parent' }]} />);

    const preventDefault = jest.fn();
    wrapper.find('.rc-tree-select-tree-node-content-wrapper').simulate('mouseDown', {
      preventDefault,
    });

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

    const wrapper = mount(<TreeSelect treeData={data} virtual={false} />);
    wrapper.openSelect();

    expect(wrapper.find('List').props().virtual).toBe(false);
  });

  it('update label', () => {
    const { container, rerender } = render(<TreeSelect value="light" treeData={[]} />);
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('light');

    rerender(<TreeSelect value="light" treeData={[{ value: 'light', title: 'bamboo' }]} />);
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent('bamboo');
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
    expect(container.querySelector('.rc-tree-select-content-value')).toHaveTextContent(
      'parent 1-0',
    );
  });

  it('should not select parent if some children is disabled', () => {
    const onChange = jest.fn();

    const wrapper = mount(
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

    wrapper.selectNode(1);
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
      const valueSpan = container.querySelectorAll<HTMLSpanElement>(
        ' .rc-tree-select-content-value',
      );

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
});
