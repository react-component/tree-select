import * as React from 'react';
import type { DefaultOptionType, InternalFieldName, OnInternalSelect } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  listHeight: number;
  listItemHeight: number;
  treeData: DefaultOptionType[];
  fieldNames: InternalFieldName;
  onSelect: OnInternalSelect;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
