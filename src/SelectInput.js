import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';

class SelectInput extends React.Component {
  static propTypes = {
    // Pass by outside user props
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    allowClear: PropTypes.bool,
    showArrow: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,

    onClick: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,

    // Pass by Select
    open: PropTypes.bool,
    focused: PropTypes.bool,
    isMultiple: PropTypes.bool,
    value: PropTypes.array, // Internal always array
    inputValue: PropTypes.string,
  };

  // TODO: Placeholder
  onClearSelection = () => {};

  /**
   * Return value nodes. Will return <ul> if multiple value.
   */
  renderValueNodes = () => {
    const {
      prefixCls, placeholder,
      isMultiple, value,
    } = this.props;

    // Single value mode
    if (!isMultiple) {
      let innerNode;
      if (value.length) {
        innerNode = (
          <span
            key="value"
            title={value[0].label}
            className={`${prefixCls}-selection-selected-value`}
          >
            {value[0].label}
          </span>
        );
      } else {
        innerNode = (
          <span
            key="placeholder"
            className={`${prefixCls}-selection__placeholder`}
          >
          {placeholder}
        </span>
        );
      }

      return (
        <span className={`${prefixCls}-selection__rendered`}>
          {innerNode}
        </span>
      );
    }

    // Multiple value mode
    return null;
  };

  renderClear = () => {
    const { prefixCls, allowClear, value } = this.props;

    if (!allowClear || value.length === 0) {
      // TODO: origin code check value[0].value. Need confirm
      return null;
    }

    return (
      <span
        key="clear"
        className={`${prefixCls}-selection__clear`}
        onClick={this.onClearSelection}
      />
    );
  };

  renderArrow = () => {
    const { prefixCls, showArrow, isMultiple } = this.props;

    if (isMultiple || !showArrow) {
      return null;
    }

    return (
      <span
        key="arrow"
        className={`${prefixCls}-arrow`}
        style={{ outline: 'none' }}
      >
        <b/>
      </span>
    );
  };

  renderSearchPlaceholder = () => {
    const {
      prefixCls, placeholder, searchPlaceholder,
      isMultiple, inputValue, value,
    } = this.props;

    if (!isMultiple) {
      return null;
    }

    // TODO: do this
    const hidden = !!inputValue || value.length;

    const currentPlaceholder = placeholder || searchPlaceholder;
    if (currentPlaceholder) {
      return (
        <span
          style={{ display: hidden ? 'none' : 'block' }}
          onClick={this.onPlaceholderClick}
          className={`${prefixCls}-search__field__placeholder`}
        >
          {currentPlaceholder}
        </span>
      );
    }
    return null;
  };

  render() {
    const {
      prefixCls, className, style,
      onClick, onBlur, onFocus,
      allowClear, disabled,

      open, focused, isMultiple,
    } = this.props;

    const selectionProps = {};
    if (!isMultiple) {
      selectionProps.onKeyDown = this.onKeyDown;
      selectionProps.tabIndex = 0;
    }

    // TODO: here miss `setRef(selection)`
    return (
      <span
        style={style}
        onClick={onClick}
        className={classNames(
          prefixCls,
          className,
          {
            [`${prefixCls}-open`]: open,
            [`${prefixCls}-focused`]: open || focused,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-enabled`]: !disabled,
            [`${prefixCls}-allow-clear`]: !!allowClear,
          },
        )}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {/* Selection group */}
        <span
          key="selection"
          className={classNames(
            `${prefixCls}-selection`,
            {
              [`${prefixCls}-selection--multiple`]: isMultiple,
              [`${prefixCls}-selection--single`]: !isMultiple,
            },
          )}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="true"
          aria-expanded={open}
          {...selectionProps}
        >
          {this.renderValueNodes()}
          {this.renderClear()}
          {this.renderArrow()}
          {this.renderSearchPlaceholder()}
        </span>
      </span>
    );
  }
}

polyfill(SelectInput);

export default SelectInput;
