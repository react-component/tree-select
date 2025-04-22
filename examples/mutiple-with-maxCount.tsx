import React, { useState } from 'react';
import TreeSelect from '../src';

export default () => {
  const [value, setValue] = useState<string[]>();
  const [checkValue, setCheckValue] = useState<string[]>();

  const treeData = [
    {
      title: 'Parent 1',
      value: 'parent1',
      children: [
        {
          title: 'Child 1-1',
          value: 'child1-1',
        },
        {
          title: 'Child 1-2',
          value: 'child1-2',
          children: [
            {
              title: 'Child 1-2-1',
              value: 'child1-2-1',
              children: [
                {
                  title: 'child 1-2-1-1',
                  value: 'child1-2-1-1',
                  children: [
                    {
                      title: 'child 1-2-1-1-1',
                      value: 'child1-2-1-1-1',
                    },
                  ],
                },
                {
                  title: 'child 1-2-1-2',
                  value: 'child1-2-1-2',
                },
                {
                  title: 'child 1-2-1-3',
                  value: 'child1-2-1-3',
                },
              ],
            },
            {
              title: 'Child 1-2-2',
              value: 'child1-2-2',
            },
            {
              title: 'Child 1-2-3',
              value: 'child1-2-3',
            },
            {
              title: 'Child 1-2-4',
              value: 'child1-2-4',
            },
          ],
        },
      ],
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
      <h2>maxCount = 3</h2>
      <TreeSelect
        style={{ width: 300 }}
        treeCheckable
        multiple
        // showCheckedStrategy="SHOW_ALL"
        // showCheckedStrategy="SHOW_PARENT"
        maxCount={3}
        treeData={treeData}
        onChange={onChange}
        value={value}
      />
    </>
  );
};
