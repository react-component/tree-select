// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree-select/assets/demo.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import { gData } from './util';

const Demo = React.createClass({
  getInitialState() {
    return {
      value: ['0-0'],
    };
  },
  onSelect(selectedKey, node, selectedKeys) {
    console.log('selected: ', selectedKey, selectedKeys);
    this.setState({
      value: selectedKeys,
    });
  },
  onChange(value) {
    console.log('selected ' + value);
    this.setState({
      value: value,
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
    const tProps = {
      // defaultValue: this.state.value,
      value: this.state.value,
      onChange: this.onChange,
      onSelect: this.onSelect,
      multiple: true,
      treeCheckable: true,
      treeDefaultExpandAll: true,
    };
    return (<div style={{padding: '10px 30px'}}>
      <h3>more</h3>
      <TreeSelect style={{width: 300}} {...tProps}>
        {loop(gData)}
      </TreeSelect>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
