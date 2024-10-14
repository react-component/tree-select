import * as React from 'react';
import type { DataEntity, IconType } from 'rc-tree/lib/interface';
import type { LegacyDataNode, SafeKey } from './interface';

interface LegacyContextProps {
  checkable: boolean | React.ReactNode;
  checkedKeys: SafeKey[];
  halfCheckedKeys: SafeKey[];
  treeExpandedKeys: SafeKey[];
  treeDefaultExpandedKeys: SafeKey[];
  onTreeExpand: (keys: SafeKey[]) => void;
  treeDefaultExpandAll: boolean;
  treeIcon: IconType;
  showTreeIcon: boolean;
  switcherIcon: IconType;
  treeLine: boolean;
  treeNodeFilterProp: string;
  treeLoadedKeys: SafeKey[];
  treeMotion: any;
  loadData: (treeNode: LegacyDataNode) => Promise<unknown>;
  onTreeLoad: (loadedKeys: SafeKey[]) => void;

  keyEntities: Record<SafeKey, DataEntity<any>>;
}

const LegacySelectContext = React.createContext<LegacyContextProps>(null);

export default LegacySelectContext;
