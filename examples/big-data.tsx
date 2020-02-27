import '../assets/index.less';
import React from 'react';
import TreeSelect, { SHOW_PARENT } from '../src';
import Gen from './utils/big-data-generator';

class Demo extends React.Component {
  state = {
    gData: [],
    gData1: [],
    value: '',
    value1: '',
  };

  onChange = value => {
    console.log('onChange', value);
    this.setState({ value });
  };

  onChangeStrictly = value1 => {
    console.log('onChangeStrictly', value1);
    const ind = parseInt(`${Math.random() * 3}`, 10);
    value1.push({
      value: `0-0-0-${ind}-value`,
      label: `0-0-0-${ind}-label`,
      halfChecked: true,
    });
    this.setState({
      value1,
    });
  };

  onGen = data => {
    this.setState({
      gData: data,
      gData1: [...data],
      value: '0-0-0-value',
      value1: [
        { value: '0-0-value', label: '0-0-label', halfChecked: true },
        { value: '0-0-0-value', label: '0-0-0-label' },
      ],
    });
  };

  render() {
    const { value1, gData1, value, gData } = this.state;

    // console.log('>>>', gData, gData1, value1);

    return (
      <div style={{ padding: '0 20px' }}>
        <Gen onGen={this.onGen} />
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 20 }}>
            <h3>normal check</h3>
            <TreeSelect
              style={{ width: 300 }}
              // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={gData}
              treeLine
              value={value}
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
              // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={gData1}
              treeLine
              value={value1}
              placeholder={<i>请下拉选择</i>}
              treeCheckable
              treeCheckStrictly
              showCheckedStrategy={SHOW_PARENT}
              onChange={this.onChangeStrictly}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
