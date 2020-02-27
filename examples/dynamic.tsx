import '../assets/index.less';
import React from 'react';
import TreeSelect from '../src';
import { getNewTreeData, generateTreeNodes } from './utils/dataUtil';

function getTreeData() {
  return [
    { label: 'pNode 01', value: '0-0', key: '0-0' },
    { label: 'pNode 02', value: '0-1', key: '0-1' },
    { label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true },
  ];
}

class Demo extends React.Component {
  static propTypes = {};

  state = {
    treeData: getTreeData(),
    // value: '0-0',
    value: { value: '0-0-0-value', label: '0-0-0-label' },
    loadedKeys: [],
  };

  onChange = value => {
    console.log(value);
    this.setState({
      value,
    });
  };

  loadData = treeNode => {
    console.log('trigger load:', treeNode);
    return new Promise(resolve => {
      setTimeout(() => {
        let { treeData } = this.state;
        treeData = treeData.slice();
        getNewTreeData(
          treeData,
          treeNode.props.eventKey,
          generateTreeNodes(treeNode),
          2,
        );
        this.setState({ treeData });
        resolve();
      }, 500);
    });
  };

  onTreeLoad = loadedKeys => {
    this.setState({ loadedKeys });
  };

  onResetTree = () => {
    this.setState({
      treeData: getTreeData(),
    });
  };

  onResetLoadedKeys = () => {
    this.setState({
      loadedKeys: [],
    });
  };

  render() {
    const { treeData, value, loadedKeys } = this.state;
    return (
      <div style={{ padding: '10px 30px' }}>
        <h2>dynamic render</h2>
        <TreeSelect
          style={{ width: 300 }}
          treeData={treeData}
          labelInValue
          value={value}
          onChange={this.onChange}
          loadData={this.loadData}
        />
        <h2>Controlled</h2>
        <TreeSelect
          style={{ width: 300 }}
          treeData={treeData}
          labelInValue
          showSearch
          value={value}
          treeLoadedKeys={loadedKeys}
          onChange={this.onChange}
          loadData={this.loadData}
          onTreeLoad={this.onTreeLoad}
        />

        <button type="button" onClick={this.onResetTree}>
          Reset Tree
        </button>
        <button type="button" onClick={this.onResetLoadedKeys}>
          Reset LoadedKeys
        </button>
      </div>
    );
  }
}

export default Demo;
