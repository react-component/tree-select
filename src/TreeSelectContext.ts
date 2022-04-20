import * as React from 'react';
import type { DefaultOptionType, InternalFieldName, OnInternalSelect, ExpandAction } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean | number;
  listHeight: number;
  listItemHeight: number;
  treeData: DefaultOptionType[];
  fieldNames: InternalFieldName;
  onSelect: OnInternalSelect;
  expandAction: ExpandAction;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
