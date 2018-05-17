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

export default function () {
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

      return (
        <div>
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
        </div>
      );
    }
  }

  polyfill(BasePopup);

  return BasePopup;
}
