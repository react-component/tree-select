import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import TreeSelect from '../src';

jest.unmock('@rc-component/virtual-list');

it('restores the active descendant when its branch scrolls back into view', async () => {
  const treeData = [
    { value: 'parent', title: 'Parent', children: [{ value: 'child', title: 'Child' }] },
    ...Array.from({ length: 30 }, (_, index) => ({ value: index, title: `Row ${index}` })),
  ];
  const { getByRole, getByText, queryByRole } = render(
    <TreeSelect open treeData={treeData} listHeight={60} listItemHeight={20} />,
  );
  const input = getByRole('combobox');
  act(() => input.focus());
  const parent = getByRole('treeitem', { name: 'Parent' });
  const getFallback = () => getByText('parent', { selector: '[aria-live="assertive"]' });
  const holder = getByRole('tree').querySelector('.rc-tree-select-tree-list-holder')!;

  await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', parent.id));
  expect(getFallback()).toHaveAttribute('aria-hidden', 'true');

  fireEvent.scroll(holder, { target: { scrollTop: 200 } });
  await waitFor(() => expect(input).not.toHaveAttribute('aria-activedescendant'));
  expect(queryByRole('treeitem', { name: 'Parent' })).not.toBeInTheDocument();
  expect(getFallback()).not.toHaveAttribute('aria-hidden', 'true');

  fireEvent.scroll(holder, { target: { scrollTop: 0 } });
  await waitFor(() =>
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      getByRole('treeitem', { name: 'Parent' }).id,
    ),
  );
  expect(getFallback()).toHaveAttribute('aria-hidden', 'true');
  expect(input).toHaveFocus();
});
