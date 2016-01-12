// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree-select/assets/demo.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import { gData, getFilterValue } from './util';

function getNode(arr, val) {
  let node;
  return arr.some(item => {
    if (item.key === val) {
      node = item.node;
      return true;
    }
  }) && node;
}

const Demo = React.createClass({
  propTypes: {
    multiple: PropTypes.bool,
    treeCheckable: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      multiple: true,
      treeCheckable: false,
    };
  },
  getInitialState() {
    return {
      value: [],
    };
  },
  onSelect(selectedValue, info) {
    console.log('onSelect: ', selectedValue, info);
    let newVal = [...this.state.value];

    if (info.event === 'select') {
      newVal = this.getSelectVal(newVal, info);
      this.event = 'select';
    } else if (info.event === 'check') {
      newVal = this.getCheckVal(newVal, info);
    }
    this.setState({
      value: newVal,
    });
  },
  onChange(value, label, preStateValue) {
    console.log('onChange ', value, label, this.state.value, preStateValue);
    if (this.event === 'select') {
      this.setState({
        value,
      });
      return;
    }
    const val = [...value];
    const sVal = preStateValue;
    const delVal = [...sVal];
    if (!val.every(item => {
      if (sVal.indexOf(item) > -1) {
        delVal.splice(delVal.indexOf(item), 1);
        return true;
      }
    })) {
      console.error('受控组件，改变（只允许删除）后的 value 需要是 state.value 的子集');
    }
    this.setState({
      value: getFilterValue(val, sVal, delVal),
    });
  },
  getSelectVal(val, info) {
    let newVal = val;
    let index = info.selectedKeys.indexOf(info.node.props.eventKey);
    if (index > -1) {
      index = newVal.indexOf(info.node.props.value);
      if (index > -1) {
        newVal.splice(index, 1);
      }
    } else if (index === -1) {
      if (this.props.multiple) {
        newVal.push(info.node.props.value);
      } else {
        newVal = [info.node.props.value];
      }
    }
    return newVal;
  },
  getCheckVal(val, info) {
    let newVal = val;
    newVal = [];
    info.filterAllCheckedKeys.forEach((item) => {
      const node = getNode(info.allCheckedNodesKeys, item);
      if (node) {
        newVal.push(node.props.value);
      } else if (info.node.props.eventKey === item) {
        newVal.push(info.node.props.value);
      }
    });
    return newVal;
  },
  render() {
    const tProps = {
      value: this.state.value,
      onChange: this.onChange,
      onSelect: this.onSelect,
      multiple: this.props.multiple,
      treeCheckable: this.props.treeCheckable,
      treeDefaultExpandAll: true,
    };
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} value={item.value} title={item.key + ' label'}>{loop(item.children)}</TreeNode>;
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
