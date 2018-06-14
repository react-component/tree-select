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

  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const { valueList, valueEntities } = nextProps;
    if (valueList !== prevState.valueList) {
      return {
        valueList,
        keyList: valueList
          .map(({ value }) => valueEntities[value])
          .filter(entity => entity)
          .map(({ key }) => key),
      };
    }
    return null;
  }

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
    const { keyList } = this.state;
    const {
      prefixCls,
      treeNodes, filteredTreeNodes,
      treeIcon, treeLine, treeCheckable, treeCheckStrictly, multiple,
      treeDefaultExpandAll, treeDefaultExpandedKeys,
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
    } else if (multiple) {
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

          defaultExpandAll={treeDefaultExpandAll}
          defaultExpandedKeys={treeDefaultExpandedKeys}

          filterTreeNode={this.filterTreeNode}

          onSelect={onTreeNodeSelect}
          onCheck={onTreeNodeCheck}

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
