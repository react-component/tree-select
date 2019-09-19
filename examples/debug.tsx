/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import '../assets/index.less';

const Demo: React.FC<{}> = () => (
  <div
    onFocus={({ target }) => {
      console.log('Focus:', target);
    }}
    onBlur={({ target }) => {
      console.log('Blur:', target);
    }}
  >
    <h1>Debug</h1>
    <input />
    <TreeSelect style={{ width: 200 }}>
      <TreeNode title="parent" value="parent">
        <TreeNode title="child" value="child" />
      </TreeNode>
      <TreeNode title="parent2" value="parent2">
        {new Array(20).fill(null).map((_, index) => (
          <TreeNode key={index} title={`Hello_${index}`} value={index} />
        ))}
      </TreeNode>
    </TreeSelect>

    <TreeSelect
      style={{ width: 200 }}
      multiple
      treeData={[
        { value: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] },
        {
          value: 'parent2',
          title: 'Parent 2',
          children: new Array(20).fill(null).map((_, index) => ({
            key: index,
            title: `Hello_${index}`,
          })),
        },
      ]}
    />
    <input />
  </div>
);

export default Demo;
