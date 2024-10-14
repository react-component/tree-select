import '../assets/index.less';
import React from 'react';
import 'rc-dialog/assets/index.css';
import TreeSelect from '../src';

export default () => {
  return (
    <div>
      <h2>basic</h2>
      <TreeSelect
        treeDefaultExpandAll
        treeData={[
          {
            myLabel: 'Parent',
            myValue: 'parent',
            myChildren: [
              {
                myLabel: 'Sub 1',
                myValue: 'sub_1',
              },
              {
                myLabel: 'Sub 2',
                myValue: 'sub_2',
              },
            ],
          },
        ]}
        fieldNames={{
          label: 'myLabel',
          value: 'myValue',
          children: 'myChildren',
        }}
      />

      <h2>title render</h2>
      <TreeSelect
        treeDefaultExpandAll
        treeTitleRender={node => <span>{node.myLabel}</span>}
        treeData={[
          {
            myLabel: 'Parent',
            myValue: 'parent',
            myChildren: [
              {
                myLabel: 'Sub 1',
                myValue: 'sub_1',
              },
              {
                myLabel: 'Sub 2',
                myValue: 'sub_2',
              },
            ],
          },
        ]}
        fieldNames={{
          label: 'myLabel',
          value: 'myValue',
          children: 'myChildren',
        }}
      />
    </div>
  );
};
