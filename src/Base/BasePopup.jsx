import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Tree from 'rc-tree';

export const popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
  onTreeNodeCheck: PropTypes.func.isRequired,
};

class BasePopup extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    searchValue: PropTypes.string,
    valueList: PropTypes.array,
    valueEntities: PropTypes.object,
    keyEntities: PropTypes.object,
    treeIcon: PropTypes.bool,
    treeLine: PropTypes.bool,
    treeNodeFilterProp: PropTypes.string,
    treeCheckable: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    loadData: PropTypes.func,
    multiple: PropTypes.bool,

    treeNodes: PropTypes.node,
    filteredTreeNodes: PropTypes.node,
    notFoundContent: PropTypes.string,

    ariaId: PropTypes.string,

    // HOC
    renderSearch: PropTypes.func,
  };

  static contextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...popupContextTypes,
    }),
  };

  constructor(props) {
    super();

    const {
      treeDefaultExpandAll, treeDefaultExpandedKeys,
      keyEntities,
    } = props;

    // TODO: make `expandedKeyList` control
    let expandedKeyList = treeDefaultExpandedKeys;
    if (treeDefaultExpandAll) {
      expandedKeyList = Object.keys(keyEntities);
    }

    this.state = {
      keyList: [],
      expandedKeyList,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps = {} } = prevState || {};
    const { valueList, valueEntities, keyEntities, filteredTreeNodes } = nextProps;

    const newState = {
      prevProps: nextProps,
    };

    // Check value update
    if (valueList !== prevProps.valueList) {
      newState.keyList = valueList
        .map(({ value }) => valueEntities[value])
        .filter(entity => entity)
        .map(({ key }) => key);
    }

    // Show all when tree is in filter mode
    if (filteredTreeNodes && filteredTreeNodes.length && filteredTreeNodes !== prevProps.filteredTreeNodes) {
      newState.expandedKeyList = Object.keys(keyEntities);
    }

    return newState;
  }

  onTreeExpand = (expandedKeyList) => {
    this.setState({ expandedKeyList });
  };

  /**
   * This method pass to Tree component which is used for add filtered class
   * in TreeNode > li
   */
  filterTreeNode = (treeNode) => {
    const { searchValue, treeNodeFilterProp } = this.props;

    const filterVal = treeNode.props[treeNodeFilterProp];
    if (typeof filterVal === 'string') {
      return searchValue && filterVal.indexOf(searchValue) !== -1;
    }

    return false;
  };

  renderNotFound = () => {
    const { prefixCls, notFoundContent } = this.props;

    return (
      <span className={`${prefixCls}-not-found`}>
        {notFoundContent}
      </span>
    );
  };

  render() {
    const { keyList, expandedKeyList } = this.state;
    const {
      prefixCls,
      treeNodes, filteredTreeNodes,
      treeIcon, treeLine, treeCheckable, treeCheckStrictly, multiple,
      loadData,
      ariaId,
      renderSearch,
    } = this.props;
    const { rcTreeSelect: {
      onPopupKeyDown,
      onTreeNodeSelect,
      onTreeNodeCheck,
    } } = this.context;

    const treeProps = {};

    if (treeCheckable) {
      treeProps.checkedKeys = keyList;
    } else {
      treeProps.selectedKeys = keyList;
    }

    let $notFound;
    let $treeNodes;
    if (filteredTreeNodes) {
      if (filteredTreeNodes.length) {
        treeProps.checkStrictly = true;
        $treeNodes = filteredTreeNodes;
      } else {
        $notFound = this.renderNotFound();
      }
    } else if (!treeNodes.length) {
      $notFound = this.renderNotFound();
    } else {
      $treeNodes = treeNodes;
    }

    let $tree;
    if ($notFound) {
      $tree = $notFound;
    } else {
      $tree = (
        <Tree
          prefixCls={`${prefixCls}-tree`}
          showIcon={treeIcon}
          showLine={treeLine}
          selectable={!treeCheckable}
          checkable={treeCheckable}
          checkStrictly={treeCheckStrictly}
          multiple={multiple}
          loadData={loadData}
          expandedKeys={expandedKeyList}
          filterTreeNode={this.filterTreeNode}
          onSelect={onTreeNodeSelect}
          onCheck={onTreeNodeCheck}
          onExpand={this.onTreeExpand}
          {...treeProps}
        >
          {$treeNodes}
        </Tree>
      );
    }

    return (
      <div
        role="listbox"
        id={ariaId}
        onKeyDown={onPopupKeyDown}
        tabIndex={-1}
      >
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  }
}

polyfill(BasePopup);

export default BasePopup;
