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

  it('should cycle through selected options when maxCount is reached', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open maxCount={2} value={['0', '2']} />,
    );

    const input = container.querySelector('input');

    keyDown(input, KeyCode.DOWN);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('2 label');

    // Move down again to cycle back to the first selected item
    keyDown(input, KeyCode.DOWN);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('0 label');
  });

  it('should cycle through selected options in reverse when using UP key', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open maxCount={2} value={['0', '2']} />,
    );

    const input = container.querySelector('input');

    // Initially activate the last selected item
    keyDown(input, KeyCode.UP);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('2 label');

    // Move up again to cycle back to the first selected item
    keyDown(input, KeyCode.UP);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('0 label');

    // Move up again to cycle back to the last selected item
    keyDown(input, KeyCode.UP);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('2 label');
  });

  it('should handle LEFT/RIGHT keys correctly when maxCount is reached', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open maxCount={2} value={['0', '2']} />,
    );

    const input = container.querySelector('input');

    keyDown(input, KeyCode.RIGHT);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('2 label');

    keyDown(input, KeyCode.LEFT);
    expect(
      container.querySelector('.rc-tree-select-tree-treenode.rc-tree-select-tree-treenode-active')
        ?.textContent,
    ).toBe('0 label');
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

  it('should respect maxCount with SHOW_ALL strategy', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeDefaultExpandAll
        multiple
        maxCount={2}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        onChange={handleChange}
        open
      />,
    );

    // Select parent node - should not work as it would show both parent and children
    const parentCheckbox = within(container).getByText('parent');
    fireEvent.click(parentCheckbox);
    expect(handleChange).not.toHaveBeenCalled();

    // Select individual children
    const childCheckboxes = within(container).getAllByText(/child/);
    fireEvent.click(childCheckboxes[0]);
    fireEvent.click(childCheckboxes[1]);
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
