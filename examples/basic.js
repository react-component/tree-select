/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import './demo.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';
import { gData } from './util';

const Demo = React.createClass({
  getInitialState() {
    return {
      value: '0-0-0-value',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      multipleValue: [],
    };
  },
  onChange(value) {
    console.log('onChange', value, arguments);
    this.setState({value});
  },
  onMultipleChange(value) {
    console.log('onMultipleChange', value);
    this.setState({multipleValue: value});
  },
  render() {
    return (
      <div style={{margin: 20}}>
        <h2>single select</h2>
        <TreeSelect style={{width: 300}}
                    dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                    treeData={gData} showSearch allowClear treeLine
                    value={this.state.value}
                    treeDefaultExpandAll={false}
                    placeholder={<i>请下拉选择</i>}
                    searchPlaceholder="please search"
                    treeNodeFilterProp="label"
                    onChange={this.onChange} />

        <h2>multiple select</h2>
        <TreeSelect style={{width: 300}}
                    dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                    treeData={gData}
                    value={this.state.multipleValue}
                    treeDefaultExpandAll={false}
                    placeholder={<i>请下拉选择</i>}
                    searchPlaceholder="please search"
                    treeNodeFilterProp="title"
                    multiple
                    dropdownPopupAlign={{offset: [0, 0]}}
                    onChange={this.onMultipleChange} />

        <h2>check select</h2>
        <TreeSelect style={{width: 300}}
                    dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                    treeData={gData} treeLine
                    value={this.state.value}
                    treeDefaultExpandAll={false}
                    placeholder={<i>请下拉选择</i>}
                    searchPlaceholder="please search"
                    treeNodeFilterProp="title"
                    treeCheckable
                    showCheckedStrategy={SHOW_PARENT}
                    onChange={this.onChange} />

        <h2>use TreeNode Component (not recommend)</h2>
        <TreeSelect style={{width: 200}}
                    dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                    value={this.state.value || 'leaf1'}
                    treeDefaultExpandAll
                    onChange={this.onChange}>
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf my leaf my leaf" key="random" />
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
