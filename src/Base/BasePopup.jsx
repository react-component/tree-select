import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Tree from 'rc-tree';


export const popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
  onTreeNodeCheck: PropTypes.func.isRequired,
  onTreeStateUpdate: PropTypes.func,
};

class BasePopup extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    valueList: PropTypes.array,
    valueEntities: PropTypes.object,
    treeIcon: PropTypes.bool,
    treeCheckable: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    multiple: PropTypes.bool,

    treeNodes: PropTypes.node,
    filteredTreeNodes: PropTypes.node,
    notFoundContent: PropTypes.string,

    // HOC
    renderSearch: PropTypes.func,
  };

  static contextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...popupContextTypes,
    }),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { valueList, valueEntities } = nextProps;
    if (valueList !== prevState.valueList) {
      return {
        valueList,
        keyList: valueList.map(({ value }) => valueEntities[value].key),
      };
    }
    return null;
  }

  state = {};

  render() {
    const { keyList } = this.state;
    const {
      prefixCls,
      treeNodes, filteredTreeNodes,
      treeIcon, treeCheckable, treeCheckStrictly, multiple,
      treeDefaultExpandAll,
      notFoundContent,

      renderSearch,
    } = this.props;
    const { rcTreeSelect: {
      onPopupKeyDown,
      onTreeNodeSelect,
      onTreeNodeCheck,
      onTreeStateUpdate,
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
        $notFound = (
          <span className={`${prefixCls}-not-found`}>
            {notFoundContent}
          </span>
        );
      }
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
          selectable={!treeCheckable}
          checkable={treeCheckable}
          checkStrictly={treeCheckStrictly}
          multiple={multiple}

          defaultExpandAll={treeDefaultExpandAll}

          onSelect={onTreeNodeSelect}
          onCheck={onTreeNodeCheck}
          internalOnStateUpdate={onTreeStateUpdate}

          {...treeProps}
        >
          {$treeNodes}
        </Tree>
      );
    }

    return (
      <div
        onKeyDown={onPopupKeyDown}
      >
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  }
}

polyfill(BasePopup);

export default BasePopup;
