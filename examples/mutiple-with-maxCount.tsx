import React from 'react';
import TreeSelect from '../src';

export default () => {
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
  const onChange = () => {};

  return (
    <TreeSelect
      style={{ width: 300 }}
      multiple
      maxCount={3}
      treeData={treeData}
      onChange={onChange}
    />
  );
};
