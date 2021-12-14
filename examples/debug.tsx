/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const { TreeNode, SHOW_ALL, SHOW_CHILD } = TreeSelect;
const SelectNode = TreeNode;

const treeData = [
  { key: '0', value: '0', title: 'label0' },
  { key: '1', value: '1', title: 'label1' },
];

const children = [
  <TreeNode key="0" value="0" title="label0" foo={0} />,
  <TreeNode key="1" value="1" title="label1" foo={1} />,
];

const createSelect = props => <TreeSelect treeData={treeData} multiple {...props} />;

export default () =>
  createSelect({
    open: true,
    value: ['0', '1'],
    onChange: (val, options, extra) => {
      console.log('Change:', extra.allCheckedNodes);
      console.log(extra.allCheckedNodes[0].props);
    },
    treeCheckable: true,
    treeData: null,
    children,
  });
