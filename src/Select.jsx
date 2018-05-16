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
  formatValue,
  mapValueToEntity, mapEntityToValue, isPosRelated,
  dataToTree, flatToHierarchy,
  isLabelInValue,
  requestIdleCallback,
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
    const newState = {};
    let changed = false;

    // Check if state need update
    function processState(propName, updater) {
      if (propName in nextProps) {
        changed = true;
        updater(nextProps[propName]);
        return true;
      }
      return false;
    }

    // TODO: Process all the pass props

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

    // Value
    processState('value', (propValue) => {
      const valueList = formatValue(propValue, nextProps);

      // Map with label
      const treeNodes = newState.treeNodes || prevState.treeNodes;
      newState.entityList = mapValueToEntity(valueList, treeNodes);
      newState.valueList = mapEntityToValue(newState.entityList);
    });

    // Input value
    processState('inputValue', (propValue) => {
      newState.inputValue = propValue;
    });

    if (changed) {
      return newState;
    }
    return null;
  }

  constructor(props) {
    super();

    const {
      value, defaultValue,
      treeData, children,
      open, defaultOpen, inputValue,
    } = props;

    const valueList = formatValue(value || defaultValue, props);
    const treeNodes = treeData ? dataToTree(treeData) : (children || []);
    const entityList = mapValueToEntity(valueList, treeNodes);

    this.state = {
      treeNodes,
      entityList,
      valueList: mapEntityToValue(entityList),
      inputValue: inputValue || '',
      open: open || defaultOpen || false,
    };

    this.selectTriggerRef = createRef();
    this.searchInputRef = createRef();
    // IE need addition check for the content width
    // ref: https://github.com/react-component/tree-select/issues/65
    this.searchMirrorInstanceRef = createRef();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = generateAriaId();
  }

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

    let { entityList } = this.state;
    const { valueList, treeNodes, inputValue } = this.state;
    const { treeCheckable, treeCheckStrictly } = this.props;

    // Generate `entityList` if not exist
    if (!entityList) {
      entityList = mapValueToEntity(valueList, treeNodes);
    }

    // Find trigger entity
    let triggerEntity = null;

    entityList.some((entity) => {
      if (entity.node.props.value === removeValue) {
        triggerEntity = entity;
        return true;
      }
      return false;
    });

    // Clean up value
    let filteredEntityList;
    if (treeCheckable && !treeCheckStrictly) {
      filteredEntityList = entityList.filter(({ pos }) => (
        !isPosRelated(pos, triggerEntity.pos)
      ));
    } else {
      filteredEntityList = entityList.filter(({ pos }) => (
        pos !== triggerEntity.pos
      ));
    }

    const extraInfo = {
      triggerValue: removeValue,
      triggerNode: triggerEntity.node,
    };

    // [Legacy] Little hack on this to make same action as `onCheck` event.
    if (treeCheckable) {
      if (treeCheckStrictly || inputValue) {
        extraInfo.allCheckedNodes = filteredEntityList.map(({ node }) => node);
      } else {
        extraInfo.allCheckedNodes = flatToHierarchy(filteredEntityList);
      }
    }

    const newValueList = filteredEntityList.map(({ node: { props, key } }) => ({
      label: props.title,
      value: props.value,
      key,
    }));

    this.triggerChange(newValueList, extraInfo, filteredEntityList);
  };

  // ===================== Popup ======================
  onValueTrigger = (isAdd, nodeList, nodeEventInfo, nodeExtraInfo) => {
    const { node, checkedNodesPositions } = nodeEventInfo;
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

    // Reuse `checkedNodesPositions` to create `entityList` for optimization.
    let entityList = null;
    if (checkedNodesPositions) {
      entityList = checkedNodesPositions.map((entity) => ({
        node: entity.node,
        pos: entity.pos,
        key: entity.node.key,
      }));
    }

    this.triggerChange(newValueList, extraInfo, entityList);
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
   * Convert internal state `valueList` to user needed value list.
   * This will return an array list. You need check if is not multiple when return.
   *
   * `allCheckedNodes` is used for `treeCheckStrictly`
   */
  formatReturnValue = (valueList, allCheckedNodes) => {
    const { treeCheckable, treeCheckStrictly, showCheckedStrategy } = this.props;

    let targetValueList = valueList;

    // Will hide some value if `showCheckedStrategy` is set
    if (treeCheckable && !treeCheckStrictly) {
      if (showCheckedStrategy === SHOW_PARENT) {
        // Only get the parent checked value
        targetValueList = allCheckedNodes.map(({ node: { props } }) => ({
          label: props.title,
          value: props.value,
        }));

      } else if (showCheckedStrategy === SHOW_CHILD) {
        // Only get the children checked value
        targetValueList = [];

        // Find the leaf children
        const traverse = ({ node, children }) => {
          if (!children || children.length === 0) {
            targetValueList.push({
              label: node.props.title,
              value: node.props.value,
            });
            return;
          }

          children.forEach((entity) => {
            traverse(entity);
          });
        };

        allCheckedNodes.forEach((entity) => {
          traverse(entity);
        });
      }
    }

    if (this.isLabelInValue()) {
      return targetValueList.map(({ label, value }) => ({ label, value }));
    }
    return targetValueList.map(({ value }) => value);
  };

  /**
   * 1. Update state valueList.
   * 2. Fire `onChange` event to user.
   */
  triggerChange = (valueList, extraInfo = {}, entityList = null) => {
    const { onChange } = this.props;
    const labelList = valueList.map(({ label }) => label);

    // Update `valueList`.
    // We needn't use entityList since `valueList` is already fully wrapped.
    // To avoid `entityList` out of date for `onTreeNodeRemove` miss use,
    // default set to null if not provided
    this.setState({
      valueList,
      entityList,
    });

    // This function will delay to create the `entityList` if not exist.
    // This is not a promise execution, only when browser support.
    requestIdleCallback(() => {
      if (!entityList && this.state.valueList === valueList) {
        this.setState({
          entityList: mapValueToEntity(valueList, this.state.treeNodes),
        });
      }
    });

    // Trigger
    const extra = {
      // [Legacy] Always return as array contains label & value
      preValue: this.state.valueList.map(({ label, value }) => ({ label, value })),
      ...extraInfo,
    };

    // Format value
    let targetValue = this.formatReturnValue(valueList, extraInfo.allCheckedNodes);
    if (!this.isMultiple()) {
      targetValue = targetValue[0];
    }

    onChange(targetValue, labelList, extra);
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
    const { valueList, open, focused, treeNodes } = this.state;
    const { prefixCls } = this.props;
    const isMultiple = this.isMultiple();
    const passProps = {
      ...this.props,
      isMultiple,
      valueList,
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
