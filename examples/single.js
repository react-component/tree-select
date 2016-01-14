/* eslint no-console: 0 */

import 'rc-tree-select/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';

const Demo = React.createClass({
  getInitialState() {
    return {
      value: 'leaf1',
    };
  },
  onChange(e, label, preStateValue) {
    console.log(e, label, this.state.value, preStateValue);
    let value;
    if (e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({value});
  },
  onSearch(value) {
    console.log('onSearch', value);
  },
  onClick(e) {
    console.log('onClick', 'do your self', e);
  },
  render() {
    return (
      <div style={{margin: 20}}>
        <h2>Single Select</h2>
        <TreeSelect style={{width: 300}}
                    dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                    value={this.state.value} treeNodeLabelProp="title"
                    treeDefaultExpandAll
                    onClick={this.onClick}
                    onSearch={this.onSearch}
                    onChange={this.onChange}>
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" disabled />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<span style={{color: 'red'}}>sss</span>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      </div>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
