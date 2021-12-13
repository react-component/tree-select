/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

export default () => (
  <TreeSelect
    defaultValue={['0']}
    style={{ width: '100%' }}
    showCheckedStrategy={TreeSelect.SHOW_ALL}
    treeCheckable
    treeDefaultExpandAll
    open
  >
    <TreeSelect.TreeNode title="0" value="0">
      <TreeSelect.TreeNode title="0-0" value="0-0">
        <TreeSelect.TreeNode title="0-0-0" value="0-0-0" />
      </TreeSelect.TreeNode>
    </TreeSelect.TreeNode>
  </TreeSelect>
);
