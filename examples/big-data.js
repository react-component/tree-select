/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import './demo.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import Gen from './big-data-generator';

const Demo = React.createClass({
  getInitialState() {
    return {
      gData: [],
      value: '',
      value1: '',
    };
  },
  onChange(value) {
    console.log('onChange', arguments);
    this.setState({value});
  },
  onChangeStrictly(value1) {
    console.log('onChangeStrictly', arguments);
    this.setState({value1});
  },
  onGen(data) {
    this.setState({
      gData: data,
      value: '0-0-0-value',
      value1: '0-0-0-value',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
    });
  },
  render() {
    return (<div style={{padding: '0 20px'}}>
      <Gen onGen={this.onGen} />
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 20 }}>
          <h3>normal check</h3>
          <TreeSelect
            style={{width: 300}}
            dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
            treeData={this.state.gData} treeLine
            value={this.state.value}
            placeholder={<i>请下拉选择</i>}
            treeCheckable
            showCheckedStrategy={SHOW_PARENT}
            onChange={this.onChange}
          />
        </div>
        <div>
          <h3>checkStrictly</h3>
          <TreeSelect
            style={{width: 300}}
            dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
            treeData={this.state.gData} treeLine
            value={this.state.value1}
            placeholder={<i>请下拉选择</i>}
            treeCheckable
            treeCheckStrictly
            showCheckedStrategy={SHOW_PARENT}
            onChange={this.onChangeStrictly}
          />
        </div>
      </div>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
