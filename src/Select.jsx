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
import { selectorContextTypes } from './BaseSelector';
import SingleSelector from './SingleSelector';
import MultipleSelector from './MultipleSelector';
import SinglePopup from './SinglePopup';
import MultiplePopup from './MultiplePopup';

import {
  createRef, generateAriaId,
  formatValue, mapValueWithLabel,
  dataToTree,
} from './util';
import { valueProp } from './propTypes';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    multiple: PropTypes.bool,
    treeCheckable: PropTypes.bool,
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

    treeData: PropTypes.any,
    treeNodeLabelProp: PropTypes.string,
    treeIcon: PropTypes.bool,

    onDropdownVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    showArrow: true,
    showSearch: true,
    // TODO: double confirm
    treeNodeLabelProp: 'title',
    treeIcon: false,
  };

  static childContextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...selectorContextTypes,
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
      newState.valueList = mapValueWithLabel(valueList, treeNodes);
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

    this.state = {
      treeNodes,
      valueList: mapValueWithLabel(valueList, treeNodes),
      inputValue: inputValue || '',
      open: open || defaultOpen || false,
    };

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
      },
    };
  }

  // ==================== Selector ====================
  onSelectorFocus = () => {
    this.setState({ focused: true });
  };
  onSelectorBlur = () => {
    this.setState({ focused: false });

    // TODO: Close when Popup is also not focused
  };

  // Handle key board event in both Selector and Popup
  onComponentKeyDown = ({ which }) => {
    const { open } = this.state;

    if (!open) {
      if (which === KeyCode.ENTER || which === KeyCode.DOWN) {
        this.setState({ open: true });
      }
    } else {
      // TODO: Handle `open` state
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
        popupElement={$popup}

        onKeyDown={this.onKeyDown}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {$input}
      </SelectTrigger>
    );
  }
}

polyfill(Select);

export default Select;
