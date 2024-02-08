import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

const treeData = [
  { key: '0', value: '0', title: 'label0' },
  { key: '1', value: '1', title: 'label1' },
];

const createSelect = props => <TreeSelect treeData={treeData} labelInValue {...props} />;

export default () =>
  createSelect({
    maxTagCount: 1,
    defaultValue: {
      value: '0',
      label: '2333',
    },
  });
