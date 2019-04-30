import React from 'react';
import PropTypes from 'prop-types';

import generateSelector, { selectorPropTypes } from '../../Base/BaseSelector';
import { createRef } from '../../util';
import SelectorList from './SelectorList';

const Selector = generateSelector('multiple');

export const multipleSelectorContextTypes = {
  onMultipleSelectorRemove: PropTypes.func.isRequired,
};

class MultipleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
    selectorValueList: PropTypes.array,
    disabled: PropTypes.bool,
    searchValue: PropTypes.string,
    labelInValue: PropTypes.bool,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    onChoiceAnimationLeave: PropTypes.func,
  };

  static contextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...multipleSelectorContextTypes,

      onSearchInputChange: PropTypes.func,
    }),
  };

  constructor() {
    super();
    this.inputRef = createRef();
  }

  onPlaceholderClick = () => {
    this.inputRef.current.focus();
  };

  focus = () => {
    this.inputRef.current.focus();
  };

  blur = () => {
    this.inputRef.current.blur();
  };

  renderPlaceholder = () => {
    const {
      prefixCls,
      placeholder,
      searchPlaceholder,
      searchValue,
      selectorValueList,
    } = this.props;

    const currentPlaceholder = placeholder || searchPlaceholder;

    if (!currentPlaceholder) return null;

    const hidden = searchValue || selectorValueList.length;

    // [Legacy] Not remove the placeholder
    return (
      <span
        style={{
          display: hidden ? 'none' : 'block',
        }}
        onClick={this.onPlaceholderClick}
        className={`${prefixCls}-search__field__placeholder`}
      >
        {currentPlaceholder}
      </span>
    );
  };

  renderSelection = () => {
    const {
      rcTreeSelect: { onMultipleSelectorRemove },
    } = this.context;

    return (
      <SelectorList
        {...this.props}
        onMultipleSelectorRemove={onMultipleSelectorRemove}
        inputRef={this.inputRef}
      />
    );
  };

  render() {
    return (
      <Selector
        {...this.props}
        tabIndex={-1}
        showArrow={false}
        renderSelection={this.renderSelection}
        renderPlaceholder={this.renderPlaceholder}
      />
    );
  }
}

export default MultipleSelector;
