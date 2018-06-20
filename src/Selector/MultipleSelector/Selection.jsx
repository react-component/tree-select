import React from 'react';
import PropTypes from 'prop-types';
import {
  preventDefaultEvent, toTitle,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
} from '../../util';

class Selection extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    maxTagTextLength: PropTypes.number,
    onRemove: PropTypes.func,

    label: PropTypes.node,
    value: PropTypes.string,
  };

  onRemove = (event) => {
    const { onRemove, value } = this.props;
    onRemove(event, value);
  };

  render() {
    const {
      prefixCls, maxTagTextLength,
      label, value,
    } = this.props;

    let content = label || value;
    if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
      content = `${content.slice(0, maxTagTextLength)}...`;
    }

    return (
      <li
        style={UNSELECTABLE_STYLE}
        {...UNSELECTABLE_ATTRIBUTE}
        role="menuitem"
        onMouseDown={preventDefaultEvent}
        className={`${prefixCls}-selection__choice`}
        title={toTitle(label)}
      >
        <span
          className={`${prefixCls}-selection__choice__remove`}
          onClick={this.onRemove}
        />
        <span className={`${prefixCls}-selection__choice__content`}>
          {content}
        </span>
      </li>
    );
  }
}

export default Selection;
