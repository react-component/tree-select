import * as React from 'react';
import type { ExpandAction } from '@rc-component/tree/lib/Tree';
import type { DataNode, FieldNames, Key } from './interface';
import type useDataEntities from './hooks/useDataEntities';

export type SemanticName = 'item' | 'itemTitle' | 'input' | 'prefix' | 'suffix';
export interface TreeSelectContextProps {
  virtual?: boolean;
  popupMatchSelectWidth?: boolean | number;
  listHeight: number;
  listItemHeight: number;
  listItemScrollOffset?: number;
  treeData: DataNode[];
  fieldNames: FieldNames;
  onSelect: (value: Key, info: { selected: boolean }) => void;
  treeExpandAction?: ExpandAction;
  treeTitleRender?: (node: any) => React.ReactNode;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;

  // For `maxCount` usage
  leftMaxCount: number | null;
  /** When `true`, only take leaf node as count, or take all as count with `maxCount` limitation */
  leafCountOnly: boolean;
  valueEntities: ReturnType<typeof useDataEntities>['valueEntities'];
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticName, string>>;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
