/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */

import 'rc-tree-select/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import 'rc-dialog/assets/index.css';
import Dialog from 'rc-dialog';
import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';
import { gData } from './util';
import './demo.less';

const bubblePath = 'M632 888H392c-4.4 0-8 3.6-8 8v32c0 ' +
  '17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-3' +
  '2c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-3' +
  '28 328 0 121.4 66 227.4 164 284.1V792c0 17.7 1' +
  '4.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98' +
  '-56.7 164-162.7 164-284.1 0-181.1-146.9-328-32' +
  '8-328z m127.9 549.8L604 634.6V752H420V634.6l-3' +
  '5.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4' +
  ' 114.6-256 256-256s256 114.6 256 256c0 92.5-49' +
  '.4 176.3-128.1 221.8z';

const clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' +
  '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' +
  '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' +
  ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' +
  '28.7 64-64V306c0-35.3-28.7-64-64-64z';

const arrowPath = 'M765.7 486.8L314.9 134.7c-5.3-4.1' +
  '-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l36' +
  '0 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6' +
  '.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-3' +
  '7.6 0-50.4z';

const getSvg = (path, iStyle = {}, style = {}) => {
  return (
    <i style={iStyle}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{ verticalAlign: '-.125em', ...style }}
      >
        <path d={path} />
      </svg>
    </i>
  );
}


const switcherIcon = (obj) => {
  if (obj.isLeaf) {
    return getSvg(arrowPath,
      { cursor: 'pointer', backgroundColor: 'white' },
      { transform: 'rotate(270deg)' });
  }
  return getSvg(arrowPath,
    { cursor: 'pointer', backgroundColor: 'white' },
    { transform: `rotate(${obj.expanded ? 90 : 0}deg)` });
};

const inputIcon = getSvg(bubblePath);
const clearIcon = getSvg(clearPath);
const removeIcon = getSvg(clearPath);

const iconProps = {
  inputIcon,
  clearIcon,
  removeIcon,
  switcherIcon,
};

const iconPropsFunction = {
  inputIcon: () => inputIcon,
  clearIcon: () => clearIcon,
  removeIcon: () => removeIcon,
  switcherIcon,
};

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
    this.setState({ searchValue: value });
  }

  onChange = (value, ...rest) => {
    console.log('onChange', value, ...rest);
    this.setState({ value });
  }

  onChangeChildren = (...args) => {
    console.log('onChangeChildren', ...args);
    const value = args[0];
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
      window.alert('please select more than two item or less than one item.');
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
              {...iconProps}
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
          searchValue={this.state.searchValue}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onSearch={this.onSearch}
          open={this.state.tsOpen}
          onChange={(value, ...args) => {
            console.log('onChange', value, ...args);
            if (value === '0-0-0-0-value') {
              this.setState({ tsOpen: true });
            } else {
              this.setState({ tsOpen: false });
            }
            this.setState({ value });
          }}
          onDropdownVisibleChange={(v, info) => {
            console.log('single onDropdownVisibleChange', v, info);
            // document clicked
            if (info.documentClickClose && this.state.value === '0-0-0-0-value') {
              return false;
            }
            this.setState({
              tsOpen: v,
            });
            return true;
          }}
          onSelect={this.onSelect}
          {...iconProps}
        />

        <h2>single select with function icon</h2>
        <TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          showSearch allowClear treeLine
          searchValue={this.state.searchValue}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          filterTreeNode={false}
          onSearch={this.onSearch}
          open={this.state.tsOpen}
          onChange={(value, ...args) => {
            console.log('onChange', value, ...args);
            if (value === '0-0-0-0-value') {
              this.setState({ tsOpen: true });
            } else {
              this.setState({ tsOpen: false });
            }
            this.setState({ value });
          }}
          onDropdownVisibleChange={(v, info) => {
            console.log('single onDropdownVisibleChange', v, info);
            // document clicked
            if (info.documentClickClose && this.state.value === '0-0-0-0-value') {
              return false;
            }
            this.setState({
              tsOpen: v,
            });
            return true;
          }}
          onSelect={this.onSelect}
          {...iconPropsFunction}
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
          {...iconProps}
        />

        <h2>multiple select</h2>
        <TreeSelect
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
          {...iconProps}
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
          autoClearSearchValue
          treeData={gData}
          treeNodeFilterProp="title"
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
          maxTagCount={2}
          maxTagPlaceholder={(valueList) => {
            console.log('Max Tag Rest Value:', valueList);
            return `${valueList.length} rest...`
          }}
          {...iconProps}
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
          {...iconProps}
        />

        <h2>use treeDataSimpleMode</h2>
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          treeLine maxTagTextLength={10}
          searchValue={this.state.simpleSearchValue}
          onSearch={(simpleSearchValue) => {
            this.setState({ simpleSearchValue });
          }}
          value={this.state.value}
          treeData={this.state.simpleTreeData}
          treeNodeFilterProp="title"
          treeDataSimpleMode={this.state.treeDataSimpleMode}
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange}
          onSelect={this.onSelect}
          {...iconProps}
        />

        <h2>Testing in extreme conditions (Boundary conditions test) </h2>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue="leaf1" multiple treeCheckable showCheckedStrategy={SHOW_PARENT}
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
          onChange={(val, ...args) => console.log(val, ...args)}
          {...iconProps}
        />

        <h2>use TreeNode Component (not recommend)</h2>
        <TreeSelect
          style={{ width: 200 }}
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          defaultValue="leaf1"
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          filterTreeNode={this.filterTreeNode}
          onChange={(val, ...args) => console.log(val, ...args)}
          {...iconProps}
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
                <TreeNode value="same value10" title="same titlexd" key="0-1-1-1-0" style={{ color: 'red', background: 'green' }} />
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
