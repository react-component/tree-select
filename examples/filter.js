/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import { gData } from './util';

class Demo extends React.Component {
  state = {
    value: '11',
    // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
    simpleTreeData: [
      { key: 1, pId: 0, label: 'a', value: 'a' },
      { key: 11, pId: 1, label: 'a12', value: 'a12', disabled: true },
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

  onChange = value => {
    const { simpleTreeData } = this.state;
    if (value.length === 1) {
      // return;
    }
    console.log('onChange', value, simpleTreeData);
    this.setState({ value });
  };

  onSelect = () => {
    // use onChange instead
    // console.log(arguments);
  };

  onDataChange = () => {
    const { simpleTreeData } = this.state;
    const data = simpleTreeData.slice();
    data.forEach(i => {
      if (i.key === 11) {
        delete i.disabled;
      }
      if (i.key === 20) {
        i.disabled = true;
      }
    });
    this.setState({ simpleTreeData: data });
  };

  render() {
    const { value, simpleTreeData, treeDataSimpleMode } = this.state;
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
          treeLine
          maxTagTextLength={10}
          value={value}
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
          treeLine
          maxTagTextLength={10}
          inputValue={null}
          value={value}
          treeData={simpleTreeData}
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          treeDataSimpleMode={treeDataSimpleMode}
          treeCheckable
          showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
        />
        <button type="button" onClick={this.onDataChange}>
          change data
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
