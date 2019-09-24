import React from 'react';
import { IconType } from 'rc-tree/lib/interface';
import { Key, LegacyDataNode } from './interface';

interface ContextProps {
  checkable: boolean;
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
  treeExpandedKeys: Key[];
  treeDefaultExpandedKeys: Key[];
  onTreeExpand: (keys: Key[]) => void;
  treeDefaultExpandAll: boolean;
  loadData: (treeNode: LegacyDataNode) => Promise<void>;
  treeIcon: IconType;
  switcherIcon: IconType;
  treeLine: boolean;
}

export const SelectContext = React.createContext<ContextProps>(null);