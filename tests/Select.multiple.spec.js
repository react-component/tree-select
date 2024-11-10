/* eslint-disable no-undef */
import { render, fireEvent, within } from '@testing-library/react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';

describe('TreeSelect.multiple', () => {
  focusTest(true);

  const treeData = [
    { key: '0', value: '0', title: 'label0' },
    { key: '1', value: '1', title: 'label1' },
  ];
  const createSelect = props => <TreeSelect treeData={treeData} multiple {...props} />;

  it('select multiple nodes', () => {
    const wrapper = mount(createSelect({ open: true }));
    wrapper.selectNode(0);
    wrapper.selectNode(1);
    expect(wrapper.getSelection(0).text()).toBe('label0');
    expect(wrapper.getSelection(1).text()).toBe('label1');
  });

  it('remove selected node', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper.clearSelection();
    expect(wrapper.getSelection()).toHaveLength(1);
    expect(wrapper.getSelection(0).text()).toBe('label1');
  });

  it('remove by backspace key', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper
      .find('input')
      .first()
      .simulate('keyDown', { which: KeyCode.BACKSPACE, key: 'Backspace' });
    expect(wrapper.getSelection()).toHaveLength(1);
    expect(wrapper.getSelection(0).text()).toBe('label0');
  });

  // https://github.com/react-component/tree-select/issues/47
  it('remove by backspace key twice when treeCheckable and under controlled', () => {
    class App extends React.Component {
      state = {
        value: ['0', '1'],
      };

      handleChange = value => {
        this.setState({ value });
      };

      render() {
        const { value } = this.state;
        return createSelect({
          open: true,
          value,
          onChange: this.handleChange,
          treeCheckable: true,
        });
      }
    }
    const wrapper = mount(<App />);
    wrapper
      .find('input')
      .first()
      .simulate('keyDown', { which: KeyCode.BACKSPACE, key: 'Backspace' });
    wrapper.selectNode(1);
    wrapper
      .find('input')
      .first()
      .simulate('keyDown', { which: KeyCode.BACKSPACE, key: 'Backspace' });
    expect(wrapper.getSelection()).toHaveLength(1);
    expect(wrapper.getSelection(0).text()).toBe('label0');
  });

  // TODO: Check preVal, it's not correct
  it('click X to delete select', () => {
    const handleChange = jest.fn();
    const children = [
      <TreeNode key="0" value="0" title="label0" foo={0} />,
      <TreeNode key="1" value="1" title="label1" foo={1} />,
    ];
    const wrapper = mount(
      createSelect({
        open: true,
        value: ['0', '1'],
        onChange: handleChange,
        treeCheckable: true,
        treeData: null,
        children,
      }),
    );

    wrapper.clearSelection(1);

    expect(handleChange.mock.calls[0][2].allCheckedNodes[0].props).toBeTruthy();

    expect(handleChange).toHaveBeenCalledWith(
      ['0'],
      ['label0'],
      expect.anything({
        allCheckedNodes: [
          expect.objectContaining({
            props: expect.objectContaining(children[0].props),
          }),
        ],
      }),
    );
  });

  it('renders clear button', () => {
    const wrapper = mount(createSelect({ allowClear: true, value: ['0'] }));

    expect(wrapper.find('.rc-tree-select-clear').length).toBeTruthy();
  });

  it('should focus and clear search input after select and unselect item', () => {
    const wrapper = mount(createSelect());

    wrapper.search('0');
    wrapper.selectNode(0);
    expect(wrapper.find('input').first().props().value).toBe('');

    wrapper.search('0');
    wrapper.selectNode(0);
    expect(wrapper.find('input').first().props().value).toBe('');
  });

  it('do not open tree when close button click', () => {
    const wrapper = mount(createSelect());
    wrapper.openSelect();
    wrapper.selectNode(0);
    wrapper.selectNode(1);
    wrapper.openSelect();
    wrapper.clearSelection(0);
    expect(wrapper.isOpen()).toBeFalsy();
    expect(wrapper.getSelection()).toHaveLength(1);
  });

  describe('maxTagCount', () => {
    it('legal', () => {
      const wrapper = mount(
        createSelect({
          maxTagCount: 1,
          value: ['0', '1'],
        }),
      );

      expect(wrapper.getSelection()).toHaveLength(2);
      expect(wrapper.getSelection(1).text()).toBe('+ 1 ...');
    });

    it('illegal', () => {
      const wrapper = mount(
        createSelect({
          maxTagCount: 1,
          value: ['0', 'not exist'],
        }),
      );

      expect(wrapper.getSelection()).toHaveLength(2);
      expect(wrapper.getSelection(1).text()).toBe('+ 1 ...');
    });

    it('zero', () => {
      const wrapper = mount(
        createSelect({
          maxTagCount: 0,
          value: ['0', '1'],
        }),
      );

      expect(wrapper.getSelection()).toHaveLength(1);
      expect(wrapper.getSelection(0).text()).toBe('+ 2 ...');
    });

    describe('maxTagPlaceholder', () => {
      it('string', () => {
        const wrapper = mount(
          createSelect({
            maxTagCount: 1,
            value: ['0', '1'],
            maxTagPlaceholder: 'bamboo',
          }),
        );
        expect(wrapper.getSelection(1).text()).toBe('bamboo');
      });

      it('function', () => {
        const wrapper = mount(
          createSelect({
            maxTagCount: 1,
            value: ['0', '1'],
            maxTagPlaceholder: list => `${list.length} bamboo...`,
          }),
        );
        expect(wrapper.getSelection(1).text()).toBe('1 bamboo...');
      });
    });
  });

  it('number types', () => {
    const myTreeData = [
      { key: 0, value: 0, title: 0 },
      {
        key: 1,
        value: 1,
        title: 1,
        children: [
          { key: 2, value: 2, title: 2 },
          { key: 3, value: 3, title: 3 },
        ],
      },
      { key: 4, value: 4, title: 4 },
    ];

    const onChange = jest.fn();

    const wrapper = mount(
      createSelect({
        open: true,
        treeCheckable: true,
        defaultValue: [4],
        treeData: myTreeData,
        onChange,
      }),
    );

    wrapper.selectNode(0);
    expect(onChange).toHaveBeenCalledWith([4, 0], expect.anything(), expect.anything());
    onChange.mockReset();

    wrapper.selectNode(1);
    expect(onChange).toHaveBeenCalledWith([4, 0, 2, 3], expect.anything(), expect.anything());
  });

  // https://github.com/ant-design/ant-design/issues/12315
  it('select searched node', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TreeSelect value={['leaf1']} multiple onChange={onChange}>
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title="sss" key="random3" />
          </TreeNode>
        </TreeNode>
      </TreeSelect>,
    );

    wrapper.search('sss');
    wrapper.selectNode(2);
    expect(onChange).toHaveBeenCalledWith(['leaf1', 'sss'], expect.anything(), expect.anything());
  });

  it('do not crash when value has empty string', () => {
    const wrapper = mount(
      <TreeSelect multiple value={['']}>
        <TreeNode value="" title="empty str" key="empty str" />
      </TreeSelect>,
    );

    expect(wrapper.getSelection()).toHaveLength(1);
  });

  it('can hide search box by showSearch = false', () => {
    const wrapper = mount(<TreeSelect multiple showSearch={false} />);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('not exist value should can be remove', () => {
    const onChange = jest.fn();
    const onDeselect = jest.fn();
    const wrapper = mount(
      <TreeSelect
        treeCheckable
        value={['not-exist']}
        onChange={onChange}
        onDeselect={onDeselect}
      />,
    );
    wrapper.clearSelection(0);

    expect(onChange).toHaveBeenCalledWith([], expect.anything(), expect.anything());
    expect(onDeselect).toHaveBeenCalledWith('not-exist', undefined);
  });

  it('should not omit value', () => {
    const { container } = render(
      <TreeSelect
        value={['child1', 'child2', 'parent']}
        multiple
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            children: [
              {
                label: 'child1',
                value: 'child1',
              },
              {
                label: 'child2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    const values = Array.from(
      container.querySelectorAll('.rc-tree-select-selection-item-content'),
    ).map(ele => ele.textContent);
    expect(values).toEqual(['child1', 'child2', 'parent']);
  });

  // https://github.com/ant-design/ant-design/issues/50578#issuecomment-2312130715
  it('should not omit value when value is null', () => {
    const { container } = render(
      <TreeSelect
        value={null}
        multiple
        placeholder="Fake placeholder"
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            children: [
              {
                label: 'child1',
                value: 'child1',
              },
              {
                label: 'child2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    const values = Array.from(container.querySelectorAll('.rc-tree-select-selection-item-content')); //.map(ele => ele.textContent);

    expect(values).toHaveLength(0);

    const placeholder = container.querySelector('[class$=placeholder]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent).toBe('Fake placeholder');
  });

  describe('TreeSelect.maxCount', () => {
    const treeData = [
      { key: '0', value: '0', title: '0 label' },
      { key: '1', value: '1', title: '1 label' },
      { key: '2', value: '2', title: '2 label' },
      { key: '3', value: '3', title: '3 label' },
    ];

    const renderTreeSelect = props => {
      return render(<TreeSelect multiple maxCount={2} treeData={treeData} open {...props} />);
    };

    const selectOptions = (container, optionTexts) => {
      const dropdownList = container.querySelector('.rc-tree-select-dropdown');
      optionTexts.forEach(text => {
        fireEvent.click(within(dropdownList).getByText(text));
      });
    };

    it('should disable unselected options when selection reaches maxCount', () => {
      const { container } = renderTreeSelect();

      selectOptions(container, ['0 label', '1 label']);

      // Check if third and fourth options are disabled
      const dropdownList = container.querySelector('.rc-tree-select-dropdown');
      const option3 = within(dropdownList).getByText('2 label');
      const option4 = within(dropdownList).getByText('3 label');

      expect(option3.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
      expect(option4.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
    });

    it('should allow deselecting options after reaching maxCount', () => {
      const { container } = renderTreeSelect();
      const dropdownList = container.querySelector('.rc-tree-select-dropdown');

      selectOptions(container, ['0 label', '1 label']);

      // Try selecting third option, should be disabled
      const option3 = within(dropdownList).getByText('2 label');
      fireEvent.click(option3);
      expect(option3.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');

      // Deselect first option
      fireEvent.click(within(dropdownList).getByText('0 label'));
      expect(within(dropdownList).queryByText('0 label')).toBeInTheDocument();

      // Now should be able to select third option
      fireEvent.click(option3);
      expect(option3.closest('div')).not.toHaveClass('rc-tree-select-tree-treenode-disabled');
    });

    it('should not trigger onChange when trying to select beyond maxCount', () => {
      const handleChange = jest.fn();
      const { container } = renderTreeSelect({ onChange: handleChange });

      selectOptions(container, ['0 label', '1 label']);
      expect(handleChange).toHaveBeenCalledTimes(2);

      // Try selecting third option
      const dropdownList = container.querySelector('.rc-tree-select-dropdown');
      fireEvent.click(within(dropdownList).getByText('2 label'));
      expect(handleChange).toHaveBeenCalledTimes(2); // Should not increase
    });

    it('should not affect deselection operations when maxCount is reached', () => {
      const handleChange = jest.fn();
      const { container } = renderTreeSelect({ onChange: handleChange });

      selectOptions(container, ['0 label', '1 label']);
      expect(handleChange).toHaveBeenCalledTimes(2);

      // Deselect first option
      const dropdownList = container.querySelector('.rc-tree-select-dropdown');
      fireEvent.click(within(dropdownList).getByText('0 label'));
      expect(handleChange).toHaveBeenCalledTimes(3);

      // Should be able to select third option
      fireEvent.click(within(dropdownList).getByText('2 label'));
      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it('should not allow any selection when maxCount is 0', () => {
      const handleChange = jest.fn();
      const { container } = renderTreeSelect({ maxCount: 0, onChange: handleChange });

      selectOptions(container, ['0 label', '1 label']);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not limit selection when maxCount is greater than number of options', () => {
      const handleChange = jest.fn();
      const { container } = renderTreeSelect({ maxCount: 5, onChange: handleChange });

      selectOptions(container, ['0 label', '1 label', '2 label', '3 label']);
      expect(handleChange).toHaveBeenCalledTimes(4);
    });
  });
});
