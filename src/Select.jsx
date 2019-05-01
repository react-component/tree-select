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
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import KeyCode from 'rc-util/lib/KeyCode';
import shallowEqual from 'shallowequal';
import raf from 'raf';
import scrollIntoView from 'dom-scroll-into-view';

import SelectTrigger from './SelectTrigger';
import { selectorContextTypes } from './Base/BaseSelector';
import { popupContextTypes } from './Base/BasePopup';
import SingleSelector from './Selector/SingleSelector';
import MultipleSelector, { multipleSelectorContextTypes } from './Selector/MultipleSelector';
import SinglePopup from './Popup/SinglePopup';
import MultiplePopup from './Popup/MultiplePopup';

import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';

import {
  createRef,
  generateAriaId,
  formatInternalValue,
  formatSelectorValue,
  parseSimpleTreeData,
  convertDataToTree,
  convertTreeToEntities,
  conductCheck,
  getHalfCheckedKeys,
  flatToHierarchy,
  isPosRelated,
  isLabelInValue,
  getFilterTree,
  cleanEntity,
  findPopupContainer,
} from './util';
import { valueProp } from './propTypes';
import SelectNode from './SelectNode';

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
    inputValue: PropTypes.string, // [Legacy] Deprecated. Use `searchValue` instead.
    searchValue: PropTypes.string,
    autoClearSearchValue: PropTypes.bool,
    searchPlaceholder: PropTypes.node, // [Legacy] Confuse with placeholder
    disabled: PropTypes.bool,
    children: PropTypes.node,
    labelInValue: PropTypes.bool,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    maxTagTextLength: PropTypes.number,
    showCheckedStrategy: PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),

    dropdownMatchSelectWidth: PropTypes.bool,
    treeData: PropTypes.array,
    treeDataSimpleMode: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    treeNodeFilterProp: PropTypes.string,
    treeNodeLabelProp: PropTypes.string,
    treeCheckable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    treeCheckStrictly: PropTypes.bool,
    treeIcon: PropTypes.bool,
    treeLine: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    treeExpandedKeys: PropTypes.array,
    loadData: PropTypes.func,
    filterTreeNode: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

    notFoundContent: PropTypes.node,

    onSearch: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onChange: PropTypes.func,
    onDropdownVisibleChange: PropTypes.func,

    onTreeExpand: PropTypes.func,

    inputIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    removeIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static childContextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...selectorContextTypes,
      ...multipleSelectorContextTypes,
      ...popupContextTypes,

      onSearchInputChange: PropTypes.func,
      onSearchInputKeyDown: PropTypes.func,
    }),
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    prefixAria: 'rc-tree-select',
    showArrow: true,
    showSearch: true,
    autoClearSearchValue: true,
    showCheckedStrategy: SHOW_CHILD,

    // dropdownMatchSelectWidth change the origin design, set to false now
    // ref: https://github.com/react-component/select/blob/4cad95e098a341a09de239ad6981067188842020/src/Select.jsx#L344
    // ref: https://github.com/react-component/select/pull/71
    treeNodeFilterProp: 'value',
    treeNodeLabelProp: 'title',
    treeIcon: false,
    notFoundContent: 'Not Found',
  };

  constructor(props) {
    super(props);

    const { prefixAria, defaultOpen, open } = props;

    this.state = {
      open: open || defaultOpen,
      valueList: [],
      searchHalfCheckedKeys: [],
      missValueList: [], // Contains the value not in the tree
      selectorValueList: [], // Used for multiple selector
      valueEntities: {},
      keyEntities: {},
      searchValue: '',

      init: true,
    };

    this.selectorRef = createRef();
    this.selectTriggerRef = createRef();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = generateAriaId(`${prefixAria}-list`);
  }

  getChildContext() {
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

        onSearchInputChange: this.onSearchInputChange,
        onSearchInputKeyDown: this.onSearchInputKeyDown,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps = {} } = prevState;
    const {
      treeCheckable,
      treeCheckStrictly,
      filterTreeNode,
      treeNodeFilterProp,
      treeDataSimpleMode,
    } = nextProps;
    const newState = {
      prevProps: nextProps,
      init: false,
    };

    // Process the state when props updated
    function processState(propName, updater) {
      if (prevProps[propName] !== nextProps[propName]) {
        updater(nextProps[propName], prevProps[propName]);
        return true;
      }
      return false;
    }

    let valueRefresh = false;

    // Open
    processState('open', propValue => {
      newState.open = propValue;
    });

    // Tree Nodes
    let treeNodes;
    let treeDataChanged = false;
    let treeDataModeChanged = false;
    processState('treeData', propValue => {
      treeNodes = convertDataToTree(propValue);
      treeDataChanged = true;
    });

    processState('treeDataSimpleMode', (propValue, prevValue) => {
      if (!propValue) return;

      const prev = !prevValue || prevValue === true ? {} : prevValue;

      // Shallow equal to avoid dynamic prop object
      if (!shallowEqual(propValue, prev)) {
        treeDataModeChanged = true;
      }
    });

    // Parse by `treeDataSimpleMode`
    if (treeDataSimpleMode && (treeDataChanged || treeDataModeChanged)) {
      const simpleMapper = {
        id: 'id',
        pId: 'pId',
        rootPId: null,
        ...(treeDataSimpleMode !== true ? treeDataSimpleMode : {}),
      };
      treeNodes = convertDataToTree(parseSimpleTreeData(nextProps.treeData, simpleMapper));
    }

    // If `treeData` not provide, use children TreeNodes
    if (!nextProps.treeData) {
      processState('children', propValue => {
        treeNodes = Array.isArray(propValue) ? propValue : [propValue];
      });
    }

    // Convert `treeData` to entities
    if (treeNodes) {
      const entitiesMap = convertTreeToEntities(treeNodes);
      newState.treeNodes = treeNodes;
      newState.posEntities = entitiesMap.posEntities;
      newState.valueEntities = entitiesMap.valueEntities;
      newState.keyEntities = entitiesMap.keyEntities;

      valueRefresh = true;
    }

    // Value List
    if (prevState.init) {
      processState('defaultValue', propValue => {
        newState.valueList = formatInternalValue(propValue, nextProps);
        valueRefresh = true;
      });
    }

    processState('value', propValue => {
      newState.valueList = formatInternalValue(propValue, nextProps);
      valueRefresh = true;
    });

    // Selector Value List
    if (valueRefresh) {
      // Find out that value not exist in the tree
      const missValueList = [];
      const filteredValueList = [];
      const keyList = [];

      // Get latest value list
      let latestValueList = newState.valueList;
      if (!latestValueList) {
        // Also need add prev missValueList to avoid new treeNodes contains the value
        latestValueList = [...prevState.valueList, ...prevState.missValueList];
      }

      // Get key by value
      latestValueList.forEach(wrapperValue => {
        const { value } = wrapperValue;
        const entity = (newState.valueEntities || prevState.valueEntities)[value];

        if (entity) {
          keyList.push(entity.key);
          filteredValueList.push(wrapperValue);
          return;
        }

        // If not match, it may caused by ajax load. We need keep this
        missValueList.push(wrapperValue);
      });

      // We need calculate the value when tree is checked tree
      if (treeCheckable && !treeCheckStrictly) {
        // Calculate the keys need to be checked
        const { checkedKeys } = conductCheck(
          keyList,
          true,
          newState.keyEntities || prevState.keyEntities,
        );

        // Format value list again for internal usage
        newState.valueList = checkedKeys.map(key => ({
          value: (newState.keyEntities || prevState.keyEntities)[key].value,
        }));
      } else {
        newState.valueList = filteredValueList;
      }

      // Fill the missValueList, we still need display in the selector
      newState.missValueList = missValueList;

      // Calculate the value list for `Selector` usage
      newState.selectorValueList = formatSelectorValue(
        newState.valueList,
        nextProps,
        newState.valueEntities || prevState.valueEntities,
      );
    }

    // [Legacy] To align with `Select` component,
    // We use `searchValue` instead of `inputValue` but still keep the api
    // `inputValue` support `null` to work as `autoClearSearchValue`
    processState('inputValue', propValue => {
      if (propValue !== null) {
        newState.searchValue = propValue;
      }
    });

    // Search value
    processState('searchValue', propValue => {
      newState.searchValue = propValue;
    });

    // Do the search logic
    if (newState.searchValue !== undefined || (prevState.searchValue && treeNodes)) {
      const searchValue =
        newState.searchValue !== undefined ? newState.searchValue : prevState.searchValue;
      const upperSearchValue = String(searchValue).toUpperCase();

      let filterTreeNodeFn = filterTreeNode;
      if (filterTreeNode === false) {
        // Don't filter if is false
        filterTreeNodeFn = () => true;
      } else if (typeof filterTreeNodeFn !== 'function') {
        // When is not function (true or undefined), use inner filter
        filterTreeNodeFn = (_, node) => {
          const nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
          return nodeValue.indexOf(upperSearchValue) !== -1;
        };
      }

      newState.filteredTreeNodes = getFilterTree(
        newState.treeNodes || prevState.treeNodes,
        searchValue,
        filterTreeNodeFn,
        newState.valueEntities || prevState.valueEntities,
        SelectNode,
      );
    }

    // We should re-calculate the halfCheckedKeys when in search mode
    if (
      valueRefresh &&
      treeCheckable &&
      !treeCheckStrictly &&
      (newState.searchValue || prevState.searchValue)
    ) {
      newState.searchHalfCheckedKeys = getHalfCheckedKeys(
        newState.valueList,
        newState.valueEntities || prevState.valueEntities,
      );
    }

    // Checked Strategy
    processState('showCheckedStrategy', () => {
      newState.selectorValueList =
        newState.selectorValueList ||
        formatSelectorValue(
          newState.valueList || prevState.valueList,
          nextProps,
          newState.valueEntities || prevState.valueEntities,
        );
    });

    return newState;
  }

  componentDidMount() {
    const { autoFocus, disabled } = this.props;

    if (autoFocus && !disabled) {
      this.focus();
    }
  }

  componentDidUpdate(_, prevState) {
    const { prefixCls } = this.props;
    const { valueList, open, selectorValueList, valueEntities } = this.state;
    const isMultiple = this.isMultiple();

    if (prevState.valueList !== valueList) {
      this.forcePopupAlign();
    }

    // Scroll to value position, only need sync on single mode
    if (!isMultiple && selectorValueList.length && !prevState.open && open && this.popup) {
      const { value } = selectorValueList[0];
      const { domTreeNodes } = this.popup.getTree();
      const { key } = valueEntities[value] || {};
      const treeNode = domTreeNodes[key];

      if (treeNode) {
        const domNode = findDOMNode(treeNode);
        raf(() => {
          const popupNode = findDOMNode(this.popup);
          const triggerContainer = findPopupContainer(popupNode, `${prefixCls}-dropdown`);
          const searchNode = this.popup.searchRef.current;

          if (domNode && triggerContainer && searchNode) {
            scrollIntoView(domNode, triggerContainer, {
              onlyScrollIfNeeded: true,
              offsetTop: searchNode.offsetHeight,
            });
          }
        });
      }
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
  onComponentKeyDown = event => {
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

  onDeselect = (wrappedValue, node, nodeEventInfo) => {
    const { onDeselect } = this.props;
    if (!onDeselect) return;

    onDeselect(wrappedValue, node, nodeEventInfo);
  };

  onSelectorClear = event => {
    const { disabled } = this.props;
    if (disabled) return;

    this.triggerChange([], []);

    if (!this.isSearchValueControlled()) {
      this.setUncontrolledState({
        searchValue: '',
        filteredTreeNodes: null,
      });
    }

    event.stopPropagation();
  };

  onMultipleSelectorRemove = (event, removeValue) => {
    event.stopPropagation();

    const { valueList, missValueList, valueEntities } = this.state;

    const { treeCheckable, treeCheckStrictly, treeNodeLabelProp, disabled } = this.props;
    if (disabled) return;

    // Find trigger entity
    const triggerEntity = valueEntities[removeValue];

    // Clean up value
    let newValueList = valueList;
    if (triggerEntity) {
      // If value is in tree
      if (treeCheckable && !treeCheckStrictly) {
        newValueList = valueList.filter(({ value }) => {
          const entity = valueEntities[value];
          return !isPosRelated(entity.pos, triggerEntity.pos);
        });
      } else {
        newValueList = valueList.filter(({ value }) => value !== removeValue);
      }
    }

    const triggerNode = triggerEntity ? triggerEntity.node : null;

    const extraInfo = {
      triggerValue: removeValue,
      triggerNode,
    };
    const deselectInfo = {
      node: triggerNode,
    };

    // [Legacy] Little hack on this to make same action as `onCheck` event.
    if (treeCheckable) {
      const filteredEntityList = newValueList.map(({ value }) => valueEntities[value]);

      deselectInfo.event = 'check';
      deselectInfo.checked = false;
      deselectInfo.checkedNodes = filteredEntityList.map(({ node }) => node);
      deselectInfo.checkedNodesPositions = filteredEntityList.map(({ node, pos }) => ({
        node,
        pos,
      }));

      if (treeCheckStrictly) {
        extraInfo.allCheckedNodes = deselectInfo.checkedNodes;
      } else {
        // TODO: It's too expansive to get `halfCheckedKeys` in onDeselect. Not pass this.
        extraInfo.allCheckedNodes = flatToHierarchy(filteredEntityList).map(({ node }) => node);
      }
    } else {
      deselectInfo.event = 'select';
      deselectInfo.selected = false;
      deselectInfo.selectedNodes = newValueList.map(
        ({ value }) => (valueEntities[value] || {}).node,
      );
    }

    // Some value user pass prop is not in the tree, we also need clean it
    const newMissValueList = missValueList.filter(({ value }) => value !== removeValue);

    let wrappedValue;
    if (this.isLabelInValue()) {
      wrappedValue = {
        label: triggerNode ? triggerNode.props[treeNodeLabelProp] : null,
        value: removeValue,
      };
    } else {
      wrappedValue = removeValue;
    }

    this.onDeselect(wrappedValue, triggerNode, deselectInfo);

    this.triggerChange(newMissValueList, newValueList, extraInfo);
  };

  // ===================== Popup ======================
  onValueTrigger = (isAdd, nodeList, nodeEventInfo, nodeExtraInfo) => {
    const { node } = nodeEventInfo;
    const { value } = node.props;
    const { missValueList, valueEntities, keyEntities, searchValue } = this.state;
    const {
      disabled,
      inputValue,
      treeNodeLabelProp,
      onSelect,
      onSearch,
      multiple,
      treeCheckable,
      treeCheckStrictly,
      autoClearSearchValue,
    } = this.props;
    const label = node.props[treeNodeLabelProp];

    if (disabled) return;

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
    } else {
      this.onDeselect(wrappedValue, node, nodeEventInfo);
    }

    // Get wrapped value list.
    // This is a bit hack cause we use key to match the value.
    let newValueList = nodeList.map(({ props }) => ({
      value: props.value,
      label: props[treeNodeLabelProp],
    }));

    // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
    // We need calculate the missing nodes.
    if (treeCheckable && !treeCheckStrictly) {
      let keyList = newValueList.map(({ value: val }) => valueEntities[val].key);
      if (isAdd) {
        keyList = conductCheck(keyList, true, keyEntities).checkedKeys;
      } else {
        keyList = conductCheck([valueEntities[value].key], false, keyEntities, {
          checkedKeys: keyList,
        }).checkedKeys;
      }
      newValueList = keyList.map(key => {
        const {
          node: { props },
        } = keyEntities[key];
        return {
          value: props.value,
          label: props[treeNodeLabelProp],
        };
      });
    }

    // Clean up `searchValue` when this prop is set
    if (autoClearSearchValue || inputValue === null) {
      // Clean state `searchValue` if uncontrolled
      if (!this.isSearchValueControlled() && (multiple || treeCheckable)) {
        this.setUncontrolledState({
          searchValue: '',
          filteredTreeNodes: null,
        });
      }

      // Trigger onSearch if `searchValue` to be empty.
      // We should also trigger onSearch with empty string here
      // since if user use `treeExpandedKeys`, it need user have the ability to reset it.
      if (onSearch && searchValue && searchValue.length) {
        onSearch('');
      }
    }

    // [Legacy] Provide extra info
    const extraInfo = {
      ...nodeExtraInfo,
      triggerValue: value,
      triggerNode: node,
    };

    this.triggerChange(missValueList, newValueList, extraInfo);
  };

  onTreeNodeSelect = (_, nodeEventInfo) => {
    const { valueList, valueEntities } = this.state;
    const { treeCheckable, multiple } = this.props;
    if (treeCheckable) return;

    if (!multiple) {
      this.setOpenState(false);
    }

    const isAdd = nodeEventInfo.selected;
    const {
      props: { value: selectedValue },
    } = nodeEventInfo.node;

    let newValueList;

    if (!multiple) {
      newValueList = [{ value: selectedValue }];
    } else {
      newValueList = valueList.filter(({ value }) => value !== selectedValue);
      if (isAdd) {
        newValueList.push({ value: selectedValue });
      }
    }

    const selectedNodes = newValueList
      .map(({ value }) => valueEntities[value])
      .filter(entity => entity)
      .map(({ node }) => node);

    this.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, { selected: isAdd });
  };

  onTreeNodeCheck = (_, nodeEventInfo) => {
    const { searchValue, keyEntities, valueEntities, valueList } = this.state;
    const { treeCheckStrictly } = this.props;

    const { checkedNodes, checkedNodesPositions } = nodeEventInfo;
    const isAdd = nodeEventInfo.checked;

    const extraInfo = {
      checked: isAdd,
    };

    let checkedNodeList = checkedNodes;

    // [Legacy] Check event provide `allCheckedNodes`.
    // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
    // - Related: Show the top checked nodes and has children prop.
    // - Unrelated: Show all the checked nodes.
    if (searchValue) {
      const oriKeyList = valueList
        .map(({ value }) => valueEntities[value])
        .filter(entity => entity)
        .map(({ key }) => key);

      let keyList;
      if (isAdd) {
        keyList = Array.from(
          new Set([
            ...oriKeyList,
            ...checkedNodeList.map(({ props: { value } }) => valueEntities[value].key),
          ]),
        );
      } else {
        keyList = conductCheck([nodeEventInfo.node.props.eventKey], false, keyEntities, {
          checkedKeys: oriKeyList,
        }).checkedKeys;
      }

      checkedNodeList = keyList.map(key => keyEntities[key].node);

      // Let's follow as not `treeCheckStrictly` format
      extraInfo.allCheckedNodes = keyList.map(key => cleanEntity(keyEntities[key]));
    } else if (treeCheckStrictly) {
      extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
    } else {
      extraInfo.allCheckedNodes = flatToHierarchy(checkedNodesPositions);
    }

    this.onValueTrigger(isAdd, checkedNodeList, nodeEventInfo, extraInfo);
  };

  // ==================== Trigger =====================

  onDropdownVisibleChange = open => {
    const { multiple, treeCheckable } = this.props;
    const { searchValue } = this.state;

    // When set open success and single mode,
    // we will reset the input content.
    if (open && !multiple && !treeCheckable && searchValue) {
      this.setUncontrolledState({
        searchValue: '',
        filteredTreeNodes: null,
      });
    }

    this.setOpenState(open, true);
  };

  onSearchInputChange = ({ target: { value } }) => {
    const { treeNodes, valueEntities } = this.state;
    const { onSearch, filterTreeNode, treeNodeFilterProp } = this.props;

    if (onSearch) {
      onSearch(value);
    }

    let isSet = false;

    if (!this.isSearchValueControlled()) {
      isSet = this.setUncontrolledState({
        searchValue: value,
      });
      this.setOpenState(true);
    }

    if (isSet) {
      // Do the search logic
      const upperSearchValue = String(value).toUpperCase();

      let filterTreeNodeFn = filterTreeNode;
      if (filterTreeNode === false) {
        filterTreeNodeFn = () => true;
      } else if (!filterTreeNodeFn) {
        filterTreeNodeFn = (_, node) => {
          const nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
          return nodeValue.indexOf(upperSearchValue) !== -1;
        };
      }

      this.setState({
        filteredTreeNodes: getFilterTree(
          treeNodes,
          value,
          filterTreeNodeFn,
          valueEntities,
          SelectNode,
        ),
      });
    }
  };

  onSearchInputKeyDown = event => {
    const { searchValue, valueList } = this.state;

    const { keyCode } = event;

    if (KeyCode.BACKSPACE === keyCode && this.isMultiple() && !searchValue && valueList.length) {
      const lastValue = valueList[valueList.length - 1].value;
      this.onMultipleSelectorRemove(event, lastValue);
    }
  };

  onChoiceAnimationLeave = () => {
    raf(() => {
      this.forcePopupAlign();
    });
  };

  setPopupRef = popup => {
    this.popup = popup;
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = state => {
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

    this.setUncontrolledState({ open });
  };

  // Tree checkable is also a multiple case
  isMultiple = () => {
    const { multiple, treeCheckable } = this.props;
    return !!(multiple || treeCheckable);
  };

  isLabelInValue = () => {
    return isLabelInValue(this.props);
  };

  // [Legacy] To align with `Select` component,
  // We use `searchValue` instead of `inputValue`
  // but currently still need support that.
  // Add this method the check if is controlled
  isSearchValueControlled = () => {
    const { inputValue } = this.props;
    if ('searchValue' in this.props) return true;
    return 'inputValue' in this.props && inputValue !== null;
  };

  forcePopupAlign = () => {
    const $trigger = this.selectTriggerRef.current;

    if ($trigger) {
      $trigger.forcePopupAlign();
    }
  };

  delayForcePopupAlign = () => {
    // Wait 2 frame to avoid dom update & dom algin in the same time
    // https://github.com/ant-design/ant-design/issues/12031
    raf(() => {
      raf(this.forcePopupAlign);
    });
  };

  /**
   * 1. Update state valueList.
   * 2. Fire `onChange` event to user.
   */
  triggerChange = (missValueList, valueList, extraInfo = {}) => {
    const { valueEntities, searchValue, selectorValueList: prevSelectorValueList } = this.state;
    const { onChange, disabled, treeCheckable, treeCheckStrictly } = this.props;

    if (disabled) return;

    // Trigger
    const extra = {
      // [Legacy] Always return as array contains label & value
      preValue: prevSelectorValueList.map(({ label, value }) => ({ label, value })),
      ...extraInfo,
    };

    // Format value by `treeCheckStrictly`
    const selectorValueList = formatSelectorValue(valueList, this.props, valueEntities);

    if (!('value' in this.props)) {
      const newState = {
        missValueList,
        valueList,
        selectorValueList,
      };

      if (searchValue && treeCheckable && !treeCheckStrictly) {
        newState.searchHalfCheckedKeys = getHalfCheckedKeys(valueList, valueEntities);
      }

      this.setState(newState);
    }

    // Only do the logic when `onChange` function provided
    if (onChange) {
      let connectValueList;

      // Get value by mode
      if (this.isMultiple()) {
        connectValueList = [...missValueList, ...selectorValueList];
      } else {
        connectValueList = selectorValueList.slice(0, 1);
      }

      let labelList = null;
      let returnValue;

      if (this.isLabelInValue()) {
        returnValue = connectValueList.map(({ label, value }) => ({ label, value }));
      } else {
        labelList = [];
        returnValue = connectValueList.map(({ label, value }) => {
          labelList.push(label);
          return value;
        });
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
      valueList,
      missValueList,
      selectorValueList,
      searchHalfCheckedKeys,
      valueEntities,
      keyEntities,
      searchValue,
      open,
      focused,
      treeNodes,
      filteredTreeNodes,
    } = this.state;
    const { prefixCls, treeExpandedKeys, onTreeExpand } = this.props;
    const isMultiple = this.isMultiple();

    const passProps = {
      ...this.props,
      isMultiple,
      valueList,
      searchHalfCheckedKeys,
      selectorValueList: [...missValueList, ...selectorValueList],
      valueEntities,
      keyEntities,
      searchValue,
      upperSearchValue: (searchValue || '').toUpperCase(), // Perf save
      open,
      focused,
      onChoiceAnimationLeave: this.onChoiceAnimationLeave,
      dropdownPrefixCls: `${prefixCls}-dropdown`,
      ariaId: this.ariaId,
    };

    const Popup = isMultiple ? MultiplePopup : SinglePopup;
    const $popup = (
      <Popup
        ref={this.setPopupRef}
        {...passProps}
        onTreeExpanded={this.delayForcePopupAlign}
        treeNodes={treeNodes}
        filteredTreeNodes={filteredTreeNodes}
        // Tree expanded control
        treeExpandedKeys={treeExpandedKeys}
        onTreeExpand={onTreeExpand}
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

Select.TreeNode = SelectNode;
Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

// Let warning show correct component name
Select.displayName = 'TreeSelect';

polyfill(Select);

export default Select;
