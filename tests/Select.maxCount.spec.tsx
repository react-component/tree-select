import { render, fireEvent, within } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { keyDown, keyUp } from './util';
import React from 'react';
import TreeSelect from '../src';

describe('TreeSelect.maxCount', () => {
  const treeData = [
    { key: '0', value: '0', title: '0 label' },
    { key: '1', value: '1', title: '1 label' },
    { key: '2', value: '2', title: '2 label' },
    { key: '3', value: '3', title: '3 label' },
  ];

  const renderTreeSelect = (props?: any) => {
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
    const dropdownList = container.querySelector('.rc-tree-select-dropdown') as HTMLElement;
    const option3 = within(dropdownList).getByText('2 label');
    const option4 = within(dropdownList).getByText('3 label');

    expect(option3.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
    expect(option4.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
  });

  it('should allow deselecting options after reaching maxCount', () => {
    const { container } = renderTreeSelect();
    const dropdownList = container.querySelector('.rc-tree-select-dropdown') as HTMLElement;

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
    const dropdownList = container.querySelector('.rc-tree-select-dropdown') as HTMLElement;
    fireEvent.click(within(dropdownList).getByText('2 label'));
    expect(handleChange).toHaveBeenCalledTimes(2); // Should not increase
  });

  it('should not affect deselection operations when maxCount is reached', () => {
    const handleChange = jest.fn();
    const { container } = renderTreeSelect({ onChange: handleChange });

    selectOptions(container, ['0 label', '1 label']);
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Deselect first option
    const dropdownList = container.querySelector('.rc-tree-select-dropdown') as HTMLElement;
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

  it('should respect maxCount when checking parent node in treeCheckable mode', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        title: 'parent',
        children: [
          { key: '0-0', value: '0-0', title: 'child 1' },
          { key: '0-1', value: '0-1', title: 'child 2' },
          { key: '0-2', value: '0-2', title: 'child 3' },
        ],
      },
    ];

    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        multiple
        maxCount={2}
        onChange={handleChange}
        open
      />,
    );

    // Try to check parent node which would select all children
    const checkbox = container.querySelector('.rc-tree-select-tree-checkbox');
    fireEvent.click(checkbox);

    // onChange should not be called since it would exceed maxCount
    expect(handleChange).not.toHaveBeenCalled();

    // Parent node should still be unchecked
    expect(checkbox).not.toHaveClass('rc-tree-select-tree-checkbox-checked');
  });
});

describe('TreeSelect.maxCount keyboard operations', () => {
  const treeData = [
    { key: '0', value: '0', title: '0 label' },
    { key: '1', value: '1', title: '1 label' },
    { key: '2', value: '2', title: '2 label' },
  ];

  it('keyboard operations should not exceed maxCount limit', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open maxCount={2} onSelect={onSelect} />,
    );

    const input = container.querySelector('input');

    keyDown(input, KeyCode.ENTER);
    keyUp(input, KeyCode.ENTER);

    expect(onSelect).toHaveBeenCalledWith('0', expect.anything());

    keyDown(input, KeyCode.DOWN);
    keyDown(input, KeyCode.ENTER);
    keyUp(input, KeyCode.ENTER);

    expect(onSelect).toHaveBeenCalledWith('1', expect.anything());

    keyDown(input, KeyCode.DOWN);
    keyDown(input, KeyCode.ENTER);
    keyUp(input, KeyCode.ENTER);
  });

  it('when maxCount is reached, the option should be disabled', () => {
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        multiple
        open
        treeDefaultExpandAll
        maxCount={2}
        value={['0', '1']}
      />,
    );

    // verify that the third option is disabled
    expect(container.querySelector('.rc-tree-select-tree-treenode-disabled')?.textContent).toBe(
      '2 label',
    );
  });

  it('should be able to unselect after reaching maxCount', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open maxCount={3} defaultValue={['0', '1', '2']} />,
    );

    const input = container.querySelector('input');

    // cancel first selection
    keyDown(input, KeyCode.ENTER);
    keyUp(input, KeyCode.ENTER);

    // verify only two options are selected
    expect(container.querySelectorAll('.rc-tree-select-tree-treenode-selected')).toHaveLength(2);
  });
});

describe('TreeSelect.maxCount with different strategies', () => {
  const treeData = [
    {
      key: '0',
      value: '0',
      title: 'parent',
      children: [
        { key: '0-0', value: '0-0', title: 'child 1' },
        { key: '0-1', value: '0-1', title: 'child 2' },
        { key: '0-2', value: '0-2', title: 'child 3' },
      ],
    },
  ];

  it('should respect maxCount with SHOW_PARENT strategy', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeDefaultExpandAll
        multiple
        maxCount={1}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        onChange={handleChange}
        open
      />,
    );

    // Select parent node - should work as it only shows as one option
    const parentCheckbox = within(container).getByText('parent');
    fireEvent.click(parentCheckbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should respect maxCount with SHOW_CHILD strategy', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeDefaultExpandAll
        multiple
        maxCount={2}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        onChange={handleChange}
        open
      />,
    );

    // Select parent node - should not work as it would show three children
    const parentCheckbox = within(container).getByText('parent');
    fireEvent.click(parentCheckbox);
    expect(handleChange).not.toHaveBeenCalled();

    // Select individual children - should work until maxCount
    const childCheckboxes = within(container).getAllByText(/child/);
    fireEvent.click(childCheckboxes[0]); // first child
    fireEvent.click(childCheckboxes[1]); // second child
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Try to select third child - should not work
    fireEvent.click(childCheckboxes[2]);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});

