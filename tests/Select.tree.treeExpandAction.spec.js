/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount } from 'enzyme';
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

  const clickNodeTitle = (wrapper, title) => {
    wrapper.find(`[title="${title}"]`).hostNodes().simulate('click');
  };

  const doubleClickNodeTitle = (wrapper, title) => {
    wrapper.find(`[title="${title}"]`).hostNodes().simulate('doubleClick');
  };

  it('title expandable when selectable is false and treeExpandAction is "click"', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    const wrapper = mount(
      <TreeSelect
        open
        treeExpandAction="click"
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    clickNodeTitle(wrapper, '0-0');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    clickNodeTitle(wrapper, '0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0', '0-0-1']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    clickNodeTitle(wrapper, '0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);
  });

  it('title expandable when selectable is false and treeExpandAction is "doubleClick"', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    const wrapper = mount(
      <TreeSelect
        open
        treeExpandAction="doubleClick"
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    doubleClickNodeTitle(wrapper, '0-0');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    doubleClickNodeTitle(wrapper, '0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0', '0-0-1']);

    onSelect.mockReset();
    onTreeExpand.mockReset();

    doubleClickNodeTitle(wrapper, '0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).toHaveBeenCalledWith(['0-0']);
  });

  it('title un-expandable when selectable is false and treeExpandAction is false', () => {
    const onSelect = jest.fn();
    const onTreeExpand = jest.fn();

    const wrapper = mount(
      <TreeSelect
        open
        treeExpandAction={false}
        treeDefaultExpandedKeys={['0-0']}
        onTreeExpand={onTreeExpand}
        onSelect={onSelect}
        treeData={treeData}
      />,
    );

    clickNodeTitle(wrapper, '0-0-1');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onTreeExpand).not.toHaveBeenCalled();
  });
});
