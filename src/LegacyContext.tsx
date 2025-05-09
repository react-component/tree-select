import * as React from 'react';
import type { DataEntity, IconType } from '@rc-component/tree/lib/interface';
import type { LegacyDataNode, SafeKey, Key } from './interface';

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

  keyEntities: Record<SafeKey, DataEntity<any>>;
}

const LegacySelectContext = React.createContext<LegacyContextProps>(null);

export default LegacySelectContext;
