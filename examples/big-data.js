/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import Gen from './big-data-generator';
import './demo.less';

class Demo extends React.Component {
  state = {
    gData: [],
    gData1: [],
    value: '',
    value1: '',
  }

  onChange = (value) => {
    console.log('onChange', arguments);
    this.setState({ value });
  }

  onChangeStrictly = (value1) => {
    console.log('onChangeStrictly', arguments);
    const ind = parseInt(Math.random() * 3, 10);
    value1.push({ value: `0-0-0-${ind}-value`, label: `0-0-0-${ind}-label`, halfChecked: true });
    this.setState({
      value1,
    });
  }

  onGen = (data) => {
    this.setState({
      gData: data,
      gData1: [...data],
      value: '0-0-0-value',
      value1: [
        { value: '0-0-value', label: '0-0-label', halfChecked: true },
        { value: '0-0-0-value', label: '0-0-0-label' },
      ],
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
    });
  }

  render() {
    return (<div style={{ padding: '0 20px' }}>
      <Gen onGen={this.onGen} />
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 20 }}>
          <h3>normal check</h3>
          <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
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
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
            treeData={this.state.gData1} treeLine
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
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
