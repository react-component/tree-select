// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree-select/assets/demo.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import { gData } from './util';

const Demo = React.createClass({
  propTypes: {
    multiple: PropTypes.bool,
    treeCheckable: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      multiple: true,
      treeCheckable: true,
    };
  },
  getInitialState() {
    return {
      value: undefined,
    };
  },
  onChange(value) {
    console.log('onChange ', value);
    // can filter parent node if all its children is included
    this.setState({
      value,
    });
  },
  render() {
    const tProps = {
      value: this.state.value,
      onChange: this.onChange,
      multiple: this.props.multiple,
      treeCheckable: this.props.treeCheckable,
      treeDefaultExpandAll: true,
    };
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return (<TreeNode key={item.key} value={item.value}
                           title={item.key + ' label'}>{loop(item.children)}</TreeNode>);
        }
        return <TreeNode key={item.key} value={item.value} title={item.key + ' label'} />;
      });
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
