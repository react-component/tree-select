import React from 'react';
import generateSelector, { selectorPropTypes } from './BaseSelector';

const Selector = generateSelector('multiple');

class SingleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
  };

  renderSelection = () => {
    const { value, placeholder, prefixCls } = this.props;

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
  };

  render() {
    return (
      <Selector
        {...this.props}
        renderSelection={this.renderSelection}
      />
    );
  }
}

export default SingleSelector;
