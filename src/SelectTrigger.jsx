import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Trigger from 'rc-trigger';
import Tree, { TreeNode } from 'rc-tree';
import { loopAllChildren, flatToHierarchy, getValuePropValue, labelCompatible } from './util';
import rcUtil from 'rc-util';

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
    inputValue: PropTypes.string,
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

  highlightTreeNode(treeNode) {
    const props = this.props;
    const filterVal = treeNode.props[labelCompatible(props.treeNodeFilterProp)];
    if (typeof filterVal === 'string') {
      return props.inputValue && filterVal.indexOf(props.inputValue) > -1;
    }
    return false;
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

  processTreeNode(treeNodes) {
    const filterPoss = [];
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (this.filterTreeNode(this.props.inputValue, child)) {
        filterPoss.push(pos);
      }
    });
    // 把筛选节点的父节点（如果未筛选到）包含进来
    const processedPoss = [];
    filterPoss.forEach(pos => {
      const arr = pos.split('-');
      arr.reduce((pre, cur) => {
        const res = `${pre}-${cur}`;
        if (processedPoss.indexOf(res) < 0) {
          processedPoss.push(res);
        }
        return res;
      });
    });
    const filterNodesPositions = [];
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (processedPoss.indexOf(pos) > -1) {
        filterNodesPositions.push({node: child, pos});
      }
    });

    const hierarchyNodes = flatToHierarchy(filterNodesPositions);

    const recursive = children => {
      return children.map(child => {
        if (child.children) {
          return React.cloneElement(child.node, {}, recursive(child.children));
        }
        return child.node;
      });
    };
    return recursive(hierarchyNodes);
  },

  renderTree(keys, halfCheckedKeys, newTreeNodes, multiple) {
    const props = this.props;

    const trProps = {
      multiple,
      prefixCls: props.prefixCls + '-tree',
      showIcon: props.treeIcon,
      showLine: props.treeLine,
      defaultExpandAll: props.treeDefaultExpandAll,
      filterTreeNode: this.highlightTreeNode,
      _treeNodesStates: props._treeNodesStates,
    };

    if (props.treeCheckable) {
      trProps.selectable = false;
      trProps.checkable = props.treeCheckable;
      trProps.checkStrictly = props.treeCheckStrictly;
      trProps.onCheck = props.onSelect;
      if (props.treeCheckStrictly && halfCheckedKeys.length) {
        trProps.checkedKeys = { checked: keys, halfChecked: halfCheckedKeys };
      } else {
        trProps.checkedKeys = keys;
      }
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
        {newTreeNodes}
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

    const recursive = children => {
      // 注意: 如果用 React.Children.map 遍历，key 会被修改掉。
      return rcUtil.Children.toArray(children).map(child => {
        if (child && child.props.children) {
          // null or String has no Prop
          return <TreeNode {...child.props} key={child.key}>{recursive(child.props.children)}</TreeNode>;
        }
        return <TreeNode {...child.props} key={child.key} />;
      });
    };
    // const s = Date.now();
    let treeNodes;
    if (props._cachetreeData && this.treeNodes) {
      treeNodes = this.treeNodes;
    } else {
      treeNodes = recursive(props.treeData || props.treeNodes);
      this.treeNodes = treeNodes;
    }
    // console.log(Date.now()-s);

    if (props.inputValue) {
      treeNodes = this.processTreeNode(treeNodes);
    }

    const keys = [];
    const halfCheckedKeys = [];
    loopAllChildren(treeNodes, (child) => {
      if (props.value.some(item => item.value === getValuePropValue(child))) {
        keys.push(child.key);
      }
      if (props.halfCheckedValues &&
        props.halfCheckedValues.some(item => item.value === getValuePropValue(child))) {
        halfCheckedKeys.push(child.key);
      }
    });

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
      {notFoundContent ? notFoundContent : this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)}
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
