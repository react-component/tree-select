/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TreeSelect from '../src';

describe('treeExpandAction with selectable props', () => {
  const treeData = [
    {
      title: '0-0',
      value: '0-0',
      selectable: false,
      children: [
        {
          title: '0-0-0',
          value: '0-0-0',
          selectable: false,
          children: [
            {
              title: '0-0-0-0',
              value: '0-0-0-0',
              selectable: false,
            },
            {
              title: '0-0-0-0',
              value: '0-0-0-1',
              selectable: false,
            },
          ],
        },
        {
          title: '0-0-1',
          value: '0-0-1',
          selectable: false,
          children: [
            {
              title: '0-0-1-0',
              value: '0-0-1-0',
              selectable: false,
            },
            {
              title: '0-0-1-1',
              value: '0-0-1-1',
              selectable: false,
            },
          ],
        },
      ],
    },
  ];

  const clickNodeTitle = title => {
    fireEvent.click(document.querySelector(`[title="${title}"]`));
  };

  const doubleClickNodeTitle = title => {
    fireEvent.doubleClick(document.querySelector(`[title="${title}"]`));
  };

  it('title expandable when selectable is false and treeExpandAction is "click"', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    render(
      <TreeSelect
        open
        treeExpandAction="click"
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    clickNodeTitle('0-0');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    clickNodeTitle('0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0', '0-0-1']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    clickNodeTitle('0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);
  });

  it('title expandable when selectable is false and treeExpandAction is "doubleClick"', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    render(
      <TreeSelect
        open
        treeExpandAction="doubleClick"
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    doubleClickNodeTitle('0-0');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    doubleClickNodeTitle('0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0', '0-0-1']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    doubleClickNodeTitle('0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);
  });

  it('title un-expandable when selectable is false and treeExpandAction is false', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    render(
      <TreeSelect
        open
        treeExpandAction={false}
        treeDefaultExpandedKeys={['0-0']}
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    clickNodeTitle('0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).not.toHaveBeenCalled();
  });
});
