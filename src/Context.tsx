import * as React from 'react';
import type { IconType } from 'rc-tree/lib/interface';
import type { FlattenDataNode, Key, LegacyDataNode, RawValueType } from './interface';
import type { SkipType } from './hooks/useKeyValueMapping';

interface ContextProps {
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

  // Cache help content. These can be generated by parent component.
  // Let's reuse this.
  getEntityByKey: (key: Key, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode;
  getEntityByValue: (
    value: RawValueType,
    skipType?: SkipType,
    ignoreDisabledCheck?: boolean,
  ) => FlattenDataNode;
}

export const SelectContext = React.createContext<ContextProps>(null);
