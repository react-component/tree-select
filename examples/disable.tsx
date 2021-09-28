import '../assets/index.less';
import React from 'react';
import TreeSelect from '../src';

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    label: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        label: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    label: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        label: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        label: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        label: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

class Demo extends React.Component {
  state = {
    value: ['0-0-0'],
    disabled: false,
  };

  onChange = (value, ...args) => {
    console.log('onChange ', value, args);
    this.setState({ value });
  };

  switch = checked => {
    this.setState({ disabled: checked });
  };

  render() {
    const { disabled, value } = this.state;
    const tProps = {
      treeData,
      disabled,
      value,
      onChange: this.onChange,
      multiple: true,
      allowClear: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
    };
    return (
      <div>
        <TreeSelect {...tProps} />
        <input type="checkbox" onChange={e => this.switch(e.target.checked)} /> 禁用
      </div>
    );
  }
}

export default Demo;
/* eslint-enable */
