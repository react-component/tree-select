import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';
import KeyCode from 'rc-util/lib/KeyCode';
import generateSelector, { selectorPropTypes } from './BaseSelector';
import { UNSELECTABLE_STYLE, UNSELECTABLE_ATTRIBUTE, preventDefaultEvent } from './util';

const Selector = generateSelector('multiple');

class MultipleSelector extends React.Component {
  static propTypes = {
    ...selectorPropTypes,
    disabled: PropTypes.bool,
    inputValue: PropTypes.string,

    onInputChange: PropTypes.func,
    onInputKeyDown: PropTypes.func,
    onPlaceholderClick: PropTypes.func,
  };

  onKeyDown = (event) => {
    const { disabled, open } = this.props;
    if (disabled) {
      return;
    }

    const keyCode = event.keyCode;
    if (open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  }

  setInputInstanceRef = (ele) => {
    this.$inputInstance = ele;
  };

  setInputMirrorInstanceRef = (ele) => {
    this.$inputMirrorInstance = ele;
  };

  renderInput() {
    const {
      prefixCls, inputValue, disabled,
      onInputChange, onInputKeyDown,
    } = this.props;
    return (
      <span className={`${prefixCls}-search__field__wrap`}>
        <input
          ref={this.setInputInstanceRef}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          value={inputValue}
          disabled={disabled}
          className={`${prefixCls}-search__field`}
        />
        <span
          ref={this.setInputMirrorInstanceRef}
          className={`${prefixCls}-search__field__mirror`}
        >
          {inputValue}&nbsp;
        </span>
      </span>
    );
  }

  renderPlaceholder = () => {
    const {
      prefixCls,
      placeholder, searchPlaceholder,
      inputValue, value,
      onPlaceholderClick,
    } = this.props;

    const currentPlaceholder = placeholder || searchPlaceholder;

    if (!currentPlaceholder) return null;

    const hidden = !!inputValue || value.length;

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
    const { value: valueList } = this.props;
    const {
      choiceTransitionName, prefixCls, maxTagTextLength,
      removeSelected,
    } = this.props;

    const selectedValueNodes = valueList.map(({ label, value }) => {
      let content = label;
      if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
        content = `${content.slice(0, maxTagTextLength)}...`;
      }

      // TODO: Is this OK for role 'menuitem'?
      return (
        <li
          style={UNSELECTABLE_STYLE}
          {...UNSELECTABLE_ATTRIBUTE}
          role="menuitem"
          onMouseDown={preventDefaultEvent}
          className={`${prefixCls}-selection__choice`}
          key={value}
          title={label}
        >
          <span
            className={`${prefixCls}-selection__choice__remove`}
            onClick={() => {
              removeSelected(value)
            }}
          />
          <span className={`${prefixCls}-selection__choice__content`}>
            {content}
          </span>
        </li>
      );
    });

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
