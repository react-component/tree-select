/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import '../assets/index.less';
import { RawValueType } from '../src/interface';

const treeData = [
  { value: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Child' }] },
  {
    value: 'parent2',
    label: 'Parent 2',
    children: new Array(20).fill(null).map((_, index) => ({
      key: index,
      label: `Hello_${index}`,
    })),
  },
  { value: 'disabled', label: 'Disabled', disabled: true },
  { value: 'disableCheckbox', label: 'No Checkbox', disableCheckbox: true },
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
      <TreeSelect style={{ width: 200 }} defaultValue="child">
        <TreeNode title="Parent" value="parent">
          <TreeNode title="Child" value="child" />
        </TreeNode>
        <TreeNode title="Parent2" value="parent2">
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
        onChange={(...args) => {
          console.log('Change:', ...args);
        }}
      />
      <TreeSelect
        autoFocus
        style={{ width: 200 }}
        treeData={treeData}
        treeCheckable
        showSearch={false}
        showCheckedStrategy="SHOW_PARENT"
        value={value}
        maxTagCount={2}
        treeDefaultExpandedKeys={['parent']}
        onChange={(newValue, ...args) => {
          console.log('Change:', newValue, ...args);
          setValue(newValue);
        }}
        placeholder="Control Mode"
      />
      <TreeSelect
        open
        showSearch
        allowClear
        treeData={[
          { key: 'a', value: 'a', title: 'labela' },
          { key: 'b', value: 'b', title: 'labelb' },
        ]}
      />
      <input />
    </div>
  );
};

export default Demo;
