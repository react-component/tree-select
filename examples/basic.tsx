import '../assets/index.less';
import React from 'react';
import 'rc-dialog/assets/index.css';
import Dialog from 'rc-dialog';
import TreeSelect, { TreeNode, SHOW_PARENT } from '../src';
import { gData } from './utils/dataUtil';

function isLeaf(value) {
  if (!value) {
    return false;
  }
  let queues = [...gData];
  while (queues.length) {
    // BFS
    const item = queues.shift();
    if (item.value === value) {
      if (!item.children) {
        return true;
      }
      return false;
    }
    if (item.children) {
      queues = queues.concat(item.children);
    }
  }
  return false;
}

function findPath(value, data) {
  const sel = [];
  function loop(selected, children) {
    for (let i = 0; i < children.length; i += 1) {
      const item = children[i];
      if (selected === item.value) {
        sel.push(item);
        return;
      }
      if (item.children) {
        loop(selected, item.children);
        if (sel.length) {
          sel.push(item);
          return;
        }
      }
    }
  }
  loop(value, data);
  return sel;
}

class Demo extends React.Component {
  state = {
    tsOpen: false,
    visible: false,
    searchValue: '0-0-0-label',
    value: '0-0-0-value1',
    // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
    lv: { value: '0-0-0-value', label: 'spe label' },
    multipleValue: [],
    simpleSearchValue: 'test111',
    simpleTreeData: [
      { key: 1, pId: 0, label: 'test1', value: 'test1' },
      { key: 121, pId: 0, label: 'test2', value: 'test2' },
      { key: 11, pId: 1, label: 'test11', value: 'test11' },
      { key: 12, pId: 1, label: 'test12', value: 'test12' },
      { key: 111, pId: 11, label: 'test111', value: 'test111' },
    ],
    treeDataSimpleMode: {
      id: 'key',
      rootPId: 0,
    },
  };

  onClick = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch = (value, ...args) => {
    console.log('Do Search:', value, ...args);
    this.setState({ searchValue: value });
  };

  onChange = (value, ...rest) => {
    console.log('onChange', value, ...rest);
    this.setState({ value });
  };

  onChangeChildren = (...args) => {
    const { value: preValue } = this.state;
    console.log('onChangeChildren', ...args);
    const value = args[0];
    const pre = value ? preValue : undefined;
    this.setState({ value: isLeaf(value) ? value : pre });
  };

  onChangeLV = (value, ...args) => {
    console.log('labelInValue', value, ...args);
    if (!value) {
      this.setState({ lv: undefined });
      return;
    }
    const path = findPath(value.value, gData)
      .map(i => i.label)
      .reverse()
      .join(' > ');
    this.setState({ lv: { value: value.value, label: path } });
  };

  onMultipleChange = value => {
    console.log('onMultipleChange', value);
    this.setState({ multipleValue: value });
  };

  onSelect = (...args) => {
    // use onChange instead
    console.log(args);
  };

  onDropdownVisibleChange = visible => {
    const { value } = this.state;
    console.log(visible, value);
    if (Array.isArray(value) && value.length > 1 && value.length < 3) {
      window.alert('please select more than two item or less than one item.');
      return false;
    }
    return true;
  };

  filterTreeNode = (input, child) => String(child.props.title).indexOf(input) === 0;

