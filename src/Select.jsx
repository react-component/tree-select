/**
 * ARIA: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
 * Sample: https://www.w3.org/blog/wai-components-gallery/widget/combobox-with-aria-autocompleteinline/
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
  mapNodesToValueEntities, isPosRelated,
  dataToTree, flatToHierarchy,
  isLabelInValue,
} from './util';
import { valueProp } from './propTypes';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    multiple: PropTypes.bool,
    showArrow: PropTypes.bool,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    value: valueProp,
    defaultValue: valueProp,
    showSearch: PropTypes.bool,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    maxTagTextLength: PropTypes.number,
    showCheckedStrategy: PropTypes.oneOf([
      SHOW_ALL, SHOW_PARENT, SHOW_CHILD,
    ]),

    dropdownMatchSelectWidth: PropTypes.bool,
    treeData: PropTypes.any,
    treeNodeLabelProp: PropTypes.string,
    treeCheckable: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeIcon: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,

    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onChange: PropTypes.func,
    onDropdownVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    showArrow: true,
    showSearch: true,
    showCheckedStrategy: SHOW_CHILD,
    // TODO: double confirm
    dropdownMatchSelectWidth: false,
    treeNodeLabelProp: 'title',
    treeIcon: false,
  };

  static childContextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...selectorContextTypes,
      ...multipleSelectorContextTypes,
      ...popupContextTypes,
    }),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // React 16.4 will support `prevProps` natively.
    // Consider the capacity on 16.3, we have to do this ourselves.
    const { prevProps = {} } = prevState;
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

    // Tree Nodes
    processState('treeData', (propValue) => {
      newState.treeNodes = dataToTree(propValue);
    });

    // If `treeData` not provide, use children TreeNodes
    if (!('treeData' in nextProps)) {
      processState('children', (propValue) => {
        newState.treeNodes = propValue;
      });
    }

    // Entity List
    if (newState.treeNodes) {
      newState.entities = mapNodesToValueEntities(newState.treeNodes);
    }

    // Value List
    processState('value', (propValue) => {
      newState.valueList = formatInternalValue(propValue, nextProps);
      newState.selectorValueList = formatSelectorValue(
        newState.valueList, nextProps, newState.entities || prevState.entities
      );
    });

    // Input value
    processState('inputValue', (propValue) => {
      newState.inputValue = propValue;
    });

    // Checked Strategy
    processState('showCheckedStrategy', () => {
      newState.valueList = newState.valueList || prevState.valueList;
      newState.selectorValueList = newState.selectorValueList || formatSelectorValue(
        newState.valueList, nextProps, newState.entities || prevState.entities
      );
    });

    return newState;
  }

  constructor() {
    super();

    this.selectTriggerRef = createRef();
    this.searchInputRef = createRef();
    // IE need addition check for the content width
    // ref: https://github.com/react-component/tree-select/issues/65
    this.searchMirrorInstanceRef = createRef();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = generateAriaId();
  }

  state = {
    valueList: [],
    selectorValueList: [], // Used for multiple selector
    entities: {},
  };

  getChildContext() {
    // TODO: Handle this
    return {
      rcTreeSelect: {
        onSelectorFocus: this.onSelectorFocus,
        onSelectorBlur: this.onSelectorBlur,
        onSelectorKeyDown: this.onComponentKeyDown,
        onMultipleSelectorRemove: this.onMultipleSelectorRemove,

        onTreeNodeSelect: this.onTreeNodeSelect,
        onTreeNodeCheck: this.onTreeNodeCheck,
        onPopupKeyDown: this.onComponentKeyDown,
        onTreeStateUpdate: this.onTreeStateUpdate,
      },
    };
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
    const { which } = event;

    if (!open) {
      if ([KeyCode.ENTER, KeyCode.DOWN].indexOf(which) !== -1) {
        this.setState({ open: true });
      }
    } else if ([KeyCode.UP, KeyCode.DOWN, KeyCode.LEFT, KeyCode.RIGHT].indexOf(which) !== -1) {
      // TODO: Handle `open` state
      event.preventDefault();
    }
  };

  onMultipleSelectorRemove = (event, removeValue) => {
    event.stopPropagation();

    const { valueList, entities, inputValue } = this.state;

    const { treeCheckable, treeCheckStrictly } = this.props;

    // Find trigger entity
    const triggerEntity = entities[removeValue];

    // Clean up value
    let newValueList;
    if (treeCheckable && !treeCheckStrictly) {
      newValueList = valueList.filter(({ value }) => {
        const entity = entities[value];
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
      const filteredEntityList = newValueList.map(({ value }) => entities[value]);
      if (treeCheckStrictly || inputValue) {
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
    const { title, value } = node.props;
    const { onSelect, onDeselect } = this.props;

    // Wrap the return value for user
    let wrappedValue;
    if (this.isLabelInValue()) {
      wrappedValue = {
        value,
        label: title,
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
    const newValueList = nodeList.map(({ key, props }) => ({
      value: props.value,
      label: props.title,
      key,
    }));

    // TODO: Consider treeCheckable

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
    const { inputValue } = this.state;
    const { treeCheckStrictly } = this.props;

    const { checkedNodes, checkedNodesPositions } = nodeEventInfo;
    const isAdd = nodeEventInfo.checked;

    const extraInfo = {
      checked: isAdd,
    };

    // [Legacy] TODO: add optimize prop to skip node process
    // [Legacy] TODO: Here old code use cache, double check necessary
    // [Legacy] Check event provide `allCheckedNodes`.
    // When `treeCheckStrictly` or internal `inputValue` is set, TreeNode will be unrelated:
    // - Related: Show the top checked nodes and has children prop.
    // - Unrelated: Show all the checked nodes.
    if (treeCheckStrictly || inputValue) {
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
  onInputChange = () => {};
  onInputKeyDown = () => {};
  onPlaceholderClick = () => {};

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

    this.setState({ open }, () => {
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
    const { entities } = this.state;
    const { onChange } = this.props;
    const labelList = valueList.map(({ label }) => label);

    // Trigger
    const extra = {
      // [Legacy] Always return as array contains label & value
      preValue: this.state.valueList.map(({ label, value }) => ({ label, value })),
      ...extraInfo,
    };

    // Format value by `treeCheckStrictly`
    const selectorValueList = formatSelectorValue(valueList, this.props, entities);

    this.setState({
      valueList,
      selectorValueList,
    });

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
  };

  // ===================== Render =====================
  /**
   * [Legacy] Select redesign the search input position but TreeSelect not.
   * Since new version tag is released. Let's keep the current design.
   * This function will give search placeholder to:
   * - multiple: input box
   * - single: popup panel
   *
   * @param visible [Legacy] Use current value to decide display or not
   * @param placeholder
   */
  renderSearchPlaceholder = (visible, placeholder) => {
    const { prefixCls } = this.props;
    if (visible && placeholder) {
      return (
        <span
          onClick={this.onPlaceholderClick}
          className={`${prefixCls}-search__field__placeholder`}
        >
          {placeholder}
        </span>
      );
    }
    return null;
  };

  /**
   * [Legacy] Search input is in diff place when mode diff.
   * And for the diff mode placeholder position is also diff.
   * render function need less logic on mode.
   * Let's just move the placeholder out as argument.
   *
   * @param additionalPlaceholder
   */
  renderInputElement(additionalPlaceholder) {
    const { inputValue } = this.state;
    const { prefixCls, disabled } = this.props;
    return (
      <span className={`${prefixCls}-search__field__wrap`}>
        <input
          ref={this.searchInputRef}
          onChange={this.onInputChange}
          onKeyDown={this.onInputKeyDown}
          value={inputValue}
          disabled={disabled}
          className={`${prefixCls}-search__field`}
        />
        <span
          ref={this.searchMirrorInstanceRef}
          className={`${prefixCls}-search__field__mirror`}
        >
          {inputValue}&nbsp;
        </span>
        {additionalPlaceholder}
      </span>
    );
  }

  render() {
    const {
      valueList, selectorValueList,
      open, focused, treeNodes,
    } = this.state;
    const { prefixCls } = this.props;
    const isMultiple = this.isMultiple();



    const passProps = {
      ...this.props,
      isMultiple,
      valueList,
      selectorValueList,
      open,
      focused,
      dropdownPrefixCls: `${prefixCls}-dropdown`,
      renderSearchPlaceholder: this.renderSearchPlaceholder,
      ariaId: this.ariaId,
    };

    // TODO: process the logic of mode diff
    const $popup = isMultiple ? (
      <MultiplePopup {...passProps}>
        {treeNodes}
      </MultiplePopup>
    ) : (
      <SinglePopup {...passProps}>
        {treeNodes}
      </SinglePopup>
    );

    const $input = isMultiple ? (
      <MultipleSelector {...passProps} />
    ) : (
      <SingleSelector {...passProps} />
    );

    return (
      <SelectTrigger
        {...passProps}

        ref={this.selectTriggerRef}
        popupElement={$popup}

        onKeyDown={this.onKeyDown}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {$input}
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
