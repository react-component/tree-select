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
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,

    // Pass by Select
    open: PropTypes.bool,
    focused: PropTypes.bool,
  };

  render() {
    const {
      prefixCls, className, style,
      onClick, onBlur, onFocus,
      allowClear, disabled,

      open, focused,
    } = this.props;

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
      </span>
    );
  }
}

polyfill(SelectInput);

export default SelectInput;
