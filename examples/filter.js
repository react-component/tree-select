/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import { gData } from './util';

const Demo = React.createClass({
  getInitialState() {
    return {
      value: '11',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      simpleTreeData: [
        { key: 1, pId: 0, label: 'a', value: 'a' },
        { key: 11, pId: 1, label: 'a12', value: 'a12' },
        { key: 111, pId: 11, label: 'a00', value: 'a00', selectable: false },
        { key: 2, pId: 0, label: 'b', value: 'b' },
        { key: 20, pId: 2, label: 'b10', value: 'b10' },
        { key: 21, pId: 2, label: 'b1', value: 'b1' },
        { key: 22, pId: 2, label: 'b12', value: 'b12' },
      ],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0,
      },
    };
  },
  onChange(value) {
    if (value.length === 1) {
      return;
    }
    console.log('onChange', arguments, this.state.simpleTreeData);
    this.setState({ value });
  },
  onSelect() {
    // use onChange instead
    // console.log(arguments);
  },
  onDataChange() {
    const data = [...this.state.simpleTreeData];
    this.setState({ simpleTreeData: data });
  },
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>check select</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ height: 200, overflow: 'auto' }}
          dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine maxTagTextLength={10}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="title"
          treeCheckable
          onChange={this.onChange}
          onSelect={this.onSelect}
        />

        <h2>use treeDataSimpleMode</h2>
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine maxTagTextLength={10}
          inputValue={'a'}
          value={this.state.value}
          treeData={this.state.simpleTreeData}
          treeNodeFilterProp="title"
          treeDataSimpleMode={this.state.treeDataSimpleMode}
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
        />
        <button onClick={this.onDataChange}>change data</button>
      </div>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
