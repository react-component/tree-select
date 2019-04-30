import React from 'react';
import CSSMotionList from 'rc-animate/lib/CSSMotionList';
import Selection from './Selection';
import SearchInput from '../../SearchInput';

const NODE_SELECTOR = 'selector';
const NODE_SEARCH = 'search';
const TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

const SelectorList = (props) => {
  const {
    selectorValueList,
    choiceTransitionName,
    prefixCls,
    onChoiceAnimationLeave,
    labelInValue,
    maxTagCount,
    maxTagPlaceholder,
    showSearch,
    valueEntities,
    inputRef,
    onMultipleSelectorRemove,
  } = props;
  const nodeKeys = [];

  // Check if `maxTagCount` is set
  let myValueList = selectorValueList;
  if (maxTagCount >= 0) {
    myValueList = selectorValueList.slice(0, maxTagCount);
  }

  // Basic selectors
  myValueList.forEach(({ label, value }) => {
    const { props: { disabled } = {} } = (valueEntities[value] || {}).node || {};
    nodeKeys.push({
      key: value,
      type: NODE_SELECTOR,
      label,
      value,
      disabled,
    });
  });

  // Rest node count
  if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
    let content = `+ ${selectorValueList.length - maxTagCount} ...`;
    if (typeof maxTagPlaceholder === 'string') {
      content = maxTagPlaceholder;
    } else if (typeof maxTagPlaceholder === 'function') {
      const restValueList = selectorValueList.slice(maxTagCount);
      content = maxTagPlaceholder(
        labelInValue ? restValueList : restValueList.map(({ value }) => value),
      );
    }

    nodeKeys.push({
      key: 'rc-tree-select-internal-max-tag-counter',
      type: NODE_SELECTOR,
      label: content,
      value: null,
      disabled: true,
    });
  }

  // Search node
  if (showSearch !== false) {
    nodeKeys.push({
      key: '__input',
      type: NODE_SEARCH,
    });
  }

  return (
    <CSSMotionList
      keys={nodeKeys}
      className={`${prefixCls}-selection__rendered`}
      component="ul"
      role="menubar"
    >
      {({ type, label, value, disabled, className, style }) => {
        switch (type) {
          case NODE_SELECTOR:
            return (
              <Selection
                {...props}
                key={value || TREE_SELECT_EMPTY_VALUE_KEY}
                label={label}
                value={value}
                onRemove={disabled ? null : onMultipleSelectorRemove}
              />
            );
          case NODE_SEARCH:
            return (
              <li className={`${prefixCls}-search ${prefixCls}-search--inline`}>
                <SearchInput {...props} ref={inputRef} needAlign />
              </li>
            );
        }
        return null;
      }}
    </CSSMotionList>
  );
};

export default SelectorList;
