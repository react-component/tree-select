import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Trigger from 'rc-trigger';
import classNames from 'classnames';

import { createRef } from './util';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

class SelectTrigger extends React.Component {
  static propTypes = {
    // Pass by outside user props
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    prefixCls: PropTypes.string,
    dropdownPopupAlign: PropTypes.object,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    transitionName: PropTypes.string,
    animation: PropTypes.string,
    getPopupContainer: PropTypes.func,
    children: PropTypes.node,

    dropdownMatchSelectWidth: PropTypes.bool,

    // Pass by Select
    isMultiple: PropTypes.bool,
    dropdownPrefixCls: PropTypes.string,
    onDropdownVisibleChange: PropTypes.func,
    popupElement: PropTypes.node,
    open: PropTypes.bool,
  };

  constructor() {
    super();

    this.triggerRef = createRef();
  }

  getDropdownTransitionName = () => {
    const { transitionName, animation, dropdownPrefixCls } = this.props;
    if (!transitionName && animation) {
      return `${dropdownPrefixCls}-${animation}`;
    }
    return transitionName;
  };

  forcePopupAlign = () => {
    const $trigger = this.triggerRef.current;

    if ($trigger) {
      $trigger.forcePopupAlign();
    }
  };

  render() {
    const {
      disabled, isMultiple,
      dropdownPopupAlign, dropdownMatchSelectWidth, dropdownClassName,
      dropdownStyle, onDropdownVisibleChange, getPopupContainer,
      dropdownPrefixCls, popupElement, open,
      children,
    } = this.props;

    // TODO: [Legacy] Use new action when trigger fixed: https://github.com/react-component/trigger/pull/86

    // When false do nothing with the width
    // ref: https://github.com/ant-design/ant-design/issues/10927
    let stretch;
    if (dropdownMatchSelectWidth !== false) {
      stretch = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    }

    return (
      <Trigger
        ref={this.triggerRef}
        action={disabled ? [] : ['click']}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupAlign={dropdownPopupAlign}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={onDropdownVisibleChange}
        popup={popupElement}
        popupVisible={open}
        getPopupContainer={getPopupContainer}
        stretch={stretch}
        popupClassName={classNames(
          dropdownClassName,
          {
            [`${dropdownPrefixCls}--multiple`]: isMultiple,
            [`${dropdownPrefixCls}--single`]: !isMultiple,
          },
        )}
        popupStyle={dropdownStyle}
      >
        {children}
      </Trigger>
    );
  }
}

polyfill(SelectTrigger);

export default SelectTrigger;
