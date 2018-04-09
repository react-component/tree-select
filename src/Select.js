import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import SelectTrigger from './SelectTrigger';
import SelectPopup from './SelectPopup';
import SelectInput from './SelectInput';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    multiple: PropTypes.bool,
    treeCheckable: PropTypes.bool,
    showArrow: PropTypes.bool,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,

    onDropdownVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    showArrow: true,
    // TODO: double confirm
  };

  constructor(props) {
    super();

    const { open, defaultOpen } = props;
    this.state = {
      value: [],
      open: open || defaultOpen,
    };
  }

  onDropdownVisibleChange = (open) => {
    this.setOpenState(open, true);
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

  render() {
    const { value, open } = this.state;
    const isMultiple = this.isMultiple();
    const passProps = {
      ...this.props,
      isMultiple,
      value,
      open,
    };

    const $popup = <SelectPopup />;

    return (
      <SelectTrigger
        {...passProps}
        popupElement={$popup}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        <SelectInput {...passProps} />
      </SelectTrigger>
    );
  }
}

polyfill(Select);

export default Select;
