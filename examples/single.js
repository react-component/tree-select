/* eslint no-console: 0 */

import 'rc-tree-select/assets/index.less';
import 'rc-tree/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';

const Test = React.createClass({
  getInitialState() {
    return {
      value: '1',
    };
  },
  onChange(e) {
    let value;
    if (e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({value});
  },
  render() {
    return (
      <div style={{margin: 20}}>
        <h2>Single Select</h2>
        <TreeSelect style={{width: 300}}
              value={this.state.value}
              dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
              treeProps={{defaultExpandAll: true}}
              onChange={this.onChange}>
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf" title="leaf" key="random" />
              <TreeNode value="leaf" title="leaf" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1">
              <TreeNode value="sss" title={<span style={{color: 'red'}}>sss</span>} />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      </div>
    );
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
