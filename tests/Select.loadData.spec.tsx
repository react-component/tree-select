/* eslint-disable no-undef, react/no-multi-comp, no-console */
import Tree, { TreeNode } from 'rc-tree';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import TreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode as SelectNode } from '../src';
import { selectNode } from './util';

describe('TreeSelect.loadData', () => {
  it('keep sync', async () => {
    let renderTimes = 0;
    let calledLastId: number | null = null;

    const Demo = () => {
      const [treeData, setTreeData] = React.useState([
        {
          title: '0',
          value: 0,
          isLeaf: false,
        },
      ]);

      renderTimes += 1;
      const renderId = renderTimes;

      const loadData = async () => {
        calledLastId = renderId;
        setTreeData([
          ...treeData,
          {
            title: `${renderId}`,
            value: renderId,
            isLeaf: true,
          },
        ]);
      };

      return <TreeSelect open treeData={treeData} loadData={loadData} />;
    };

    render(<Demo />);

    console.log(document.body.innerHTML);

    fireEvent.click(document.querySelector('.rc-tree-select-tree-switcher_close'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(calledLastId).toBe(renderTimes);

    fireEvent.click(document.querySelector('.rc-tree-select-tree-switcher_close'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(calledLastId).toBe(renderTimes);
  });
});
