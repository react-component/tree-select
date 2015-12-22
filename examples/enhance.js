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
      visible: false,
      sel: '',
    };
  },
  onVisibleChange(visible) {
    this.setState({
      visible: visible
    });
  },
  handleSelect(info) {
    console.log('selected: ', info);
    this.setState({
      visible: false,
      sel: info.node.props.title,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    const overlay = (<Tree defaultExpandAll={false}
          onSelect={this.handleSelect}>
      {loop(gData)}
    </Tree>);

    return (<div style={{padding:'10px 30px'}}>
      <h3>with tree</h3>
      <TreeSelect trigger={['click']}
         onVisibleChange={this.onVisibleChange}
         visible={this.state.visible}
         closeOnSelect={false}
         overlay={overlay} animation="slide-up">
        <input key={Date.now()} placeholder="选择岗位节点" defaultValue={this.state.sel} readOnly />
      </TreeSelect>
    </div>);
  }
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
