/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const { TreeNode, SHOW_ALL, SHOW_CHILD } = TreeSelect;
const SelectNode = TreeNode;

const treeData = [
  { key: 'a', value: 'a', title: 'labela' },
  { key: 'b', value: 'b', title: 'labelb' },
];

const createSelect = props => <TreeSelect open showSearch treeData={treeData} {...props} />;

export default () =>
  createSelect({
    // searchValue: 'a',
    open: true,
    treeDefaultExpandAll: true,
    filterTreeNode: false,
    placeholder: 'no no no no no no'
  });
