/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const { TreeNode, SHOW_ALL, SHOW_CHILD } = TreeSelect;

const treeData = [
  {
    key: 'P001',
    title: 'P001',
    value: 'P001',
    children: [
      {
        key: '0020',
        title: '0020',
        value: '0020',
        children: [{ key: '9459', title: '9459', value: '9459' }],
      },
    ],
  },
  {
    key: 'P002',
    title: 'P002',
    value: 'P002',
    children: [
      {
        key: '0021',
        title: '0021',
        value: '0021',
        children: [{ key: '9458', title: '9458', value: '9458' }],
      },
    ],
  },
];

export default () => (
  <TreeSelect
    style={{ width: '100%' }}
    showCheckedStrategy={SHOW_CHILD}
    treeCheckable
    defaultValue={['0']}
    treeData={[
      {
        key: 'k 0',
        value: '0',
        title: 't 0',
        children: [
          {
            key: 'k 0-0',
            value: '0-0',
            title: 't 0-0',
          },
        ],
      },
    ]}
    open
  />
);
