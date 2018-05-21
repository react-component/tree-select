/**
 * ARIA: https://www.w3.org/TR/wai-aria/#combobox
 * Sample 1: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
 * Sample 2: https://www.w3.org/blog/wai-components-gallery/widget/combobox-with-aria-autocompleteinline/
 *
 * Tab logic:
 * Popup is close
 * 1. Focus input (mark component as focused)
 * 2. Press enter to show the popup
 * 3. If popup has input, focus it
 *
 * Popup is open
 * 1. press tab to close the popup
 * 2. Focus back to the selection input box
 * 3. Let the native tab going on
 *
 * TreeSelect use 2 design type.
 * In single mode, we should focus on the `span`
 * In multiple mode, we should focus on the `input`
 */

import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import KeyCode from 'rc-util/lib/KeyCode';
import { calcCheckStateConduct } from 'rc-tree/lib/util';

import SelectTrigger from './SelectTrigger';
import { selectorContextTypes } from './Base/BaseSelector';
import { popupContextTypes } from './Base/BasePopup';
import SingleSelector from './Selector/SingleSelector';
import MultipleSelector, { multipleSelectorContextTypes } from './Selector/MultipleSelector';
import SinglePopup from './Popup/SinglePopup';
import MultiplePopup from './Popup/MultiplePopup';

import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';

