import React from 'react';
import { render } from '@testing-library/react';
import TreeSelect from '../src';

describe('ReactNode renderability', () => {
  const treeData = [{ value: 'a', title: 'A', children: [{ value: 'b', title: 'B' }] }];

  it('enables multiple mode and the checked strategy for a zero checkbox', () => {
    const { container } = render(
      <TreeSelect treeCheckable={0} treeData={treeData} defaultValue={['a']} />,
    );
    expect(container.querySelector('.rc-tree-select-multiple')).toBeTruthy();
    expect(container.querySelectorAll('.rc-tree-select-selection-item')).toHaveLength(1);
    expect(container.querySelector('.rc-tree-select-selection-item').textContent).toContain('B');
  });

  it('retains a zero label for a null value', () => {
    const { container } = render(
      <TreeSelect labelInValue value={{ value: null, label: 0 }} placeholder="EMPTY" />,
    );
    expect(container.textContent).toContain('0');
    expect(container.textContent).not.toContain('EMPTY');
  });
});
