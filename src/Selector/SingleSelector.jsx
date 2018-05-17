import React from 'react';
import generateSelector, { selectorPropTypes } from '../Base/BaseSelector';

const Selector = generateSelector('single');

class SingleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
  };

  renderSelection = () => {
    const { selectorValueList, placeholder, prefixCls } = this.props;

    let innerNode;

    if (selectorValueList.length) {
      const { label } = selectorValueList[0];
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
