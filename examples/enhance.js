// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree/assets/index.css';
import TreeSelect from 'rc-tree-select';
import Tree, {TreeNode} from 'rc-tree';
import { gData } from './util';
import React from 'react';
import ReactDOM from 'react-dom';

const Demo = React.createClass({
  getInitialState() {
    return {
    };
  },
  onSelect(info) {
    console.log('selected: ', info);
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
    };
    return (<div style={{padding:'10px 30px'}}>
      <h3></h3>
      <TreeSelect style={{width: 300}} onSelect={this.onSelect} multiple treeProps={treeProps}>
        {loop(gData)}
      </TreeSelect>
    </div>);
  }
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
