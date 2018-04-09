import React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import classNames from 'classnames';

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
    dropdownPrefixCls: PropTypes.string,
    dropdownPopupAlign: PropTypes.object,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    transitionName: PropTypes.string,
    animation: PropTypes.string,
    getPopupContainer: PropTypes.func,
    children: PropTypes.node,

    // Pass by Select
    isMultiple: PropTypes.bool,
    onDropdownVisibleChange: PropTypes.func,
    popupElement: PropTypes.node,
    visible: PropTypes.bool,
  };

  getDropdownPrefixCls = () => `${this.props.prefixCls}-dropdown`;

  getDropdownTransitionName = () => {
    const { transitionName, animation } = this.props;
    if (!transitionName && animation) {
      return `${this.getDropdownPrefixCls()}-${animation}`;
    }
    return transitionName;
  };

  render() {
    const {
      disabled, isMultiple, showSearch,
      dropdownPopupAlign, dropdownClassName,
      dropdownStyle, onDropdownVisibleChange, getPopupContainer,
      popupElement, visible,
      children,
    } = this.props;
    const dropdownPrefixCls = this.getDropdownPrefixCls();

    let hideAction;
    if (disabled) {
      hideAction = [];
    } else if (isMultiple && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }

    // TODO: saveRef(this, 'trigger')
    // TODO: dropdownWidth

    return (
      <Trigger
        showAction={disabled ? [] : ['click']}
        hideAction={hideAction}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupAlign={dropdownPopupAlign}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={onDropdownVisibleChange}
        popup={popupElement}
        popupVisible={visible}
        getPopupContainer={getPopupContainer}
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
