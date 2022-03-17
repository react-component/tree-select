import '../assets/index.less';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';

function Demo() {
  return (
    <TreeSelect style={{ width: 120 }} dropdownMatchSelectWidth={false} treeDefaultExpandAll>
      <TreeNode value="parent 1" title="parent 1">
        <TreeNode value="parent 1-0 sdfsdfsdsdfsd" title="parent 1-0 sdfsdfsd">
          <TreeNode value="leaf1  sdfsdf" title="leaf1" />
          <TreeNode value="leaf2 sdfsdfsdf" title="leaf2" />
        </TreeNode>
        <TreeNode value="parent 1-1 sdfsdfsdf" title="parent 1-1 sdfsdfsd">
          <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </TreeNode>
        <TreeNode value="parent 1-2 sdfsdfsdf" title="parent 1-2 sdfsdfsd">
          <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </TreeNode>
        <TreeNode value="parent 1-3 sdfsdfsdf" title="parent 1-2 sdfsdfsd">
          <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </TreeNode>
        <TreeNode value="parent 1-4 sdfsdfsdf" title="parent 1-4 sdfsdfsd">
          <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </TreeNode>
        <TreeNode value="parent 1-5 2sdfsdfsdf" title="parent 1-5 sdfsdfsd">
          <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </TreeNode>
      </TreeNode>
    </TreeSelect>
  );
}

export default Demo;
