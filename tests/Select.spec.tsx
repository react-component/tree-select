import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';
import { selectNode } from './util';
import type { BaseSelectRef } from 'rc-select';

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
      const wrapper = mount(
        <TreeSelect
          dropdownClassName="awesome"
          dropdownStyle={{ width: 300 }}
          multiple
          treeCheckable
          treeDefaultExpandAll
          treeData={treeData}
        />,
      );
      expect(wrapper.render()).toMatchSnapshot();
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
    const wrapper = mount(
      <TreeSelect defaultValue="0" treeData={[{ key: '0', value: '0', title: 'label0' }]} />,
    );
    expect(wrapper.getSelection(0).text()).toEqual('label0');
  });

  it('sets default value(disabled)', () => {
    const wrapper = mount(
      <TreeSelect
        defaultValue="0"
        treeData={[{ key: '0', value: '0', title: 'label0', disabled: true }]}
      />,
    );
    expect(wrapper.getSelection(0).text()).toEqual('label0');
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
    const wrapper = mount(<TreeSelect value="0" treeData={treeData} />);
    expect(wrapper.getSelection(0).text()).toEqual('label0');

    wrapper.setProps({ value: '1' });
    expect(wrapper.getSelection(0).text()).toEqual('label1');
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
      const wrapper = mount(createSelect({ treeNodeLabelProp: 'value' }));
      wrapper.selectNode();
      expect(wrapper.getSelection(0).text()).toEqual('0');
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
      const wrapper = mount(createSelect({ onSearch }));
      wrapper.search('a');
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
      const wrapper = mount(createSelect({ filterTreeNode: filter }));
      wrapper.search('A');
      expect(wrapper.find('TreeNode')).toHaveLength(1);
      expect(wrapper.find('TreeNode').prop('value')).toBe('a');
    });

    it('search nodes by treeNodeFilterProp', () => {
      const wrapper = mount(createSelect({ treeNodeFilterProp: 'title' }));
      wrapper.search('labela');
      expect(wrapper.find('TreeNode')).toHaveLength(1);
      expect(wrapper.find('TreeNode').prop('value')).toBe('a');
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
    const wrapper = mount(
      <TreeSelect>
        <TreeNode key="a" value="a" title="labela" />
      </TreeSelect>,
    );
    wrapper.openSelect();
    wrapper.find('input').first().simulate('keyDown', { which: KeyCode.ESC });
    expect(wrapper.isOpen()).toBeFalsy();
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
      const wrapper = mount(
        <TreeSelect value="0">
          <TreeNode title="0" value="0" />
        </TreeSelect>,
      );

      wrapper.openSelect();
      wrapper.openSelect();
      expect(wrapper.isOpen()).toBeFalsy();

      wrapper.openSelect();
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
      matchValue(['parent']);

      keyDown(KeyCode.UP);
      keyUp(KeyCode.UP);
      keyDown(KeyCode.ENTER);
      keyUp(KeyCode.ENTER);
      matchValue(['parent', 'child']);
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
      expect(onChange).toHaveBeenCalledWith(['parent'], expect.anything(), expect.anything());
      onChange.mockReset();

      keyDown(KeyCode.UP);
      keyDown(KeyCode.ENTER);
      expect(onChange).not.toHaveBeenCalled();
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
    const wrapper = mount(<TreeSelect value="light" treeData={[]} />);
    expect(wrapper.find('.rc-tree-select-selection-item').text()).toEqual('light');

    wrapper.setProps({
      treeData: [{ value: 'light', title: 'bamboo' }],
    });
    wrapper.update();
    expect(wrapper.find('.rc-tree-select-selection-item').text()).toEqual('bamboo');
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
    expect(container.querySelector('.rc-tree-select-selector').textContent).toBe('parent 1-0');
  });

  it('should not add new tag when key enter is pressed if nothing is active', () => {
    const onSelect = jest.fn();

    const wrapper = mount(
      <TreeSelect open treeDefaultExpandAll multiple onSelect={onSelect}>
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" disabled />
          <TreeNode value="leaf2" title="your leaf" disabled />
        </TreeNode>
      </TreeSelect>,
    );

    wrapper.find('input').first().simulate('keydown', { which: KeyCode.ENTER });
    expect(onSelect).not.toHaveBeenCalled();
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
});
