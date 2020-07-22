import '../assets/index.less';
import React from 'react';
import TreeSelect from '../src';

const treeData = [
  {
    title: 'a list is option only',
    showTitle: 'Node2',
    value: '0-1',
  },
];

function Demo() {
  return (
    <TreeSelect
      style={{ width: '100%' }}
      treeDefaultExpandAll
      treeData={treeData}
      treeNodeLabelProp="showTitle"
    />
  );
}

export default Demo;
