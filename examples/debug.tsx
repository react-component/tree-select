/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const { TreeNode, SHOW_ALL, SHOW_CHILD } = TreeSelect;
const SelectNode = TreeNode;

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

function filterTreeNode(input, child) {
  return String(child.props.title).indexOf(input) !== -1;
}

export default () => (
  <TreeSelect style={{ width: 300 }} open treeDefaultExpandedKeys={['1']}>
    <TreeNode key="0" value="0" title="0 label" />
    <TreeNode key="1" value="1" title="1 label">
      <TreeNode key="10" value="10" title="10 label" />
      <TreeNode key="11" value="11" title="11 label" />
    </TreeNode>
  </TreeSelect>
);
