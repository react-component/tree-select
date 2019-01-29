import React from 'react';
import generateSelector, { selectorPropTypes } from '../Base/BaseSelector';
import { toTitle, createRef } from '../util';

const Selector = generateSelector('single');

class SingleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
  };

  constructor() {
    super();
    this.selectorRef = createRef();
  }

  focus = () => {
    this.selectorRef.current.focus();
  };

  blur = () => {
    this.selectorRef.current.blur();
  };

  renderSelection = () => {
    const { selectorValueList, placeholder, prefixCls } = this.props;

    let innerNode;

    if (selectorValueList.length) {
      const { label, value } = selectorValueList[0];
      innerNode = (
        <span
          key="value"
          title={toTitle(label)}
          className={`${prefixCls}-selection-selected-value`}
        >
          {label || value}
        </span>
      );
    } else {
      innerNode = (
        <span key="placeholder" className={`${prefixCls}-selection__placeholder`}>
          {placeholder}
        </span>
      );
    }

    return <span className={`${prefixCls}-selection__rendered`}>{innerNode}</span>;
  };

  render() {
    return (
      <Selector {...this.props} ref={this.selectorRef} renderSelection={this.renderSelection} />
    );
  }
}

export default SingleSelector;
