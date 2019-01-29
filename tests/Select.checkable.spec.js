/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect, { SHOW_PARENT, SHOW_ALL, TreeNode } from '../src';
import { resetAriaId } from '../src/util';

describe('TreeSelect.checkable', () => {
  beforeEach(() => {
    resetAriaId();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('allow clear when controlled', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        title: 'label0',
        children: [
          {
            key: '1',
            value: '1',
            title: 'label1',
          },
        ],
      },
    ];

    class App extends React.Component {
      state = {
        value: [],
      };

      handleChange = value => {
        this.setState({ value });
      };

      render() {
        const { value } = this.state;
        return (
          <TreeSelect
            treeData={treeData}
            treeCheckable
            allowClear
            showCheckedStrategy={SHOW_PARENT}
            value={value}
            onChange={this.handleChange}
          />
        );
      }
    }
    const wrapper = mount(<App />);
    // open
    wrapper.openSelect();
    // select
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    // clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
  });

  // https://github.com/ant-design/ant-design/issues/6731
  it('clear all should clear cache at the same time', () => {
    const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            title: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            title: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            title: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ];

    class App extends React.Component {
      state = {
        value: ['0-0-0'],
        disabled: false,
      };

      handleChange = value => {
        this.setState({ value });
      };

      switch = checked => {
        this.setState({ disabled: checked });
      };

      render() {
        const { value, disabled } = this.state;
        return (
          <div>
            <TreeSelect
              treeData={treeData}
              treeCheckable
              allowClear
              multiple
              showCheckedStrategy={SHOW_PARENT}
              treeDefaultExpandAll
              value={value}
              onChange={this.handleChange}
              disabled={disabled}
            />
            <input type="checkbox" onChange={e => this.switch(e.target.checked)} id="checkbox" />{' '}
            禁用
          </div>
        );
      }
    }
    const wrapper = mount(<App />);
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(1);
    // open
    wrapper.openSelect();
    // select
    wrapper
      .find('.rc-tree-select-tree-checkbox')
      .at(2)
      .simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(2);
    // clear
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
    // disabled
    wrapper.find('#checkbox').simulate('change', { target: { checked: true } });
    expect(wrapper.find('.rc-tree-select-selection__choice')).toHaveLength(0);
  });

  // Fix https://github.com/ant-design/ant-design/issues/7312#issuecomment-324865971
  it('should be checkable when treeCheckStrictly is true', () => {
    const treeData = [
      { title: '1-1', value: '1-1', children: [] },
      { title: '1-2', value: '1-2', children: [] },
      {
        title: '1-3',
        value: '1-3',
        children: [
          { title: '2-1', value: '2-1', children: [] },
          { title: '2-2', value: '2-2', children: [] },
        ],
      },
    ];
    const handleChange = jest.fn();
    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        treeDefaultExpandAll
        multiple
        onChange={handleChange}
      />,
    );
    // open
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    // select
    wrapper
      .find('.rc-tree-select-tree-checkbox')
      .at(0)
      .simulate('click');
    expect(handleChange).toBeCalled();
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(1);
    expect(
      wrapper
        .find('.rc-tree-select-selection__choice__content')
        .at(0)
        .text(),
    ).toBe('1-1');
  });

  // Fix https://github.com/ant-design/ant-design/issues/8581
  it('Label should be click when treeCheckable is true', () => {
    const treeData = [
      { title: '1-1', value: '1-1', children: [] },
      { title: '1-2', value: '1-2', children: [] },
      {
        title: '1-3',
        value: '1-3',
        children: [
          { title: '2-1', value: '2-1', children: [] },
          { title: '2-2', value: '2-2', children: [] },
        ],
      },
    ];
    const handleChange = jest.fn();
    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        treeDefaultExpandAll
        multiple
        onChange={handleChange}
      />,
    );
    // open
    wrapper.find('.rc-tree-select').simulate('click');
    jest.runAllTimers();
    // select
    wrapper
      .find('.rc-tree-select-tree-node-content-wrapper')
      .at(0)
      .simulate('click');
    expect(handleChange).toBeCalled();
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(1);
    expect(
      wrapper
        .find('.rc-tree-select-selection__choice__content')
        .at(0)
        .text(),
    ).toBe('1-1');
    // clear
    wrapper
      .find('.rc-tree-select-tree-node-content-wrapper')
      .at(0)
      .simulate('click');
    expect(wrapper.find('.rc-tree-select-selection__choice__content').length).toBe(0);
  });

  it('clear selected value and input value', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        title: 'label0',
      },
    ];

    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeDefaultExpandAll
        allowClear
        showCheckedStrategy={SHOW_PARENT}
      />,
    );
    wrapper.openSelect();
    wrapper
      .find('.rc-tree-select-tree-checkbox')
      .at(0)
      .simulate('click');
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('.rc-tree-select-selection__clear').simulate('click');
    expect(wrapper.state().valueList).toEqual([]);
    expect(wrapper.state().searchValue).toBe('');
  });

  describe('uncheck', () => {
    const createSelect = props =>
      mount(
        <div>
          <TreeSelect
            defaultValue={['0']}
            showCheckedStrategy={SHOW_ALL}
            treeCheckable
            treeDefaultExpandAll
            open
            {...props}
          >
            <TreeNode title="0" value="0">
              <TreeNode title="0-0" value="0-0">
                <TreeNode title="0-0-0" value="0-0-0" />
              </TreeNode>
            </TreeNode>
          </TreeSelect>
        </div>,
      );

    describe('remove by selector', () => {
      it('not treeCheckStrictly', () => {
        const wrapper = createSelect();
        expect(wrapper.render()).toMatchSnapshot();

        wrapper
          .find('.rc-tree-select-selection__choice__remove')
          .at(1)
          .simulate('click');
        expect(wrapper.render()).toMatchSnapshot();
      });

      it('treeCheckStrictly', () => {
        const val = value => ({ label: value, value });
        const onChange = jest.fn();
        const wrapper = createSelect({
          treeCheckStrictly: true,
          defaultValue: [val('0'), val('0-0'), val('0-0-0')],
          onChange,
        });
        wrapper
          .find('.rc-tree-select-selection__choice__remove')
          .at(1)
          .simulate('click');

        expect(onChange.mock.calls[0][0]).toEqual([
          { label: '0', value: '0' },
          { label: '0-0-0', value: '0-0-0' },
        ]);
        expect(onChange.mock.calls[0][1]).toEqual(null);

        const getProps = index => {
          const node = onChange.mock.calls[0][2].allCheckedNodes[index];
          return {
            title: node.props.title,
            value: node.props.value,
          };
        };
        expect(getProps(0)).toEqual({ title: '0', value: '0' });
        expect(getProps(1)).toEqual({ title: '0-0-0', value: '0-0-0' });
      });
    });

    it('remove by tree check', () => {
      const wrapper = createSelect({ searchValue: '0' });
      expect(wrapper.render()).toMatchSnapshot();

      wrapper
        .find('.rc-tree-select-tree-checkbox')
        .at(1)
        .simulate('click');
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('check in filter', () => {
      const treeData = [
        {
          key: 'P001',
          title: 'P001',
          value: 'P001',
          children: [
            {
              key: '0020',
              title: '0020',
              value: '0020',
              children: [{ key: '9459', title: '9459', value: '9459' }],
            },
          ],
        },
        {
          key: 'P002',
          title: 'P002',
          value: 'P002',
          children: [
            {
              key: '0021',
              title: '0021',
              value: '0021',
              children: [{ key: '9458', title: '9458', value: '9458' }],
            },
          ],
        },
      ];

      const wrapper = mount(<TreeSelect treeCheckable treeData={treeData} open />);

      wrapper.find('.rc-tree-select-search__field').simulate('change', { target: { value: '58' } });
      wrapper
        .find(TreeNode)
        .at(2)
        .find('.rc-tree-select-tree-checkbox')
        .simulate('click');
      expect(wrapper.state().valueList.length).toBe(3);

      wrapper.find('.rc-tree-select-search__field').simulate('change', { target: { value: '59' } });
      wrapper
        .find(TreeNode)
        .at(2)
        .find('.rc-tree-select-tree-checkbox')
        .simulate('click');
      expect(wrapper.state().valueList.length).toBe(6);
    });
  });

  // https://github.com/ant-design/ant-design/issues/11561
  it('remove in filtered tree', () => {
    const onChange = jest.fn();

    const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            title: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            title: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            title: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ];

    const wrapper = mount(
      <TreeSelect
        treeCheckable
        treeData={treeData}
        onChange={onChange}
        showCheckedStrategy={SHOW_PARENT}
        defaultValue={['0-0', '0-1-0', '0-1-2']}
        open
      />,
    );

    wrapper.find('.rc-tree-select-search__field').simulate('change', { target: { value: '0-0' } });
    wrapper
      .find('.rc-tree-select-tree-checkbox')
      .at(0)
      .simulate('click');
    const keyList = onChange.mock.calls[0][0];

    expect(keyList.sort()).toEqual(['0-1-0', '0-1-2'].sort());
  });

  // https://github.com/ant-design/ant-design/issues/13328
  describe('update half checked status', () => {
    const treeData = [
      {
        value: '0-0',
        key: '0-0',
        children: [
          {
            value: '0-0-0',
            key: '0-0-0',
          },
          {
            value: '0-0-1',
            key: '0-0-1',
          },
        ],
      },
    ];

    it('uncontrolled', () => {
      const onChange = jest.fn();

      const wrapper = mount(
        <TreeSelect
          treeCheckable
          treeData={treeData}
          open
          autoClearSearchValue={false}
          onChange={onChange}
        />,
      );

      wrapper
        .find('.rc-tree-select-search__field')
        .simulate('change', { target: { value: '0-0-1' } });
      wrapper
        .find('.rc-tree-select-tree-checkbox')
        .at(1)
        .simulate('click');

      expect(onChange.mock.calls[0][0]).toEqual(['0-0-1']);
      expect(
        wrapper
          .find('.rc-tree-select-tree-checkbox')
          .at(0)
          .hasClass('rc-tree-select-tree-checkbox-indeterminate'),
      ).toBe(true);
    });

    it('controlled', () => {
      const onChange = jest.fn();

      class Test extends React.Component {
        state = {
          value: [],
        };

        onChange = value => {
          this.setState({ value });
          expect(value).toEqual(['0-0-1']);
          onChange();
        };

        render() {
          const { value } = this.state;
          return (
            <TreeSelect
              value={value}
              onChange={this.onChange}
              treeCheckable
              treeData={treeData}
              open
              autoClearSearchValue={false}
            />
          );
        }
      }

      const wrapper = mount(<Test />);

      wrapper
        .find('.rc-tree-select-search__field')
        .simulate('change', { target: { value: '0-0-1' } });
      wrapper
        .find('.rc-tree-select-tree-checkbox')
        .at(1)
        .simulate('click');

      expect(onChange).toBeCalled();

      expect(
        wrapper
          .find('.rc-tree-select-tree-checkbox')
          .at(0)
          .hasClass('rc-tree-select-tree-checkbox-indeterminate'),
      ).toBe(true);
    });
  });

  it('labelInValue', () => {
    const wrapper = mount(
      <TreeSelect checkable labelInValue value={[{ value: '0-0' }]}>
        <TreeNode key="0-0" value="0-0" title="0-0">
          <TreeNode key="0-0-0" value="0-0-0" title="0-0-0" />
        </TreeNode>
      </TreeSelect>,
    );

    expect(wrapper.state().selectorValueList).toEqual([
      {
        label: '0-0',
        value: '0-0',
      },
    ]);
  });

  it('extra.allCheckedNodes', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <TreeSelect open multiple treeCheckable onChange={onChange}>
        <TreeNode key="0-0" value="0-0" title="0-0" />
      </TreeSelect>,
    );

    // Just click
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    expect(onChange.mock.calls[0][2].allCheckedNodes).toEqual([
      expect.objectContaining({
        pos: '0-0',
      }),
    ]);

    wrapper.find('.rc-tree-select-selection__choice__remove').simulate('click');
    onChange.mockReset();

    // By search
    wrapper.find('input').simulate('change', { target: { value: '0' } });
    wrapper.find('.rc-tree-select-tree-checkbox').simulate('click');
    expect(onChange.mock.calls[0][2].allCheckedNodes).toEqual([
      expect.objectContaining({
        pos: '0-0',
      }),
    ]);
  });

  // https://github.com/ant-design/ant-design/issues/13365
  it('treeCheckStrictly not miss value', () => {
    const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            title: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            title: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            title: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ];

    const onChange = jest.fn();

    const wrapper = mount(
      <TreeSelect
        open
        defaultValue={[{ value: '0-1' }]}
        treeData={treeData}
        style={{ width: 300 }}
        treeCheckable
        treeCheckStrictly
        onChange={onChange}
      />,
    );

    wrapper
      .find('.rc-tree-select-search__field')
      .simulate('change', { target: { value: '0-0-0' } });
    wrapper
      .find(TreeNode)
      .at(1)
      .find('.rc-tree-select-tree-checkbox')
      .simulate('click');

    expect(onChange.mock.calls[0][0]).toEqual([
      { label: 'Node2', value: '0-1' },
      { label: 'Child Node1', value: '0-0-0' },
    ]);
  });
});
