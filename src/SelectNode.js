import React from 'react';
import PropTypes from 'prop-types';

import { TreeNode } from 'rc-tree';

/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
class SelectNode extends React.Component {
  static propTypes = {
    ...TreeNode.propTypes,
    label: PropTypes.string,
    value: PropTypes.string,
  };

  render() {
    const { label, ...props } = this.props;
    delete props.value;
    return <TreeNode title={label} {...props} />;
  }
}

// Let Tree trade as TreeNode to reuse this for performance saving.
SelectNode.isTreeNode = 1;

export default SelectNode;