  render() {
    const {
      visible,
      value,
      searchValue,
      tsOpen,
      multipleValue,
      lv,
      simpleTreeData,
      simpleSearchValue,
      treeDataSimpleMode,
    } = this.state;
    return (
      <div style={{ margin: 20 }}>
        <h2>tree-select in dialog</h2>
        <button type="button" className="btn btn-primary" onClick={this.onClick}>
          show dialog
        </button>
        {visible ? (
          <Dialog
            visible={visible}
            animation="zoom"
            maskAnimation="fade"
            onClose={this.onClose}
            // style={{ width: 600, height: 400, overflow: 'auto' }}
          >
            <div style={{ height: 600, paddingTop: 100 }}>
              <TreeSelect
                getPopupContainer={triggerNode => triggerNode.parentNode}
                style={{ width: 300 }}
                transitionName="rc-tree-select-dropdown-slide-up"
                choiceTransitionName="rc-tree-select-selection__choice-zoom"
                // dropdownStyle={{ maxHeight: 200, overflow: 'auto', zIndex: 1500 }}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                showSearch
                allowClear
                treeLine
                value={value}
                treeData={gData}
                treeNodeFilterProp="label"
                filterTreeNode={false}
                onSearch={this.onSearch}
                onChange={this.onChange}
                onSelect={this.onSelect}
              />
            </div>
          </Dialog>
        ) : null}
        <h2>single select</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch
          allowClear
          treeLine
          searchValue={searchValue}
          value={value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onSearch={this.onSearch}
          open={tsOpen}
          onChange={(val, ...args) => {
            console.log('onChange', val, ...args);
            this.setState({ value: val });
          }}
          onDropdownVisibleChange={v => {
            console.log('single onDropdownVisibleChange', v);
            this.setState({
              tsOpen: v,
            });
          }}
          onSelect={this.onSelect}
        />

        <h2>single select (just select children)</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch
          allowClear
          treeLine
          value={value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onChange={this.onChangeChildren}
        />

        <h2>multiple select</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          multiple
          value={multipleValue}
          treeData={gData}
          treeNodeFilterProp="title"
          onChange={this.onMultipleChange}
          onSelect={this.onSelect}
          allowClear
        />

        <h2>check select</h2>
        <TreeSelect
          className="check-select"
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          style={{ width: 300 }}
          // dropdownStyle={{ height: 200, overflow: 'auto' }}
          dropdownPopupAlign={{
            overflow: { adjustY: 0, adjustX: 0 },
            offset: [0, 2],
          }}
          onDropdownVisibleChange={this.onDropdownVisibleChange}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine
          maxTagTextLength={10}
          value={value}
          autoClearSearchValue
          treeData={gData}
          treeNodeFilterProp="title"
          treeCheckable
          showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
          maxTagCount="responsive"
          maxTagPlaceholder={valueList => {
            console.log('Max Tag Rest Value:', valueList);
            return `${valueList.length} rest...`;
          }}
        />

        <h2>labelInValue & show path</h2>
        <TreeSelect
          style={{ width: 500 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch
          allowClear
          treeLine
          value={lv}
          labelInValue
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onChange={this.onChangeLV}
        />

        <h2>use treeDataSimpleMode</h2>
        <TreeSelect
          style={{ width: 300 }}
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          // searchPlaceholder="please search"
          // treeLine
          maxTagTextLength={10}
          searchValue={simpleSearchValue}
          onSearch={val => {
            this.setState({ simpleSearchValue: val });
          }}
          value={value}
          treeData={simpleTreeData}
          treeNodeFilterProp="title"
          treeDataSimpleMode={treeDataSimpleMode}
          treeCheckable
          showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={(...args) => {
            this.setState({ simpleSearchValue: '' });
            this.onSelect(...args);
          }}
        />

        <h2>Testing in extreme conditions (Boundary conditions test) </h2>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue="leaf1"
          multiple
          treeCheckable
          showCheckedStrategy={SHOW_PARENT}
          treeDefaultExpandAll
          treeData={[
            { key: '', value: '', label: 'empty value', children: [] },
            {
              key: '0',
              value: '0',
              label: '0 label',
              children: [
                { key: '00', value: '00', label: '00 label', children: [] },
                { key: '01', value: '01', label: '01 label', children: [] },
              ],
            },
          ]}
          onChange={(val, ...args) => console.log(val, ...args)}
        />

        <h2>use TreeNode Component (not recommend)</h2>
        <TreeSelect
          style={{ width: 200 }}
          // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue="leaf1"
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          filterTreeNode={this.filterTreeNode}
          onChange={(val, ...args) => console.log(val, ...args)}
        >
          <TreeNode value="" title="parent 1" key="">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-0">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" disabled />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="0-1-1">
              <TreeNode
                value="sss"
                title={<span style={{ color: 'red' }}>sss</span>}
                key="random3"
              />
              <TreeNode value="same value1" title="same txtle" key="0-1-1-1">
                <TreeNode
                  value="same value10"
                  title="same titlexd"
                  key="0-1-1-1-0"
                  style={{ color: 'red', background: 'green' }}
                />
              </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode value="same value2" title="same title" key="0-2">
            <TreeNode value="2same value" title="2same title" key="0-2-0" />
          </TreeNode>
          <TreeNode value="same value3" title="same title" key="0-3" />
        </TreeSelect>
      </div>
    );
  }
}

export default Demo;
