/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */

import 'rc-tree-select/assets/index.less';
import './demo.less';
import React from 'react';
import ReactDOM from 'react-dom';
import 'rc-dialog/assets/index.css';
import Dialog from 'rc-dialog';
import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';
import { gData } from './util';

function isLeaf(value) {
  if (!value) {
    return false;
  }
  let queues = [...gData];
  while (queues.length) { // BFS
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
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      if (selected === item.value) {
        sel.push(item);
        return;
      }
      if (item.children) {
        loop(selected, item.children, item);
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
    inputValue: '0-0-0-label',
    value: '0-0-0-value1',
    // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
    lv: { value: '0-0-0-value', label: 'spe label' },
    multipleValue: [],
    simpleTreeData: [
      { key: 1, pId: 0, label: 'test1', value: 'test1' },
      { key: 121, pId: 0, label: 'test1', value: 'test121' },
      { key: 11, pId: 1, label: 'test11', value: 'test11' },
      { key: 12, pId: 1, label: 'test12', value: 'test12' },
      { key: 111, pId: 11, label: 'test111', value: 'test111' },
    ],
    treeDataSimpleMode: {
      id: 'key',
      rootPId: 0,
    },
  }

  componentDidMount() {
    // console.log(this.refs.mul.getInputDOMNode());
    // this.refs.mul.getInputDOMNode().setAttribute('disabled', true);
  }

  onClick = () => {
    this.setState({
      visible: true,
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  onSearch = (value) => {
    console.log(value, arguments);
  }

  onChange = (value) => {
    console.log('onChange', arguments);
    this.setState({ value });
  }

  onChangeChildren = (value) => {
    console.log('onChangeChildren', arguments);
    const pre = value ? this.state.value : undefined;
    this.setState({ value: isLeaf(value) ? value : pre });
  }

  onChangeLV = (value) => {
    console.log('labelInValue', arguments);
    if (!value) {
      this.setState({ lv: undefined });
      return;
    }
    const path = findPath(value.value, gData).map(i => i.label).reverse().join(' > ');
    this.setState({ lv: { value: value.value, label: path } });
  }

  onMultipleChange = (value) => {
    console.log('onMultipleChange', arguments);
    this.setState({ multipleValue: value });
  }

  onSelect = () => {
    // use onChange instead
    console.log(arguments);
  }

  onDropdownVisibleChange = (visible, info) => {
    console.log(visible, this.state.value, info);
    if (Array.isArray(this.state.value) && this.state.value.length > 1
      && this.state.value.length < 3) {
      alert('please select more than two item or less than one item.');
      return false;
    }
    return true;
  }

  filterTreeNode = (input, child) => {
    return String(child.props.title).indexOf(input) === 0;
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>tree-select in dialog</h2>
        <button className="btn btn-primary" onClick={this.onClick}>show dialog</button>
        {this.state.visible ? <Dialog
          visible={this.state.visible}
          animation="zoom"
          maskAnimation="fade"
          onClose={this.onClose}
          style={{ width: 600, height: 400, overflow: 'auto' }}
          id="area"
        >
          <div style={{ height: 600, paddingTop: 100 }}>
            <TreeSelect
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              style={{ width: 300 }}
              transitionName="rc-tree-select-dropdown-slide-up"
              choiceTransitionName="rc-tree-select-selection__choice-zoom"
              dropdownStyle={{ maxHeight: 200, overflow: 'auto', zIndex: 1500 }}
              placeholder={<i>请下拉选择</i>}
              searchPlaceholder="please search"
              showSearch allowClear treeLine
              value={this.state.value}
              treeData={gData}
              treeNodeFilterProp="label"
              filterTreeNode={false}
              onSearch={this.onSearch}
              onChange={this.onChange}
              onSelect={this.onSelect}
            />
          </div>
        </Dialog> : null}
        <h2>single select</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch allowClear treeLine
          inputValue={this.state.inputValue}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onSearch={this.onSearch}
          open={this.state.tsOpen}
          onChange={(value) => {
            console.log('onChange', arguments);
            if (value === '0-0-0-0-value') {
              this.setState({ tsOpen: true });
            } else {
              this.setState({ tsOpen: false });
            }
            this.setState({ value });
          } }
          onDropdownVisibleChange={(v, info) => {
            console.log('single onDropdownVisibleChange', v, info);
            // document clicked
            if (info.documentClickClose && this.state.value === '0-0-0-0-value') {
              return false;
            }
            return true;
          } }
          onSelect={this.onSelect}
        />

        <h2>single select (just select children)</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch allowClear treeLine
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onChange={this.onChangeChildren}
        />

        <h2>single select (combobox)</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          combobox allowClear treeLine
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onChange={this.onChangeChildren}
          onSelect={this.onSelect}
          onSearch={this.onSearch}
        />

        <h2>multiple select</h2>
        <TreeSelect ref="mul"
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          multiple
          value={this.state.multipleValue}
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
          dropdownStyle={{ height: 200, overflow: 'auto' }}
          dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
          onDropdownVisibleChange={this.onDropdownVisibleChange}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine maxTagTextLength={10}
          value={this.state.value}
          inputValue={null}
          treeData={gData}
          treeNodeFilterProp="title"
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
        />

        <h2>labelInValue & show path</h2>
        <TreeSelect
          style={{ width: 500 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch allowClear treeLine
          value={this.state.lv} labelInValue
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onChange={this.onChangeLV}
        />

        <h2>use treeDataSimpleMode</h2>
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine maxTagTextLength={10}
          inputValue={'test111'}
          value={this.state.value}
          treeData={this.state.simpleTreeData}
          treeNodeFilterProp="title"
          treeDataSimpleMode={this.state.treeDataSimpleMode}
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
        />

        <h2>Testing in extreme conditions (Boundary conditions test) </h2>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue={'leaf1'} multiple treeCheckable showCheckedStrategy={SHOW_PARENT}
          treeDefaultExpandAll
          treeData={[
            { key: '', value: '', label: 'empty value', children: [] },
            {
              key: '0', value: '0', label: '0 label', children: [
                { key: '00', value: '00', label: '00 label', children: [] },
                { key: '01', value: '01', label: '01 label', children: [] },
              ],
            },
          ]}
          onChange={(val) => console.log(val, arguments)}
        />

        <h2>use TreeNode Component (not recommend)</h2>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue={'leaf1'}
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          filterTreeNode={this.filterTreeNode}
          onChange={(val) => console.log(val, arguments)}
        >
          <TreeNode value="" title="parent 1" key="">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-0">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" disabled />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="0-1-1">
              <TreeNode value="sss"
                title={<span style={{ color: 'red' }}>sss</span>} key="random3"
              />
              <TreeNode value="same value1" title="same txtle" key="0-1-1-1">
                <TreeNode value="same value10" title="same titlexd" key="0-1-1-1-0" />
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

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
