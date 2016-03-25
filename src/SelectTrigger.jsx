import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import Trigger from 'rc-trigger';
import Tree, { TreeNode } from 'rc-tree';
import { flatToHierarchy, loopAllChildren, getValuePropValue, labelCompatible } from './util';

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

const SelectTrigger = React.createClass({
  propTypes: {
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownPopupAlign: PropTypes.object,
    visible: PropTypes.bool,
    filterTreeNode: PropTypes.any,
    treeNodes: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    children: PropTypes.any,
  },

  componentDidUpdate() {
    if (this.props.dropdownMatchSelectWidth && this.props.visible) {
      const dropdownDOMNode = this.getPopupDOMNode();
      if (dropdownDOMNode) {
        dropdownDOMNode.style.width = ReactDOM.findDOMNode(this).offsetWidth + 'px';
      }
    }
  },

  getPopupEleRefs() {
    return this.popupEle && this.popupEle.refs;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  },

  getDropdownTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  },

  getDropdownPrefixCls() {
    return `${this.props.prefixCls}-dropdown`;
  },

  filterTree(treeNode) {
    const props = this.props;
    return props.inputValue && treeNode.props[labelCompatible(props.treeNodeFilterProp)].indexOf(props.inputValue) > -1;
  },

  filterTreeNode(input, child) {
    if (!input) {
      return true;
    }
    const filterTreeNode = this.props.filterTreeNode;
    if (!filterTreeNode) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, input, child);
  },

  savePopupElement(ele) {
    this.popupEle = ele;
  },

  renderFilterTreeNodes(children) {
    const props = this.props;
    const inputValue = props.inputValue;
    const filterNodesPositions = [];

    loopAllChildren(children, (child, index, pos) => {
      if (this.filterTreeNode(inputValue, child)) {
        filterNodesPositions.push({node: child, pos});
      }
    });

    return flatToHierarchy(filterNodesPositions);
  },

  renderTree(treeNodes, newTreeNodes, multiple) {
    const props = this.props;

    const loop = data => {
      return data.map((item) => {
        const tProps = {key: item.node.key};
        assign(tProps, item.node.props);
        if (tProps.children) {
          delete tProps.children;
        }
        if (item.children) {
          return <TreeNode {...tProps}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode {...tProps} />;
      });
    };

    const trProps = {
      multiple,
      prefixCls: props.prefixCls + '-tree',
      showIcon: props.treeIcon,
      showLine: props.treeLine,
      defaultExpandAll: props.treeDefaultExpandAll,
      checkable: props.treeCheckable,
      filterTreeNode: this.filterTree,
    };
    const vals = props.value || props.defaultValue;
    const keys = [];
    loopAllChildren(treeNodes, (child) => {
      if (vals.indexOf(getValuePropValue(child)) > -1) {
        keys.push(child.key);
      }
    });
    // 为避免混乱，checkable 模式下，select 失效
    if (trProps.checkable) {
      trProps.selectable = false;
      trProps.checkedKeys = keys;
      trProps.onCheck = props.onSelect;
    } else {
      trProps.selectedKeys = keys;
      trProps.onSelect = props.onSelect;
    }

    // expand keys
    trProps.defaultExpandedKeys = keys;

    // async loadData
    if (props.loadData) {
      trProps.loadData = props.loadData;
    }

    return (<Tree ref={this.savePopupElement} {...trProps}>
        {loop(newTreeNodes)}
    </Tree>);
  },
  render() {
    const props = this.props;
    const multiple = props.multiple;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    let visible = props.visible;
    const search = multiple || props.combobox || !props.showSearch ? null : (
      <span className={`${dropdownPrefixCls}-search`}>{props.inputElement}</span>
    );
    const treeNodes = this.renderFilterTreeNodes(props.treeData || props.treeNodes);
    let notFoundContent;
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = <span>{props.notFoundContent}</span>;
      }
      if (!search) {
        visible = false;
      }
    }
    const popupElement = (<div>
      {search}
      {notFoundContent ? notFoundContent : this.renderTree(props.treeData || props.treeNodes, treeNodes, multiple)}
    </div>);

    return (<Trigger action={props.disabled ? [] : ['click']}
                     ref="trigger"
                     popupPlacement="bottomLeft"
                     builtinPlacements={BUILT_IN_PLACEMENTS}
                     popupAlign={this.props.dropdownPopupAlign}
                     prefixCls={dropdownPrefixCls}
                     popupTransitionName={this.getDropdownTransitionName()}
                     onPopupVisibleChange={props.onDropdownVisibleChange}
                     popup={popupElement}
                     popupVisible={visible}
                     popupClassName={classnames(popupClassName)}
                     popupStyle={props.dropdownStyle}
    >{this.props.children}</Trigger>);
  },
});

export default SelectTrigger;
