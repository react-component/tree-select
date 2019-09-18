import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import '../assets/index.less';

const Demo: React.FC<{}> = () => {
  return (
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
      <TreeSelect>
        <TreeNode title="parent" value="parent">
          <TreeNode title="child" value="child" />
        </TreeNode>
        <TreeNode title="parent2" value="parent2">
          {new Array(20).fill(null).map((_, index) => (
            <TreeNode key={index} title={`Hello_${index}`} value={index} />
          ))}
        </TreeNode>
      </TreeSelect>
      <input />
    </div>
  );
};

export default Demo;
