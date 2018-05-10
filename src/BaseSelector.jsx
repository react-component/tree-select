/**
 * Input Box is in different position for different mode.
 * This not the same design as `Select` cause it's followed by antd 0.x `Select`.
 * We will not follow the new design immediately since antd 3.x is already released.
 *
 * So this file named as Selector to avoid confuse.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { createRef } from './util';

export const selectorPropTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  open: PropTypes.bool,
  // value: PropTypes.array,
  valueList: PropTypes.array, // Name as valueList to diff the single value
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  removeSelected: PropTypes.func,

  // Pass by component
  ariaId: PropTypes.string,
};

export default function (modeName) {
  class BaseSelector extends React.Component {
    static propTypes = {
      ...selectorPropTypes,

      // Pass by HOC
      selectorProps: PropTypes.object,
      renderSelection: PropTypes.func.isRequired,
      renderPlaceholder: PropTypes.func,
    };

    constructor() {
      super();

      this.selectionRef = createRef();
    }

    renderClear() {
      const { prefixCls, allowClear, value } = this.props;

      if (!allowClear || !value.length || !value[0].value) {
        return null;
      }

      return (
        <span
          key="clear"
          className={`${prefixCls}-selection__clear`}
          onClick={this.onClearSelection}
        />
      );
    }

    renderArrow() {
      // TODO: multiple || !props.showArrow
      const { prefixCls, showArrow } = this.props;
      if (!showArrow) return null;

      return (
        <span
          key="arrow"
          className={`${prefixCls}-arrow`}
          style={{ outline: 'none' }}
        >
          <b />
        </span>
      );
    }

    render() {
      const {
        prefixCls, className, style,
        open, focused, disabled, allowClear,
        onClick, onBlur, onFocus,
        ariaId,
        renderSelection, selectorProps, renderPlaceholder,
      } = this.props;

      return (
        <span
          style={style}
          onClick={onClick}
          className={classNames({
            [className]: !!className,
            [prefixCls]: 1,
            [`${prefixCls}-open`]: open,
            [`${prefixCls}-focused`]: open || focused,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-enabled`]: !disabled,
            [`${prefixCls}-allow-clear`]: allowClear,
          })}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          <span
            ref={this.selectionRef}
            key="selection"
            className={classNames(
              `${prefixCls}-selection`,
              `${prefixCls}-selection--${modeName}`
            )}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={`${ariaId}_list`}

            {...selectorProps}
          >
            {renderSelection()}
            {this.renderClear()}
            {this.renderArrow()}

            {renderPlaceholder && renderPlaceholder()}
          </span>
        </span>
      );
    }
  }

  polyfill(BaseSelector);

  return BaseSelector;
}
