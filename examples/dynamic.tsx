import '../assets/index.less';
import React from 'react';
import TreeSelect from '../src';
import { getNewTreeData, generateTreeNodes } from './utils/dataUtil';

class Demo extends React.Component {
  static propTypes = {};

  state = {
    treeData: [
      { label: 'pNode 01', value: '0-0', key: '0-0' },
      { label: 'pNode 02', value: '0-1', key: '0-1' },
      { label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true },
    ],
    // value: '0-0',
    value: { value: '0-0-0-value', label: '0-0-0-label' },
  };

  onChange = value => {
    console.log(value);
    this.setState({
      value,
    });
  };

  onLoadData = treeNode => {
    console.log('trigger load:', treeNode);
    return new Promise(resolve => {
      setTimeout(() => {
        let { treeData } = this.state;
        treeData = treeData.slice();
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        this.setState({ treeData });
        resolve();
      }, 500);
    });
  };

  render() {
    const { treeData, value } = this.state;
    return (
      <div style={{ padding: '10px 30px' }}>
        <h2>dynamic render</h2>
        <TreeSelect
          style={{ width: 300 }}
          treeData={treeData}
          labelInValue
          value={value}
          onChange={this.onChange}
          loadData={this.onLoadData}
        />
        <h2>show search</h2>
        <TreeSelect
          style={{ width: 300 }}
          treeData={treeData}
          labelInValue
          showSearch
          value={value}
          onChange={this.onChange}
          loadData={this.onLoadData}
        />
      </div>
    );
  }
}

export default Demo;
