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
  onSelect(selectedValue, info) {
    console.log('onSelect: ', selectedValue, info);
    let newVal = [...this.state.value];

    function setNewVal(i) {
      let index = i;
      if (index > -1) {
        index = newVal.indexOf(info.node.props.value);
        if (index > -1) {
          newVal.splice(index, 1);
        }
      } else if (index === -1) {
        newVal.push(info.node.props.value);
      }
    }

    function getNode(arr, val) {
      let node;
      return arr.some(item => {
        if (item.key === val) {
          node = item.node;
          return true;
        }
      }) && node;
    }

    if (info.event === 'select') {
      setNewVal(info.selectedKeys.indexOf(info.node.props.eventKey));
    } else if (info.event === 'check') {
      newVal = [];
      info.filterAllCheckedKeys.forEach((item) => {
        const node = getNode(info.allCheckedNodesKeys, item);
        if (node) {
          newVal.push(node.props.value);
        } else if (info.node.props.eventKey === item) {
          newVal.push(info.node.props.value);
        }
      });
    }
    this.setState({
      value: newVal,
    });
  },
  onChange(value, label) {
    console.log('onChange ', value, label);
    // this.setState({
    //   value: value,
    // });
  },
  render() {
    const tProps = {
      value: this.state.value,
      onChange: this.onChange,
      onSelect: this.onSelect,
      multiple: true,
      treeCheckable: true,
      treeDefaultExpandAll: true,
      // treeNodeLabelProp: 'title',
    };
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} value={item.key} title={item.key + ' label'}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} value={item.key} title={item.key + ' label'} />;
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
