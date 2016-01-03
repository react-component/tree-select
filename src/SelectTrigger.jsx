import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import Trigger from 'rc-trigger';
import Tree, { TreeNode } from 'rc-tree';
import { filterMinPos, loopAllChildren } from './util';

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

  getInnerMenu() {
    return this.popupMenu && this.popupMenu.refs.menu;
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
    return this.props.inputValue && treeNode.props[this.props.treeNodeFilterProp].indexOf(this.props.inputValue) > -1;
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

  savePopupElement(menu) {
    this.popupMenu = menu;
  },

  renderFilterOptionsFromChildren(children) {
    let posArr = [];
    const filterPos = [];
    const props = this.props;
    const inputValue = props.inputValue;

    loopAllChildren(children, (child, index, pos) => {
      if (this.filterTreeNode(inputValue, child)) {
        posArr.push(pos);
      }
    });
    posArr = filterMinPos(posArr);

    const filterChildren = {};
    loopAllChildren(children, (child, index, pos) => {
      posArr.forEach(item => {
        if (item.indexOf(pos) === 0 && filterPos.indexOf(pos) === -1) {
          filterPos.push(pos);
          filterChildren[pos] = child;
        }
      });
    });

    const level = {};
    filterPos.forEach(pos => {
      const arr = pos.split('-');
      const key = String(arr.length - 1);
      level[key] = level[key] || [];
      level[key].push(pos);
    });

    const childrenArr = [];

    function loop(arr, cur, callback) {
      arr.forEach((c, index) => {
        if (cur.indexOf(c.pos) === 0) {
          if (c.children) {
            if (cur.split('-').length === c.pos.split('-').length + 1) {
              callback(arr, index);
            } else {
              loop(c.children, cur, callback);
            }
          } else {
            callback(arr, index);
          }
        }
      });
    }
    const levelArr = Object.keys(level).sort((a, b) => a - b);
    if (levelArr.length > 0) {
      level[levelArr[0]].forEach((pos, index) => {
        childrenArr[index] = {
          pos: pos,
          node: filterChildren[pos],
        };
      });
      for (let i = 1; i < levelArr.length; i++) {
        level[levelArr[i]].forEach(cur => {
          loop(childrenArr, cur, (arr, index) => {
            arr[index].children = arr[index].children || [];
            arr[index].children.push({
              pos: cur,
              node: filterChildren[cur],
            });
          });
        });
      }
    }
    // console.log(childrenArr);
    return childrenArr;
  },

  renderTree(treeProps) {
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
      multiple: treeProps.multiple,
      prefixCls: props.prefixCls + '-tree',
      showIcon: props.treeIcon,
      showLine: props.treeLine,
      defaultExpandAll: props.treeDefaultExpandAll,
      checkable: props.treeCheckable,
      filterTreeNode: this.filterTree,
    };
    const vals = props.value || props.defaultValue;
    const keys = [];
    loopAllChildren(props.treeNodes, (child, index, pos) => {
      if (vals.indexOf(child.props.value) > -1) {
        keys.push(child.key);
      }
    });
    // 为避免混乱，checkable 模式下，select 失效
    if (trProps.checkable) {
      trProps.checkedKeys = keys;
      trProps.onCheck = props.onSelect;
    } else {
      trProps.selectedKeys = keys;
      trProps.onSelect = props.onSelect;
    }

    // async loadData
    if (props.loadData) {
      trProps.loadData = props.loadData;
    }

    return (<Tree ref={this.savePopupElement} {...trProps}>
        {loop(treeProps.treeNodes)}
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
    const treeNodes = this.renderFilterOptionsFromChildren(props.treeNodes);
    let notFoundContent;
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = <span>{props.notFoundContent}</span>;
      }
      if (!search) {
        visible = false;
      }
    }
    let popupElement = (<div>
      {search}
      {notFoundContent ? notFoundContent : this.renderTree({treeNodes, multiple,})}
    </div>);

    return (<Trigger action={props.disabled ? [] : ['click']}
                     ref="trigger"
                     popupPlacement="bottomLeft"
                     builtinPlacements={BUILT_IN_PLACEMENTS}
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
