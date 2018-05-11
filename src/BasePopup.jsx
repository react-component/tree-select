import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Tree from 'rc-tree';

export default function () {
  class BasePopup extends React.Component {
    static propTypes = {
      children: PropTypes.node,
      prefixCls: PropTypes.string,
      treeIcon: PropTypes.bool,
    };

    placeholder = null; // TODO: Remove this

    render() {
      const { prefixCls, treeIcon, children } = this.props;

      return (
        <div>
          <Tree
            prefixCls={`${prefixCls}-tree`}
            showIcon={treeIcon}
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
