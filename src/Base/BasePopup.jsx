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
    children: PropTypes.node,
    prefixCls: PropTypes.string,
    valueList: PropTypes.array,
    valueEntities: PropTypes.object,
    treeIcon: PropTypes.bool,
    treeCheckable: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    multiple: PropTypes.bool,

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
      prefixCls, children,
      treeIcon, treeCheckable, treeCheckStrictly, multiple,
      treeDefaultExpandAll,

      renderSearch,
    } = this.props;
    const { rcTreeSelect: {
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

    // TODO: not found
    // {notFoundContent || this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)}

    const $tree = (
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
        {children}
      </Tree>
    );

    return (
      <div>
        {renderSearch ? renderSearch() : null}
        {$tree}
      </div>
    );
  }
}

polyfill(BasePopup);

export default BasePopup;
