/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import TreeSelect from '../src';

describe('TreeSelect.loadData', () => {
  it('keep sync', async () => {
    const Demo = () => {
      const [treeData, setTreeData] = React.useState([
        {
          title: '0',
          value: 0,
          isLeaf: false,
        },
      ]);

      const loadData = async () => {
        const nextId = treeData.length;

        setTreeData([
          ...treeData,
          {
            title: `${nextId}`,
            value: nextId,
            isLeaf: false,
          },
        ]);
      };

      return <TreeSelect open treeData={treeData} loadData={loadData} />;
    };

    render(<Demo />);

    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(document.querySelector('.rc-tree-select-tree-switcher_close'));
      await act(async () => {
        await Promise.resolve();
      });
      expect(
        document.querySelectorAll('.rc-tree-select-tree-list .rc-tree-select-tree-treenode'),
      ).toHaveLength(2 + i);
    }
  });
});
