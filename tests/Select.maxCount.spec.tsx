import { render, fireEvent, within } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
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

    expect(onSelect).toHaveBeenCalledTimes(2);
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
