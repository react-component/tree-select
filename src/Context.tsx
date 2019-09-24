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
  treeIcon: IconType;
  switcherIcon: IconType;
  treeLine: boolean;
  treeNodeFilterProp: string;
  treeLoadedKeys: Key[];
  loadData: (treeNode: LegacyDataNode) => Promise<unknown>;
  onTreeLoad: (loadedKeys: Key[]) => void;
}

export const SelectContext = React.createContext<ContextProps>(null);
