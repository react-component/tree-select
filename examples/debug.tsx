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
  <TreeSelect
    style={{ width: '100%' }}
    showSearch
    filterTreeNode={false}
    // showCheckedStrategy={SHOW_CHILD}
    // treeCheckable
    // defaultValue={['0']}
    open
  >
    <SelectNode value="Value 0" title="Title 0" key="key 0">
      <SelectNode value="Value 0-0" title="Title 0-0" key="key 0-0" />
      <SelectNode value="Value 0-1" title="Title 0-1" key="key 0-1" />
    </SelectNode>
    <SelectNode value="Value 1" title="Title 1" key="key 1" />
  </TreeSelect>
);