import {
  createRef, generateAriaId,
  formatInternalValue, formatSelectorValue,
  convertDataToEntities, convertTreeToData, calcUncheckConduct,
  flatToHierarchy,
  isPosRelated, isLabelInValue, getFilterTree,
} from './util';
import { valueProp } from './propTypes';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    prefixAria: PropTypes.string,
    multiple: PropTypes.bool,
    showArrow: PropTypes.bool,
    open: PropTypes.bool,
    value: valueProp,
    autoFocus: PropTypes.bool,

    defaultOpen: PropTypes.bool,
    defaultValue: valueProp,

    showSearch: PropTypes.bool,
    placeholder: PropTypes.node,
    inputValue: PropTypes.string, // [Legacy] TODO: Deprecated. Use `searchValue` instead.
    searchValue: PropTypes.string,
    autoClearSearchValue: PropTypes.bool,
    searchPlaceholder: PropTypes.node, // [Legacy] TODO: This should be deprecated.
    disabled: PropTypes.bool,
    children: PropTypes.node,
    maxTagTextLength: PropTypes.number,
    showCheckedStrategy: PropTypes.oneOf([
      SHOW_ALL, SHOW_PARENT, SHOW_CHILD,
    ]),

    dropdownMatchSelectWidth: PropTypes.bool,
    treeData: PropTypes.any,
    treeNodeFilterProp: PropTypes.string,
    treeNodeLabelProp: PropTypes.string,
    treeCheckable: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeIcon: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    filterTreeNode: PropTypes.func,

    notFoundContent: PropTypes.string,

    onSearch: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onChange: PropTypes.func,
    onDropdownVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    prefixAria: 'rc-tree-select',
    showArrow: true,
    showSearch: true,
    autoClearSearchValue: true,
    showCheckedStrategy: SHOW_CHILD,
    // TODO: double confirm
    dropdownMatchSelectWidth: false,
    treeNodeFilterProp: 'value',
    treeNodeLabelProp: 'title',
    treeIcon: false,
    notFoundContent: 'Not Found',
  };

  static childContextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...selectorContextTypes,
      ...multipleSelectorContextTypes,
      ...popupContextTypes,

      onSearchInputChange: PropTypes.func,
    }),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // React 16.4 will support `prevProps` natively.
    // Consider the capacity on 16.3, we have to do this ourselves.
    const { prevProps = {} } = prevState;
    const {
      treeCheckable, treeCheckStrictly,
      filterTreeNode, treeNodeFilterProp,
    } = nextProps;
    const newState = {
      prevProps: nextProps,
    };

    // Process the state when props updated
    function processState(propName, updater) {
      if (prevProps[propName] !== nextProps[propName]) {
        updater(nextProps[propName]);
        return true;
      }
      return false;
    }

    let valueRefresh = false;

    // Open
    processState('open', (propValue) => {
      newState.open = propValue;
    });

    // Tree Nodes
    let treeData;
    processState('treeData', (propValue) => {
      treeData = propValue;
    });

    // If `treeData` not provide, use children TreeNodes
    if (!('treeData' in nextProps)) {
      processState('children', (propValue) => {
        treeData = convertTreeToData(propValue);
      });
    }

    // Convert `treeData` to entities
    if (treeData) {
      const { treeNodes, valueEntities, keyEntities } = convertDataToEntities(treeData);
      newState.treeNodes = treeNodes;
      newState.valueEntities = valueEntities;
      newState.keyEntities = keyEntities;
      valueRefresh = true;
    }

    // Value List
    processState('value', (propValue) => {
      newState.valueList = formatInternalValue(propValue, nextProps);
      valueRefresh = true;
    });

    // Selector Value List
    if (valueRefresh) {
      // We need calculate the value when tree is checked tree
      if (treeCheckable && !treeCheckStrictly) {
        // Get keys by values
        const keyList = (newState.valueList || prevState.valueList)
          .map(({ value }) => {
            const entity = (newState.valueEntities || prevState.valueEntities)[value];
            return entity ? entity.key : null;
          })
          .filter(key => key);

        // Calculate the keys need to be checked
        const { checkedKeys } = calcCheckStateConduct(
          newState.treeNodes || prevState.treeNodes,
          keyList,
        );

        // Convert key back to value
        const valueList = checkedKeys.map(key => (
          (newState.keyEntities || prevState.keyEntities)[key].value
        ));

        // Format value list again for internal usage
        newState.valueList = formatInternalValue(valueList, nextProps);
      }

      // Calculate the value list for `Selector` usage
      newState.selectorValueList = formatSelectorValue(
        newState.valueList || prevState.valueList,
        nextProps,
        newState.valueEntities || prevState.valueEntities,
      );
    }

    // Input value
    processState('inputValue', (propValue) => {
      newState.searchValue = propValue;
    });

    // Search value
    processState('searchValue', (propValue) => {
      newState.searchValue = propValue;
    });

    // Do the search logic
    if (newState.searchValue) {
      const upperSearchValue = String(newState.searchValue).toUpperCase();

      let filterTreeNodeFn = filterTreeNode;
      if (!filterTreeNodeFn) {
        filterTreeNodeFn = (_, node) => {
          const nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
          return nodeValue.indexOf(upperSearchValue) !== -1;
        };
      }

      newState.filteredTreeNodes = getFilterTree(
        newState.treeNodes || prevState.treeNodes,
        newState.searchValue,
        filterTreeNodeFn,
      );
    }

    // Checked Strategy
    processState('showCheckedStrategy', () => {
      newState.selectorValueList = newState.selectorValueList || formatSelectorValue(
        newState.valueList || prevState.valueList,
        nextProps,
        newState.valueEntities || prevState.valueEntities,
      );
    });

    return newState;
  }

  constructor(props) {
    super(props);

    const {
      prefixAria,
      defaultOpen, defaultValue,
      open,
    } = props;

    this.state = {
      open: open || defaultOpen,
      valueList: defaultValue ? formatInternalValue(defaultValue, props) : [],
      selectorValueList: [], // Used for multiple selector
      valueEntities: {},
      keyEntities: {},
      searchValue: '',
    };

    this.selectorRef = createRef();
    this.selectTriggerRef = createRef();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = generateAriaId(`${prefixAria}-list`);
  }

  getChildContext() {
    // TODO: Handle this
    return {
      rcTreeSelect: {
        onSelectorFocus: this.onSelectorFocus,
        onSelectorBlur: this.onSelectorBlur,
        onSelectorKeyDown: this.onComponentKeyDown,
        onSelectorClear: this.onSelectorClear,
        onMultipleSelectorRemove: this.onMultipleSelectorRemove,

        onTreeNodeSelect: this.onTreeNodeSelect,
        onTreeNodeCheck: this.onTreeNodeCheck,
        onPopupKeyDown: this.onComponentKeyDown,
        // onTreeStateUpdate: this.onTreeStateUpdate,

        onSearchInputChange: this.onSearchInputChange,
      },
    };
  }

  componentDidMount() {
    const { autoFocus, disabled } = this.props;

    if (autoFocus && !disabled) {
      this.focus();
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.valueList !== this.state.valueList) {
      this.forcePopupAlign();
    }
  }


  // ==================== Selector ====================
  onSelectorFocus = () => {
    this.setState({ focused: true });
  };
  onSelectorBlur = () => {
    this.setState({ focused: false });

    // TODO: Close when Popup is also not focused
    // this.setState({ open: false });
  };

  // Handle key board event in both Selector and Popup
  onComponentKeyDown = (event) => {
    const { open } = this.state;
    const { keyCode } = event;

    if (!open) {
      if ([KeyCode.ENTER, KeyCode.DOWN].indexOf(keyCode) !== -1) {
        this.setOpenState(true);
      }
    } else if (KeyCode.ESC === keyCode) {
      this.setOpenState(false);
    } else if ([KeyCode.UP, KeyCode.DOWN, KeyCode.LEFT, KeyCode.RIGHT].indexOf(keyCode) !== -1) {
      // TODO: Handle `open` state
      event.stopPropagation();
    }
  };

  onSelectorClear = (event) => {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }

    this.triggerChange([]);
    event.stopPropagation();
  };

  onMultipleSelectorRemove = (event, removeValue) => {
    event.stopPropagation();

    const { valueList, valueEntities, searchValue } = this.state;

    const { treeCheckable, treeCheckStrictly, disabled } = this.props;
    if (disabled) {
      return;
    }

    // Find trigger entity
    const triggerEntity = valueEntities[removeValue];

    // Clean up value
    let newValueList;
    if (treeCheckable && !treeCheckStrictly) {
      newValueList = valueList.filter(({ value }) => {
        const entity = valueEntities[value];
        return !isPosRelated(entity.pos, triggerEntity.pos);
      });
    } else {
      newValueList = valueList.filter(({ value }) => value !== removeValue);
    }

    const extraInfo = {
      triggerValue: removeValue,
      triggerNode: triggerEntity.node,
    };

    // [Legacy] Little hack on this to make same action as `onCheck` event.
    if (treeCheckable) {
      const filteredEntityList = newValueList.map(({ value }) => valueEntities[value]);
      if (treeCheckStrictly || searchValue) {
        extraInfo.allCheckedNodes = filteredEntityList.map(({ node }) => node);
      } else {
        extraInfo.allCheckedNodes = flatToHierarchy(filteredEntityList);
      }
    }

    this.triggerChange(newValueList, extraInfo);
  };

  // ===================== Popup ======================
  onValueTrigger = (isAdd, nodeList, nodeEventInfo, nodeExtraInfo) => {
    const { node } = nodeEventInfo;
    const { value } = node.props;
    const { searchValue, valueEntities, keyEntities, treeNodes } = this.state;
    const {
      disabled,
      treeNodeLabelProp, onSelect, onDeselect,
      treeCheckable, treeCheckStrictly, autoClearSearchValue,
    } = this.props;
    const label = node.props[treeNodeLabelProp];

    if (disabled) {
      return;
    }

    // Wrap the return value for user
    let wrappedValue;
    if (this.isLabelInValue()) {
      wrappedValue = {
        value,
        label,
      };
    } else {
      wrappedValue = value;
    }

    // [Legacy] Origin code not trigger `onDeselect` every time. Let's align the behaviour.
    if (isAdd) {
      if (onSelect) {
        onSelect(wrappedValue, node, nodeEventInfo);
      }
    } else if (onDeselect) {
      onDeselect(wrappedValue, node, nodeEventInfo);
    }

    // Get wrapped value list.
    // This is a bit hack cause we use key to match the value.
    let newValueList = nodeList.map(({ props }) => ({
      value: props.value,
      label: props[treeNodeLabelProp],
    }));

    // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
    // We need calculate the missing nodes.
    if (treeCheckable && !treeCheckStrictly && searchValue) {
      let keyList = newValueList.map(({ value: val }) => valueEntities[val].key);
      if (isAdd) {
        keyList = calcCheckStateConduct(treeNodes, keyList).checkedKeys;
      } else {
        keyList = calcUncheckConduct(keyList, valueEntities[value].key, keyEntities);
      }
      newValueList = keyList.map(key => {
        const { node: { props } } = keyEntities[key];
        return {
          value: props.value,
          label: props[treeNodeLabelProp],
        };
      });
    }

    // Clean up `searchValue` when this prop is set
    // `inputValue` is a legacy prop as current `searchValue`
    if (autoClearSearchValue && searchValue && !('inputValue' in this.props)) {
      this.setUncontrolledState({
        searchValue: '',
        filteredTreeNodes: null,
      });
    }

    // [Legacy] Provide extra info
    const extraInfo = {
      ...nodeExtraInfo,
      triggerValue: value,
      triggerNode: node,
    };

    this.triggerChange(newValueList, extraInfo);
  };

  onTreeNodeSelect = (_, nodeEventInfo) => {
    const { treeCheckable } = this.props;
    if (treeCheckable) return;

    const { selectedNodes } = nodeEventInfo;
    const isAdd = nodeEventInfo.selected;
    this.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, { selected: isAdd });
  };

  onTreeNodeCheck = (_, nodeEventInfo) => {
    const { searchValue } = this.state;
    const { treeCheckStrictly } = this.props;

    const { checkedNodes, checkedNodesPositions } = nodeEventInfo;
    const isAdd = nodeEventInfo.checked;

    const extraInfo = {
      checked: isAdd,
    };

    // [Legacy] Check event provide `allCheckedNodes`.
    // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
    // - Related: Show the top checked nodes and has children prop.
    // - Unrelated: Show all the checked nodes.
    if (treeCheckStrictly || searchValue) {
      extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
    } else {
      extraInfo.allCheckedNodes = flatToHierarchy(checkedNodesPositions);
    }

    this.onValueTrigger(isAdd, checkedNodes, nodeEventInfo, extraInfo);
  };

  /**
   * This function triggered when `Tree` value update.
   * We need to get the accurate checked value when `treeCheckable` and not `treeCheckStrictly`.
   */
  onTreeStateUpdate = (treeState) => {
    const { treeCheckable, treeCheckStrictly } = this.props;
    const { checkedKeys } = treeState;

    // Get the value passed by tree.
    if ((treeCheckable && !treeCheckStrictly) && checkedKeys) {
      console.log('Tree Update:', checkedKeys);
    }
  };

  // ==================== Trigger =====================

  onDropdownVisibleChange = (open) => {
    this.setOpenState(open, true);
  };

  // TODO: implement require
  onSearchInputChange = ({ target: { value } }) => {
    const { treeNodes } = this.state;
    const { onSearch, filterTreeNode, treeNodeFilterProp } = this.props;

    const isSet = this.setUncontrolledState({
      searchValue: value,
    });
    this.setOpenState(true);

    if (onSearch) {
      onSearch(value);
    }

    if (isSet) {
      // Do the search logic
      const upperSearchValue = String(value).toUpperCase();

      let filterTreeNodeFn = filterTreeNode;
      if (!filterTreeNodeFn) {
        filterTreeNodeFn = (_, node) => {
          const nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
          return nodeValue.indexOf(upperSearchValue) !== -1;
        };
      }

      this.setState({
        filteredTreeNodes: getFilterTree(treeNodes, value, filterTreeNodeFn),
      });
    }
  };

  onInputKeyDown = () => {};
  onPlaceholderClick = () => {};

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }

    return needSync;
  };

  // [Legacy] Origin provide `documentClickClose` which triggered by `Trigger`
  // Currently `TreeSelect` align the hide popup logic as `Select` which blur to hide.
  // `documentClickClose` is not accurate anymore. Let's just keep the key word.
  setOpenState = (open, byTrigger = false) => {
    const { onDropdownVisibleChange } = this.props;

    if (
      onDropdownVisibleChange &&
      onDropdownVisibleChange(open, { documentClickClose: !open && byTrigger }) === false
    ) {
      return;
    }

    this.setUncontrolledState({ open }, () => {
      if (open) {
        // TODO: do focus
      }
    });
  };

  // Tree checkable is also a multiple case
  isMultiple = () => {
    const { multiple, treeCheckable } = this.props;
    return !!(multiple || treeCheckable);
  };

  isLabelInValue = () => {
    return isLabelInValue(this.props);
  };

  // TODO: onInputChange
  // TODO: onChoiceAnimationLeave
  forcePopupAlign = () => {
    const $trigger = this.selectTriggerRef.current;

    if ($trigger) {
      $trigger.forcePopupAlign();
    }
  };

  /**
   * 1. Update state valueList.
   * 2. Fire `onChange` event to user.
   */
  triggerChange = (valueList, extraInfo = {}) => {
    const { valueEntities } = this.state;
    const { onChange, disabled } = this.props;
    const labelList = valueList.map(({ label }) => label);

    if (disabled) {
      return;
    }

    // Trigger
    const extra = {
      // [Legacy] Always return as array contains label & value
      preValue: this.state.valueList.map(({ label, value }) => ({ label, value })),
      ...extraInfo,
    };

    // Format value by `treeCheckStrictly`
    const selectorValueList = formatSelectorValue(valueList, this.props, valueEntities);

    this.setState({
      valueList,
      selectorValueList,
    });

    // Only do the logic when `onChange` function provided
    if (onChange) {
      let returnValue;
      if (this.isLabelInValue()) {
        returnValue = selectorValueList.map(({ label, value }) => ({ label, value }));
      } else {
        returnValue = selectorValueList.map(({value}) => value);
      }

      if (!this.isMultiple()) {
        returnValue = returnValue[0];
      }

      onChange(returnValue, labelList, extra);
    }
  };

  focus() {
    this.selectorRef.current.focus();
  }

  blur() {
    this.selectorRef.current.blur();
  }

  // ===================== Render =====================

  render() {
    const {
      valueList, selectorValueList,
      valueEntities, keyEntities,
      searchValue,
      open, focused,
      treeNodes, filteredTreeNodes,
    } = this.state;
    const { prefixCls } = this.props;
    const isMultiple = this.isMultiple();

    const passProps = {
      ...this.props,
      isMultiple,
      valueList,
      selectorValueList,
      valueEntities,
      keyEntities,
      searchValue,
      open,
      focused,
      dropdownPrefixCls: `${prefixCls}-dropdown`,
      ariaId: this.ariaId,
    };

    // TODO: process the logic of mode diff
    const Popup = isMultiple ? MultiplePopup : SinglePopup;
    const $popup = (
      <Popup
        {...passProps}
        treeNodes={treeNodes}
        filteredTreeNodes={filteredTreeNodes}
      />
    );

    const Selector = isMultiple ? MultipleSelector : SingleSelector;
    const $selector = <Selector {...passProps} ref={this.selectorRef} />;

    return (
      <SelectTrigger
        {...passProps}

        ref={this.selectTriggerRef}
        popupElement={$popup}

        onKeyDown={this.onKeyDown}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {$selector}
      </SelectTrigger>
    );
  }
}

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

// Let warning show correct component name
Select.displayName = 'TreeSelect';

polyfill(Select);

export default Select;
