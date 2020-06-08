/* eslint-disable no-undef react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';

describe('TreeSelect.basic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  focusTest('single');

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
      const wrapper = mount(
        <TreeSelect treeDefaultExpandAll open>
          <TreeNode key="0" value="0" title="0 label" />
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label" />
            <TreeNode key="11" value="11" title="11 label" />
          </TreeNode>
        </TreeSelect>,
      );
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('renders TreeNode correctly with falsy child', () => {
      const wrapper = mount(
        <TreeSelect treeDefaultExpandAll open>
          <TreeNode key="0" value="0" title="0 label" />
          <TreeNode key="1" value="1" title="1 label">
            <TreeNode key="10" value="10" title="10 label" />
            <TreeNode key="11" value="11" title="11 label" />
            {null}
          </TreeNode>
        </TreeSelect>,
      );
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('renders treeDataSimpleMode correctly', () => {
      const wrapper = mount(
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
      expect(wrapper.render()).toMatchSnapshot();
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
    const createSelect = props => <TreeSelect open showSearch treeData={treeData} {...props} />;

    it('renders search input', () => {
      const wrapper = mount(createSelect());
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('fires search event', () => {
      const onSearch = jest.fn();
      const wrapper = mount(createSelect({ onSearch }));
      wrapper.search('a');
      expect(onSearch).toHaveBeenCalledWith('a');
    });

    it('check tree changed by filter', () => {
      const Wrapper = props => <div>{createSelect(props)}</div>;
      const wrapper = mount(<Wrapper searchValue="a" treeDefaultExpandAll open />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.setProps({ searchValue: '' });
      expect(wrapper.render()).toMatchSnapshot();
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
      const wrapper = mount(
        <div>
          {createSelect({
            searchValue: 'a',
            open: true,
            treeDefaultExpandAll: true,
            filterTreeNode: false,
          })}
        </div>,
      );
      expect(wrapper.render()).toMatchSnapshot();
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
    wrapper
      .find('input')
      .first()
      .simulate('keyDown', { which: KeyCode.ESC });
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
      expect(wrapper.find('Select').props().value).toHaveLength(0);
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
      expect(wrapper.find('Select').props().value).toHaveLength(0);
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

        wrapper
          .find('input')
          .first()
          .simulate('keyDown', { which: code });
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

      const scrollTo = jest.fn();
      wrapper.find('List').instance().scrollTo = scrollTo;

      wrapper.openSelect();
      expect(scrollTo).toHaveBeenCalled();
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
        wrapper
          .find('input')
          .first()
          .simulate('keyDown', { which: code });
        wrapper.update();
      }

      function keyUp(code) {
        wrapper
          .find('input')
          .first()
          .simulate('keyUp', { which: code });
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
});
