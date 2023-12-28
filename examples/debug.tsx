/* eslint-disable */

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

const createSelect = props => <TreeSelect treeData={treeData} labelInValue {...props} />;

// export default () => (
//   <TreeSelect
//     defaultValue={['not-exist']}
//     treeCheckable
//     style={{ width: 300 }}
//     onDeselect={console.error}
//   />
// );

export default () =>
  createSelect({
    maxTagCount: 1,
    defaultValue: {
      value: '0',
      label: '2333',
    },
  });
