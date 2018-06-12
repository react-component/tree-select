import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';

import generateSelector, { selectorPropTypes } from '../../Base/BaseSelector';
import SearchInput from '../../SearchInput';
import Selection from './Selection';
import { createRef } from '../../util';

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

    onPlaceholderClick: PropTypes.func,
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

  focus = () => {
    this.inputRef.current.focus();
  };
  blur = () => {
    this.inputRef.current.blur();
  };

  renderPlaceholder = () => {
    const {
      prefixCls,
      placeholder, searchPlaceholder,
      searchValue, valueList,
      onPlaceholderClick,
    } = this.props;

    const currentPlaceholder = placeholder || searchPlaceholder;

    if (!currentPlaceholder) return null;

    const hidden = searchValue || valueList.length;

    // [Legacy] Not remove the placeholder
    return (
      <span
        style={{ display: hidden ? 'none' : 'block' }}
        onClick={onPlaceholderClick}
        className={`${prefixCls}-search__field__placeholder`}
      >
        {currentPlaceholder}
      </span>
    );
  }

  renderSelection = () => {
    const {
      selectorValueList, choiceTransitionName, prefixCls,
      onChoiceAnimationLeave,
    } = this.props;
    const { rcTreeSelect: { onMultipleSelectorRemove } } = this.context;

    const selectedValueNodes = selectorValueList.map(({ label, value }) => (
      <Selection
        {...this.props}
        key={value}
        label={label}
        value={value}
        onRemove={onMultipleSelectorRemove}
      />
    ));

    selectedValueNodes.push(<li
      className={`${prefixCls}-search ${prefixCls}-search--inline`}
      key="__input"
    >
      <SearchInput {...this.props} ref={this.inputRef} needAlign />
    </li>);
    const className = `${prefixCls}-selection__rendered`;
    if (choiceTransitionName) {
      return (<Animate
        className={className}
        component="ul"
        transitionName={choiceTransitionName}
        onLeave={onChoiceAnimationLeave}
      >
        {selectedValueNodes}
      </Animate>);
    }
    return (
      <ul className={className} role="menubar">
        {selectedValueNodes}
      </ul>
    );
  }

  render() {
    return (
      <Selector
        {...this.props}
        showArrow={false}
        renderSelection={this.renderSelection}
        renderPlaceholder={this.renderPlaceholder}
      />
    );
  }
}

export default MultipleSelector;
