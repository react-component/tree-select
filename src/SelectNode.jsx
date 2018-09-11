import React from 'react';
import { TreeNode } from 'rc-tree';
import { valueProp } from './propTypes';

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
  value: valueProp,
};

// Let Tree trade as TreeNode to reuse this for performance saving.
SelectNode.isTreeNode = 1;

export default SelectNode;
