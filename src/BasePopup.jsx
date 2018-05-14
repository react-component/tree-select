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
          selectedKeys: valueList.map(({ value }) => value),
        };
      }
      return null;
    }

    state = {};

    render() {
      const { selectedKeys } = this.state;
      const {
        prefixCls, children,
        treeIcon, treeCheckable, multiple,
        treeDefaultExpandAll,
      } = this.props;
      const { rcTreeSelect: {
        onTreeNodeSelect,
      } } = this.context;

      console.log('Keys:', selectedKeys);

      return (
        <div>
          <Tree
            prefixCls={`${prefixCls}-tree`}
            showIcon={treeIcon}
            checkable={treeCheckable}
            multiple={multiple}
            selectedKeys={selectedKeys}

            defaultExpandAll={treeDefaultExpandAll}

            onSelect={onTreeNodeSelect}
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
