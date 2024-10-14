import * as React from 'react';
import type { ExpandAction } from 'rc-tree/lib/Tree';
import type { DefaultOptionType, InternalFieldName, OnInternalSelect } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean | number;
  listHeight: number;
  listItemHeight: number;
  listItemScrollOffset?: number;
  treeData: DefaultOptionType[];
  fieldNames: InternalFieldName;
  onSelect: OnInternalSelect;
  treeExpandAction?: ExpandAction;
  treeTitleRender?: (node: any) => React.ReactNode;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
