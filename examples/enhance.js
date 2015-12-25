// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree/assets/index.css';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import { gData } from './util';
import React from 'react';
import ReactDOM from 'react-dom';

const Demo = React.createClass({
  getInitialState() {
    return {
      value: [],
    };
  },
  onDeselect(selectedValue) {
    console.log('onDeselect', selectedValue);
    const newVal = [...this.state.value];
    newVal.splice(newVal.indexOf(selectedValue), 1);
    this.setState({
      value: newVal,
    });
  },
  onSelect(selectedKey, node, selectedKeys) {
    console.log('selected: ', selectedKey, selectedKeys);
    this.setState({
      value: selectedKeys,
    });
  },
  onCheck(info) {
    console.log('onCheck:', info);
    this.setState({
      value: info.checkedKeys,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} value={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} value={item.key} title={item.key} />;
      });
    };
    const treeProps = {
      showIcon: false,
      showLine: true,
      checkable: true,
      defaultCheckedKeys: this.state.value,
      defaultSelectedKeys:  this.state.value,
      // selectedKeys:  this.state.value,
      // checkedKeys: this.state.value,
      onCheck: this.onCheck,
    };
    return (<div style={{padding: '10px 30px'}}>
      <h3>more</h3>
      <TreeSelect style={{width: 300}} value={this.state.value} multiple treeProps={treeProps}
        onSelect={this.onSelect} onDeselect={this.onDeselect}>
        {loop(gData)}
      </TreeSelect>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
