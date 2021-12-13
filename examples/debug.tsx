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
    treeCheckable
    style={{ width: 300 }}
    treeData={treeData}
    onChange={console.log}
    showCheckedStrategy={TreeSelect.SHOW_PARENT}
    defaultValue={['0-0', '0-1-0', '0-1-2']}
    open
  />
);
