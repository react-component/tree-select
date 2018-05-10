import React from 'react';
import generateSelector, { selectorPropTypes } from './BaseSelector';

const Selector = generateSelector('multiple');

class SingleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
  };

  renderSelection = () => {
    const { valueList, placeholder, prefixCls } = this.props;

    let innerNode;

    if (valueList.length) {
      const { label } = valueList[0];
      innerNode = (
        <span
          key="value"
          title={label}
          className={`${prefixCls}-selection-selected-value`}
        >
          {label}
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
