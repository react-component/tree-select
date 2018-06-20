import React from 'react';
import PropTypes from 'prop-types';
import { TreeNode } from 'rc-tree';

/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
const SelectNode = (props) => (
  <TreeNode {...props} />
);

SelectNode.propTypes = {
  ...TreeNode.propTypes,
  value: PropTypes.string,
};

// Let Tree trade as TreeNode to reuse this for performance saving.
SelectNode.isTreeNode = 1;

export default SelectNode;
