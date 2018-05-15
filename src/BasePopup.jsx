import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Tree from 'rc-tree';


export const popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
};

export default function () {
  class BasePopup extends React.Component {
    static propTypes = {
      children: PropTypes.node,
      prefixCls: PropTypes.string,
      valueList: PropTypes.array,
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
      const { valueList } = nextProps;
      if (valueList !== prevState.valueList) {
        return {
          valueList,
          keyList: valueList.map(({ key }) => key),
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
      } } = this.context;

      const treeProps = {};

      if (treeCheckable) {
        treeProps.checkedKeys = keyList;
        treeProps.onCheck = onTreeNodeSelect;
      } else if (multiple) {
        treeProps.selectedKeys = keyList;
        treeProps.onSelect = onTreeNodeSelect;
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
