import '../assets/index.less';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';

const treeData = [
  {
    title: 'a list is option only',
    showTitle: 'Node2',
    value: '0-1',
  },
];

function Demo() {
  return (
    <>
      <TreeSelect
        style={{ width: '100%' }}
        treeDefaultExpandAll
        treeData={treeData}
        treeNodeLabelProp="showTitle"
      />
      <TreeSelect style={{ width: '100%' }} treeDefaultExpandAll treeNodeLabelProp="showTitle">
        <TreeNode value="0-0" title="a list is option only" showTitle="Node2" />
      </TreeSelect>
    </>
  );
}

export default Demo;
