/* istanbul ignore file */
import type * as React from 'react';
import type { DataNode, SafeKey } from './interface';

export interface TreeNodeProps extends Omit<DataNode, 'children'> {
  value: SafeKey;
  children?: React.ReactNode;
}

/** This is a placeholder, not real render in dom */
const TreeNode: React.FC<TreeNodeProps> = () => null;

export default TreeNode;
