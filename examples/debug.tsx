/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const { TreeNode, SHOW_ALL, SHOW_CHILD } = TreeSelect;
const SelectNode = TreeNode;

const treeData = [
  { key: 'a', value: 'a', title: 'labela' },
  {
    key: 'b',
    value: 'b',
    title: 'labelb',
    children: [
      { key: 'b-1', value: 'b-1', title: 'labelb-1', selectable: false },
      { key: 'b-2', value: 'b-2', title: 'labelb-2' },
    ],
  },
];

const createSelect = props => <TreeSelect treeData={treeData} {...props} />;

export default () =>
  createSelect({
    // searchValue: 'a',
    // open: true,
    // treeDefaultExpandAll: true,
    filterTreeNode: false,
    placeholder: 'no no no no no no',
    onSelect: (...args) => {
      console.log('Select:', ...args);
    },
  });
