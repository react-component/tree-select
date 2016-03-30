import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { KeyCode } from 'rc-util';
import classnames from 'classnames';
import assign from 'object-assign';
import Animate from 'rc-animate';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray, findIndexInValueByKey,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent,
  getTreeNodesStates, flatToHierarchy, filterParentPosition,
  isInclude, labelCompatible,
} from './util';
import SelectTrigger from './SelectTrigger';
import _TreeNode from './TreeNode';

function noop() {
}

function filterFn(input, child) {
  return String(getPropValue(child, labelCompatible(this.props.treeNodeFilterProp))).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

function loopTreeData(data, level = 0) {
  return data.map((item, index) => {
    const pos = `${level}-${index}`;
    const props = {
      title: item.label,
      value: item.value,
      key: item.key || item.value || pos,
    };
    let ret;
    if (item.children && item.children.length) {
      ret = (<_TreeNode {...props}>{loopTreeData(item.children, pos)}</_TreeNode>);
    } else {
      ret = (<_TreeNode {...props} isLeaf={item.isLeaf}/>);
    }
    return ret;
  });
}

const SHOW_ALL = 'SHOW_ALL';
const SHOW_PARENT = 'SHOW_PARENT';
const SHOW_CHILD = 'SHOW_CHILD';

const Select = React.createClass({
  propTypes: {
    children: PropTypes.any,
    multiple: PropTypes.bool,
    filterTreeNode: PropTypes.any,
    showSearch: PropTypes.bool,
    disabled: PropTypes.bool,
    showArrow: PropTypes.bool,
    tags: PropTypes.bool,
    transitionName: PropTypes.string,
    animation: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    label: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
    defaultLabel: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
    labelInValue: PropTypes.bool,
    dropdownStyle: PropTypes.object,
    drodownPopupAlign: PropTypes.object,
    maxTagTextLength: PropTypes.number,
    showCheckedStrategy: PropTypes.oneOf([
      SHOW_ALL, SHOW_PARENT, SHOW_CHILD,
    ]),
    skipHandleInitValue: PropTypes.bool,
    treeIcon: PropTypes.bool,
    treeLine: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeCheckable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    treeNodeLabelProp: PropTypes.string,
    treeNodeFilterProp: PropTypes.string,
    treeData: PropTypes.array,
    loadData: PropTypes.func,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-tree-select',
      filterTreeNode: filterFn,
      showSearch: true,
      allowClear: false,
      placeholder: '',
      searchPlaceholder: '',
      labelInValue: false,
      defaultValue: [],
      onClick: noop,
      onChange: noop,
      onSelect: noop,
      onDeselect: noop,
      onSearch: noop,
      showArrow: true,
      dropdownMatchSelectWidth: true,
      dropdownStyle: {},
      notFoundContent: 'Not Found',
      showCheckedStrategy: SHOW_CHILD,
      skipHandleInitValue: false,
      treeIcon: false,
      treeLine: false,
      treeDefaultExpandAll: false,
      treeCheckable: false,
      treeNodeFilterProp: 'value',
      treeNodeLabelProp: 'title',
    };
  },

  getInitialState() {
    const props = this.props;
    let value = [];
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    value = this.addLabelToValue(props, value);
    value = this.getValue(props, value);
    // const label = this.getLabelFromProps(props, value, 1);
    let inputValue = '';
    if (props.combobox) {
      inputValue = value.length ? String(value[0].value) : '';
    }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    return {value, inputValue};
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      let value = toArray(nextProps.value);
      value = this.addLabelToValue(nextProps, value);
      value = this.getValue(nextProps, value);
      this.setState({
        value,
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value.length ? String(value[0].key) : '',
        });
      }
    }
  },

  componentDidUpdate() {
    const state = this.state;
    const props = this.props;
    if (state.open && isMultipleOrTags(props)) {
      const inputNode = this.getInputDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = inputNode.scrollWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount() {
    this.clearDelayTimer();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange(event) {
    const val = event.target.value;
    const { props } = this;
    this.setState({
      inputValue: val,
      open: true,
    });
    if (isCombobox(props)) {
      this.fireChange([{
        value: val,
      }]);
    }
    props.onSearch(val);
  },

  onDropdownVisibleChange(open) {
    // selection inside combobox cause click
    if (!open && document.activeElement === this.getInputDOMNode()) {
      return;
    }
    this.setOpenState(open);
  },

  // combobox ignore
  onKeyDown(event) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const keyCode = event.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  },

  onInputBlur() {
    if (isMultipleOrTagsOrCombobox(this.props)) {
      return;
    }
    this.clearDelayTimer();
    this.delayTimer = setTimeout(() => {
      this.setOpenState(false);
    }, 150);
  },

  onInputKeyDown(event) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const state = this.state;
    const keyCode = event.keyCode;
    if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
      const value = state.value.concat();
      if (value.length) {
        const popValue = value.pop();
        props.onDeselect(props.labelInValue ? popValue : popValue.key);
        this.fireChange(value);
      }
      return;
    }
    if (keyCode === KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (state.open) {
      // const menu = this.refs.trigger.getPopupEleRefs();
      // if (menu && menu.onKeyDown(event)) {
      //   event.preventDefault();
      //   event.stopPropagation();
      // }
    }
  },

  onSelect(selectedKeys, info) {
    if (info.selected === false) {
      this.onDeselect(info);
      return;
    }
    const item = info.node;
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const selectedLabel = this.getLabelFromNode(item);
    let event = selectedValue;
    if (props.labelInValue) {
      event = {
        value: event,
        label: selectedLabel,
      };
    }
    props.onSelect(event, item);
    const checkEvt = info.event === 'check';
    if (isMultipleOrTags(props)) {
      if (checkEvt) {
        value = this.getCheckedNodes(info, props).map(n => {
          return {
            value: getValuePropValue(n),
            label: this.getLabelFromNode(n),
          };
        });
      } else {
        if (findIndexInValueByKey(value, selectedValue) !== -1) {
          return;
        }
        value = value.concat([{
          value: selectedValue,
          label: selectedLabel,
        }]);
      }
      // if (!checkEvt && value.indexOf(selectedValue) !== -1) {
        // 设置 multiple 时会有bug。（isValueChange 已有检查，此处注释掉）
        // return;
      // }
    } else {
      if (value.length && value[0].value === selectedValue) {
        this.setOpenState(false, true);
        return;
      }
      value = [{
        value: selectedValue,
        label: selectedLabel,
      }];
      this.setOpenState(false, true);
    }

    const extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item,
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
      extraInfo.allCheckedNodes = flatToHierarchy(info.checkedNodesPositions);
    } else {
      extraInfo.selected = info.selected;
    }

    this.fireChange(value, extraInfo);
    this.setState({
      inputValue: '',
    });
    if (isCombobox(props)) {
      this.setState({
        inputValue: getPropValue(item, props.treeNodeLabelProp),
      });
    }
  },

  onDeselect(info) {
    this.removeSelected(getValuePropValue(info.node));
    if (!isMultipleOrTags(this.props)) {
      this.setOpenState(false);
    }
    this.setState({
      inputValue: '',
    });
  },

  onPlaceholderClick() {
    this.getInputDOMNode().focus();
  },

  onClearSelection(event) {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setOpenState(false);
      this.setState({
        inputValue: '',
      });
    }
  },

  getLabelBySingleValue(children, value) {
    if (value === undefined) {
      return null;
    }
    let label = null;
    const loop = (childs) => {
      React.Children.forEach(childs, (item) => {
        if (item.props.children) {
          loop(item.props.children);
        }
        if (getValuePropValue(item) === value) {
          label = this.getLabelFromNode(item);
        }
      });
    };
    loop(children, 0);
    return label;
  },

  getLabelFromNode(child) {
    return getPropValue(child, this.props.treeNodeLabelProp);
  },

  getLabelFromProps(props, value, init) {
    let label = [];
    if ('label' in props) {
      label = toArray(props.label);
    } else if (init && 'defaultLabel' in props) {
      label = toArray(props.defaultLabel);
    } else {
      label = this.getLabelByValue(this.renderTreeData(props) || props.children, toArray(value))[0];
    }
    return label;
  },

  getVLForOnChange(vls_) {
    let vls = vls_;
    if (vls !== undefined) {
      if (!this.props.labelInValue) {
        vls = vls.map(v => v.value);
      }
      return isMultipleOrTags(this.props) ? vls : vls[0];
    }
    return vls;
  },

  getLabelByValue(children, values) {
    return values.map((value)=> {
      const label = this.getLabelBySingleValue(children, value);
      if (label === null) {
        return value;
      }
      return label;
    });
  },

  getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  },

  getSearchPlaceholderElement(hidden) {
    const props = this.props;
    let placeholder;
    if (isMultipleOrTagsOrCombobox(props)) {
      placeholder = props.placeholder || props.searchPlaceholder;
    } else {
      placeholder = props.searchPlaceholder;
    }
    if (placeholder) {
      return (<span
        style={{ display: hidden ? 'none' : 'block' }}
        onClick={this.onPlaceholderClick}
        className={`${props.prefixCls}-search__field__placeholder`}
      >
        {placeholder}
      </span>);
    }
    return null;
  },

  getInputElement() {
    const props = this.props;
    return (<span className={`${props.prefixCls}-search__field__wrap`}>
      <input
        ref={this.saveInputRef}
        onBlur={this.onInputBlur}
        onChange={this.onInputChange}
        onKeyDown={this.onInputKeyDown}
        value={this.state.inputValue}
        disabled={props.disabled}
        className={`${props.prefixCls}-search__field`}
        role="textbox"/>
      {isMultipleOrTags(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)}
    </span>);
  },

  getInputDOMNode() {
    return this.inputInstance;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },

  getPopupComponentRefs() {
    return this.refs.trigger.getPopupEleRefs();
  },

  getValue(_props, value) {
    if (!(_props.treeCheckable && !_props.skipHandleInitValue)) {
      return value;
    }
    const checkedTreeNodes = getTreeNodesStates(
      this.renderTreeData(_props) || _props.children,
      value.map(item => item.value)
    ).checkedTreeNodes;
    this.checkedTreeNodes = checkedTreeNodes;
    const mapLabVal = arr => arr.map(itemObj => {
      return {
        value: getValuePropValue(itemObj.node),
        label: getPropValue(itemObj.node, _props.treeNodeLabelProp),
      };
    });
    const props = this.props;
    let checkedValues = [];
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedValues = mapLabVal(checkedTreeNodes);
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      const posArr = filterParentPosition(checkedTreeNodes.map(itemObj => itemObj.pos));
      checkedValues = mapLabVal(checkedTreeNodes.filter(itemObj => posArr.indexOf(itemObj.pos) !== -1));
    } else {
      checkedValues = mapLabVal(checkedTreeNodes.filter(itemObj => !itemObj.node.props.children));
    }
    return checkedValues;
  },

  getCheckedNodes(info, props) {
    // TODO treeCheckable does not support tags/dynamic
    let { checkedNodes } = info;
    const checkedNodesPositions = info.checkedNodesPositions;
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedNodes = checkedNodes;
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      const posArr = filterParentPosition(checkedNodesPositions.map(itemObj => itemObj.pos));
      checkedNodes = checkedNodesPositions.filter(itemObj => posArr.indexOf(itemObj.pos) !== -1)
        .map(itemObj => itemObj.node);
    } else {
      checkedNodes = checkedNodes.filter(n => !n.props.children);
    }
    return checkedNodes;
  },

  getDeselectedValue(selectedValue) {
    const checkedTreeNodes = this.checkedTreeNodes;
    let unCheckPos;
    checkedTreeNodes.forEach(itemObj => {
      if (itemObj.node.props.value === selectedValue) {
        unCheckPos = itemObj.pos;
      }
    });
    const nArr = unCheckPos.split('-');
    const newVals = [];
    checkedTreeNodes.forEach(itemObj => {
      const iArr = itemObj.pos.split('-');
      if (itemObj.pos === unCheckPos ||
        nArr.length > iArr.length && isInclude(iArr, nArr) ||
        nArr.length < iArr.length && isInclude(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newVals.push(itemObj.node.props.value);
    });
    this.fireChange(this.state.value.filter(val => newVals.indexOf(val.value) !== -1),
      {triggerValue: selectedValue, clear: true});
  },

  setOpenState(open, needFocus) {
    this.clearDelayTimer();
    const { props, refs } = this;
    // can not optimize, if children is empty
    // if (this.state.open === open) {
    //   return;
    // }
    this.setState({
      open,
    }, ()=> {
      if (needFocus || open) {
        if (open || isMultipleOrTagsOrCombobox(props)) {
          const input = this.getInputDOMNode();
          if (input && document.activeElement !== input) {
            input.focus();
          }
        } else if (refs.selection) {
          refs.selection.focus();
        }
      }
    });
  },

  addLabelToValue(props, value_) {
    let value = value_;
    if (props.labelInValue) {
      value.forEach(v => {
        v.label = v.label || this.getLabelFromProps(props, v.value);
      });
    } else {
      value = value.map(v => {
        return {
          value: v,
          label: this.getLabelFromProps(props, v),
        };
      });
    }
    return value;
  },

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  },

  removeSelected(selectedKey) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    if ((props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT)
      && !props.skipHandleInitValue) {
      this.getDeselectedValue(selectedKey);
      return;
    }
    let label;
    const value = this.state.value.filter((singleValue) => {
      if (singleValue.value === selectedKey) {
        label = singleValue.label;
      }
      return (singleValue.value !== selectedKey);
    });
    const canMultiple = isMultipleOrTags(props);

    if (canMultiple) {
      let event = selectedKey;
      if (props.labelInValue) {
        event = {
          value: selectedKey,
          label,
        };
      }
      props.onDeselect(event);
    }
    this.fireChange(value, {triggerValue: selectedKey, clear: true});
  },

  openIfHasChildren() {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  },

  fireChange(value, extraInfo) {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({
        value,
      });
    }
    const vals = value.map(i => i.value);
    const sv = this.state.value.map(i => i.value);
    if (vals.length !== sv.length || !vals.every((val, index) => sv[index] === val)) {
      const ex = {preValue: [...this.state.value]};
      if (extraInfo) {
        assign(ex, extraInfo);
      }
      props.onChange(this.getVLForOnChange(value), ex);
    }
  },

  renderTopControlNode() {
    const { value } = this.state;
    const props = this.props;
    const { choiceTransitionName, prefixCls, maxTagTextLength } = props;
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      let innerNode = (<span
        key="placeholder"
        className={`${prefixCls}-selection__placeholder`}
      >
        {props.placeholder}
      </span>);
      if (value.length) {
        innerNode = <span key="value">{value[0].label}</span>;
      }
      return (<span className={`${prefixCls}-selection__rendered`}>
        {innerNode}
      </span>);
    }

    let selectedValueNodes = [];
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((singleValue) => {
        let content = singleValue.label;
        const title = content;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = `${content.slice(0, maxTagTextLength)}...`;
        }
        return (
          <li
            style={UNSELECTABLE_STYLE}
            {...UNSELECTABLE_ATTRIBUTE}
            onMouseDown={preventDefaultEvent}
            className={`${prefixCls}-selection__choice`}
            key={singleValue.value}
            title={title}
          >
            <span className={`${prefixCls}-selection__choice__content`}>{content}</span>
            <span
              className={`${prefixCls}-selection__choice__remove`}
              onClick={this.removeSelected.bind(this, singleValue.value)}
            />
          </li>
        );
      });
    }
    selectedValueNodes.push(<li
      className={`${prefixCls}-search ${prefixCls}-search--inline`}
      key="__input"
    >
      {this.getInputElement()}
    </li>);
    const className = `${prefixCls}-selection__rendered`;
    if (isMultipleOrTags(props) && choiceTransitionName) {
      return (<Animate
        className={className}
        component="ul"
        transitionName={choiceTransitionName}
      >
        {selectedValueNodes}
      </Animate>);
    }
    return (<ul className={className}>{selectedValueNodes}</ul>);
  },

  renderTreeData(props) {
    const validProps = props || this.props;
    if (validProps.treeData) {
      return loopTreeData(validProps.treeData);
    }
  },

  render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);
    const state = this.state;
    const {className, disabled, allowClear, prefixCls} = props;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    if (!isMultipleOrTagsOrCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0,
      };
    }
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
    };

    const clear = (<span
      key="clear"
      className={`${prefixCls}-selection__clear`}
      onClick={this.onClearSelection}
    />);
    return (
      <SelectTrigger {...props}
        treeNodes={props.children}
        treeData={this.renderTreeData()}
        multiple={multiple}
        disabled={disabled}
        visible={state.open}
        inputValue={state.inputValue}
        inputElement={this.getInputElement()}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        onSelect={this.onSelect}
        ref="trigger"
      >
        <span
          style={props.style}
          onClick={props.onClick}
          className={classnames(rootCls)}
        >
          <span
            ref="selection"
            key="selection"
            className={`${prefixCls}-selection
            ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-expanded={state.open}
            {...extraSelectionProps}
          >
        {ctrlNode}
            {allowClear && !multiple ? clear : null}
            {multiple || !props.showArrow ? null :
              (<span
                key="arrow"
                className={`${prefixCls}-arrow`}
                style={{ outline: 'none' }}
              >
              <b/>
            </span>)}
            {multiple ?
              this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) :
              null}
          </span>
        </span>
      </SelectTrigger>
    );
  },
});

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

export default Select;
