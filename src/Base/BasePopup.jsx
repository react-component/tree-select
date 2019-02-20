import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Tree from 'rc-tree';
import { createRef } from '../util';

export const popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
  onTreeNodeCheck: PropTypes.func.isRequired,
};

class BasePopup extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    upperSearchValue: PropTypes.string,
    valueList: PropTypes.array,
    searchHalfCheckedKeys: PropTypes.array,
    valueEntities: PropTypes.object,
    keyEntities: PropTypes.object,
    treeIcon: PropTypes.bool,
    treeLine: PropTypes.bool,
    treeNodeFilterProp: PropTypes.string,
    treeCheckable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    treeCheckStrictly: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    treeExpandedKeys: PropTypes.array,
    loadData: PropTypes.func,
    multiple: PropTypes.bool,
    onTreeExpand: PropTypes.func,

    treeNodes: PropTypes.node,
    filteredTreeNodes: PropTypes.node,
    notFoundContent: PropTypes.node,

    ariaId: PropTypes.string,
    switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    // HOC
    renderSearch: PropTypes.func,
    onTreeExpanded: PropTypes.func,
  };

  static contextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...popupContextTypes,
    }),
  };

  constructor(props) {
    super();

    const { treeDefaultExpandAll, treeDefaultExpandedKeys, keyEntities } = props;

    // TODO: make `expandedKeyList` control
    let expandedKeyList = treeDefaultExpandedKeys;
    if (treeDefaultExpandAll) {
      expandedKeyList = Object.keys(keyEntities);
    }

    this.state = {
      keyList: [],
      expandedKeyList,
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedStateFromProps`
      cachedExpandedKeyList: [], // eslint-disable-line react/no-unused-state
      loadedKeys: [],
    };

    this.treeRef = createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps = {}, loadedKeys, expandedKeyList, cachedExpandedKeyList } = prevState || {};
    const {
      valueList,
      valueEntities,
      keyEntities,
      treeExpandedKeys,
      filteredTreeNodes,
      upperSearchValue,
    } = nextProps;

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
    if (
      !treeExpandedKeys &&
      filteredTreeNodes &&
      filteredTreeNodes.length &&
      filteredTreeNodes !== prevProps.filteredTreeNodes
    ) {
      newState.expandedKeyList = Object.keys(keyEntities);
    }

    // Cache `expandedKeyList` when filter set
    if (upperSearchValue && !prevProps.upperSearchValue) {
      newState.cachedExpandedKeyList = expandedKeyList;
    } else if (!upperSearchValue && prevProps.upperSearchValue && !treeExpandedKeys) {
      newState.expandedKeyList = cachedExpandedKeyList || [];
      newState.cachedExpandedKeyList = [];
    }

    // Use expandedKeys if provided
    if (prevProps.treeExpandedKeys !== treeExpandedKeys) {
      newState.expandedKeyList = treeExpandedKeys;
    }

    // Clean loadedKeys if key not exist in keyEntities anymore
    if (nextProps.loadData) {
      newState.loadedKeys = loadedKeys.filter(key => key in keyEntities);
    }

    return newState;
  }

  onTreeExpand = expandedKeyList => {
    const { treeExpandedKeys, onTreeExpand, onTreeExpanded } = this.props;

    // Set uncontrolled state
    if (!treeExpandedKeys) {
      this.setState({ expandedKeyList }, onTreeExpanded);
    }

    if (onTreeExpand) {
      onTreeExpand(expandedKeyList);
    }
  };

  onLoad = loadedKeys => {
    this.setState({ loadedKeys });
  };

  getTree = () => {
    return this.treeRef.current;
  };

  /**
   * Not pass `loadData` when searching. To avoid loop ajax call makes browser crash.
   */
  getLoadData = () => {
    const { loadData, upperSearchValue } = this.props;
    if (upperSearchValue) return null;
    return loadData;
  };

  /**
   * This method pass to Tree component which is used for add filtered class
   * in TreeNode > li
   */
  filterTreeNode = treeNode => {
    const { upperSearchValue, treeNodeFilterProp } = this.props;

    const filterVal = treeNode.props[treeNodeFilterProp];
    if (typeof filterVal === 'string') {
      return upperSearchValue && filterVal.toUpperCase().indexOf(upperSearchValue) !== -1;
    }

    return false;
  };

  renderNotFound = () => {
    const { prefixCls, notFoundContent } = this.props;

    return <span className={`${prefixCls}-not-found`}>{notFoundContent}</span>;
  };

  render() {
    const { keyList, expandedKeyList, loadedKeys } = this.state;
    const {
      prefixCls,
      treeNodes,
      filteredTreeNodes,
      treeIcon,
      treeLine,
      treeCheckable,
      treeCheckStrictly,
      multiple,
      ariaId,
      renderSearch,
      switcherIcon,
      searchHalfCheckedKeys,
    } = this.props;
    const {
      rcTreeSelect: { onPopupKeyDown, onTreeNodeSelect, onTreeNodeCheck },
    } = this.context;

    const loadData = this.getLoadData();

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

        // Fill halfCheckedKeys
        if (treeCheckable && !treeCheckStrictly) {
          treeProps.checkedKeys = {
            checked: keyList,
            halfChecked: searchHalfCheckedKeys,
          };
        }
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
          ref={this.treeRef}
          prefixCls={`${prefixCls}-tree`}
          showIcon={treeIcon}
          showLine={treeLine}
          selectable={!treeCheckable}
          checkable={treeCheckable}
          checkStrictly={treeCheckStrictly}
          multiple={multiple}
          loadData={loadData}
          loadedKeys={loadedKeys}
          expandedKeys={expandedKeyList}
          filterTreeNode={this.filterTreeNode}
          onSelect={onTreeNodeSelect}
          onCheck={onTreeNodeCheck}
          onExpand={this.onTreeExpand}
          onLoad={this.onLoad}
          switcherIcon={switcherIcon}
          {...treeProps}
        >
          {$treeNodes}
        </Tree>
      );
    }

    return (
      <div role="listbox" id={ariaId} onKeyDown={onPopupKeyDown} tabIndex={-1}>
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  }
}

polyfill(BasePopup);

export default BasePopup;
