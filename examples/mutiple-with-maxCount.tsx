import React, { useState } from 'react';
import TreeSelect from '../src';

export default () => {
  const [value, setValue] = useState<string[]>(['1']);
  const [checkValue, setCheckValue] = useState<string[]>(['1']);

  const treeData = [
    {
      key: '1',
      value: '1',
      title: '1',
      children: [
        {
          key: '1-1',
          value: '1-1',
          title: '1-1',
        },
        {
          key: '1-2',
          value: '1-2',
          title: '1-2',
          disabled: true,
          children: [
            {
              key: '1-2-1',
              value: '1-2-1',
              title: '1-2-1',
              disabled: true,
            },
            {
              key: '1-2-2',
              value: '1-2-2',
              title: '1-2-2',
            },
          ],
        },
        {
          key: '1-3',
          value: '1-3',
          title: '1-3',
        },
      ],
    },
    {
      key: '2',
      value: '2',
      title: '2',
    },
    {
      key: '3',
      value: '3',
      title: '3',
    },
    {
      key: '4',
      value: '4',
      title: '4',
    },
  ];

  const onChange = (val: string[]) => {
    setValue(val);
  };

  const onCheckChange = (val: string[]) => {
    setCheckValue(val);
  };

  return (
    <>
      <h2>multiple with maxCount</h2>
      <TreeSelect
        style={{ width: 300 }}
        fieldNames={{ value: 'value', label: 'title' }}
        multiple
        maxCount={3}
        treeData={treeData}
      />
      <h2>checkable with maxCount</h2>
      <TreeSelect
        style={{ width: 300 }}
        treeCheckable
        // showCheckedStrategy="SHOW_ALL"
        // showCheckedStrategy="SHOW_PARENT"
        maxCount={4}
        treeData={treeData}
        onChange={onChange}
        value={value}
      />
      <h2>checkable with maxCount and treeCheckStrictly</h2>
      <TreeSelect
        style={{ width: 300 }}
        multiple
        treeCheckable
        treeCheckStrictly
        maxCount={3}
        treeData={treeData}
        onChange={onCheckChange}
        value={checkValue}
      />
    </>
  );
};
