import * as React from 'react';
import type { LegacyDataNode, SafeKey, Key, IconType } from './interface';
import type { DataEntity } from './hooks/useDataEntities';

interface LegacyContextProps {
  checkable: boolean | React.ReactNode;
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
  treeExpandedKeys: Key[];
  treeDefaultExpandedKeys: Key[];
  onTreeExpand: (keys: Key[]) => void;
  treeDefaultExpandAll: boolean;
  treeIcon: IconType;
  showTreeIcon: boolean;
  switcherIcon: IconType;
  treeLine: boolean;
  treeNodeFilterProp: string;
  treeLoadedKeys: Key[];
  treeMotion: any;
  loadData: (treeNode: LegacyDataNode) => Promise<unknown>;
  onTreeLoad: (loadedKeys: Key[]) => void;

  keyEntities: Record<SafeKey, DataEntity>;
}

const LegacySelectContext = React.createContext<LegacyContextProps>(null);

export default LegacySelectContext;
