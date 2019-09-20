/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import '../assets/index.less';
import { RawValueType } from '../src/interface';

const treeData = [
  { value: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] },
  {
    value: 'parent2',
    title: 'Parent 2',
    children: new Array(20).fill(null).map((_, index) => ({
      key: index,
      title: `Hello_${index}`,
    })),
  },
  { value: 'disabled', title: 'Disabled', disabled: true },
  { value: 'disableCheckbox', title: 'No Checkbox', disableCheckbox: true },
];

const Demo: React.FC<{}> = () => {
  const [search, setSearch] = React.useState<string>('');
  const [value, setValue] = React.useState<RawValueType[]>([]);

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

      <TreeSelect style={{ width: 200 }} treeData={treeData} multiple />
      <TreeSelect
        style={{ width: 200 }}
        treeData={treeData}
        placeholder="Search Control"
        treeCheckable
        searchValue={search}
        onSearch={str => {
          console.log('Search:', str);
          setSearch(str);
        }}
      />
      <TreeSelect
        autoFocus
        style={{ width: 200 }}
        treeData={treeData}
        treeCheckable
        showSearch={false}
        value={value}
        maxTagCount={2}
        onChange={(newValue, ...args) => {
          console.log('Change:', newValue, ...args);
          setValue(newValue);
        }}
        placeholder="Control Mode"
      />
      <input />
    </div>
  );
};

export default Demo;