describe('TreeSelect.maxCount with treeCheckStrictly', () => {
  const treeData = [
    {
      key: '0',
      value: '0',
      title: 'parent',
      children: [
        { key: '0-0', value: '0-0', title: 'child 1' },
        { key: '0-1', value: '0-1', title: 'child 2' },
      ],
    },
  ];

  it('should count parent and children separately when treeCheckStrictly is true', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        treeDefaultExpandAll
        multiple
        maxCount={2}
        onChange={handleChange}
        open
      />,
    );

    // Select parent and one child - should work as they are counted separately
    const parentCheckbox = within(container).getByText('parent');
    const checkboxes = within(container).getAllByText(/child/);
    fireEvent.click(parentCheckbox);
    fireEvent.click(checkboxes[0]); // first child
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Try to select second child - should not work as maxCount is reached
    fireEvent.click(checkboxes[1]);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('should allow deselecting when maxCount is reached', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        treeDefaultExpandAll
        multiple
        maxCount={2}
        onChange={handleChange}
        open
      />,
    );

    const parentCheckbox = within(container).getByText('parent');
    const checkboxes = within(container).getAllByText(/child/);

    // Select parent and first child
    fireEvent.click(parentCheckbox);
    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Deselect parent
    fireEvent.click(parentCheckbox);
    expect(handleChange).toHaveBeenCalledTimes(3);

    // Now should be able to select second child
    fireEvent.click(checkboxes[1]);
    expect(handleChange).toHaveBeenCalledTimes(4);
  });
});

describe('TreeSelect.maxCount with complex scenarios', () => {
  const complexTreeData = [
    {
      key: 'asia',
      value: 'asia',
      title: 'Asia',
      children: [
        {
          key: 'china',
          value: 'china',
          title: 'China',
          children: [
            { key: 'beijing', value: 'beijing', title: 'Beijing' },
            { key: 'shanghai', value: 'shanghai', title: 'Shanghai' },
            { key: 'guangzhou', value: 'guangzhou', title: 'Guangzhou' },
          ],
        },
        {
          key: 'japan',
          value: 'japan',
          title: 'Japan',
          children: [
            { key: 'tokyo', value: 'tokyo', title: 'Tokyo' },
            { key: 'osaka', value: 'osaka', title: 'Osaka' },
          ],
        },
      ],
    },
    {
      key: 'europe',
      value: 'europe',
      title: 'Europe',
      children: [
        {
          key: 'uk',
          value: 'uk',
          title: 'United Kingdom',
          children: [
            { key: 'london', value: 'london', title: 'London' },
            { key: 'manchester', value: 'manchester', title: 'Manchester' },
          ],
        },
        {
          key: 'france',
          value: 'france',
          title: 'France',
          disabled: true,
          children: [
            { key: 'paris', value: 'paris', title: 'Paris' },
            { key: 'lyon', value: 'lyon', title: 'Lyon' },
          ],
        },
      ],
    },
  ];

  it('should handle complex tree structure with maxCount correctly', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(
      <TreeSelect
        treeData={complexTreeData}
        treeCheckable
        treeDefaultExpandAll
        multiple
        maxCount={3}
        onChange={handleChange}
        open
      />,
    );

    const container = getByRole('tree');

    // 选择一个顶层节点
    const asiaNode = within(container).getByText('Asia');
    fireEvent.click(asiaNode);
    expect(handleChange).not.toHaveBeenCalled(); // 不应该触发，因为会超过 maxCount

    // 选择叶子节点
    const beijingNode = within(container).getByText('Beijing');
    const shanghaiNode = within(container).getByText('Shanghai');
    const tokyoNode = within(container).getByText('Tokyo');
    const londonNode = within(container).getByText('London');

    fireEvent.click(beijingNode);
    fireEvent.click(shanghaiNode);
    fireEvent.click(tokyoNode);
    expect(handleChange).toHaveBeenCalledTimes(3);

    // 尝试选择第四个节点，应该被阻止
    fireEvent.click(londonNode);
    expect(handleChange).toHaveBeenCalledTimes(3);

    // 验证禁用状态
    expect(londonNode.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
  });

  it('should handle maxCount with mixed selection strategies', () => {
    const handleChange = jest.fn();

    const { getByRole } = render(
      <TreeSelect
        treeData={complexTreeData}
        treeCheckable
        treeDefaultExpandAll
        multiple
        maxCount={3}
        onChange={handleChange}
        defaultValue={['uk']}
        open
      />,
    );

    const container = getByRole('tree');

    const tokyoNode = within(container).getByText('Tokyo');
    fireEvent.click(tokyoNode);

    // because UK node will show two children, so it will trigger one change
    expect(handleChange).toHaveBeenCalledTimes(1);

    const beijingNode = within(container).getByText('Beijing');
    fireEvent.click(beijingNode);

    // should not trigger change
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(beijingNode.closest('div')).toHaveClass('rc-tree-select-tree-treenode-disabled');
  });
});
