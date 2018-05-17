import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';
import KeyCode from 'rc-util/lib/KeyCode';
import generateSelector, { selectorPropTypes } from '../../Base/BaseSelector';
import { createRef } from '../../util';

import Selection from './Selection';

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

    onInputChange: PropTypes.func,
    onInputKeyDown: PropTypes.func,
    onPlaceholderClick: PropTypes.func,
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
    this.mirrorInputRef = createRef();
  }

  componentDidMount() {
    this.alignInputWidth();
  }

  componentDidUpdate(prevProps) {
    const { open, searchValue } = this.props;

    if (open && prevProps.open !== open) {
      this.inputRef.current.focus();
    }


    if (searchValue !== prevProps.searchValue) {
      this.alignInputWidth();
    }
  }

  onKeyDown = (event) => {
    const { disabled, open } = this.props;
    if (disabled) {
      return;
    }

    const keyCode = event.keyCode;
    if (open && !this.inputRef.current) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  }

  /**
   * `scrollWidth` is not correct in IE, do the workaround.
   * ref: https://github.com/react-component/tree-select/issues/65
   */
  alignInputWidth = () => {
    this.inputRef.current.style.width =
      `${this.mirrorInputRef.current.clientWidth}px`;
  };

  renderInput() {
    const {
      prefixCls, searchValue = '', disabled,
      onInputKeyDown,
    } = this.props;
    const { rcTreeSelect: { onSearchInputChange } } = this.context;

    return (
      <span className={`${prefixCls}-search__field__wrap`}>
        <input
          ref={this.inputRef}
          onChange={onSearchInputChange}
          onKeyDown={onInputKeyDown}
          value={searchValue}
          disabled={disabled}
          className={`${prefixCls}-search__field`}
        />
        <span
          ref={this.mirrorInputRef}
          className={`${prefixCls}-search__field__mirror`}
        >
          {searchValue}&nbsp;
        </span>
      </span>
    );
  }

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
      {this.renderInput()}
    </li>);
    const className = `${prefixCls}-selection__rendered`;
    if (choiceTransitionName) {
      // TODO: onChoiceAnimationLeave
      return (<Animate
        className={className}
        component="ul"
        transitionName={choiceTransitionName}
        onLeave={this.onChoiceAnimationLeave}
      >
        {selectedValueNodes}
      </Animate>);
    }
    return (<ul className={className}>{selectedValueNodes}</ul>);
  }

  render() {
    return (
      <Selector
        {...this.props}
        selectorProps={{
          onKeyDown: this.onKeyDown,
          tabIndex: 0,
        }}
        renderSelection={this.renderSelection}
        renderPlaceholder={this.renderPlaceholder}
      />
    );
  }
}

export default MultipleSelector;
