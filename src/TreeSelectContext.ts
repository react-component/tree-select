import * as React from 'react';
import type { ExpandAction } from 'rc-tree/lib/Tree';
import type { DataNode, FieldNames, Key, LabeledValueType } from './interface';
import { CheckedStrategy } from './utils/strategyUtil';

export interface TreeSelectContextProps {
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean | number;
  listHeight: number;
  listItemHeight: number;
  listItemScrollOffset?: number;
  treeData: DataNode[];
  fieldNames: FieldNames;
  onSelect: (value: Key, info: { selected: boolean }) => void;
  treeExpandAction?: ExpandAction;
  treeTitleRender?: (node: any) => React.ReactNode;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  isOverMaxCount?: boolean;
  maxCount?: number;
  showCheckedStrategy?: CheckedStrategy;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
