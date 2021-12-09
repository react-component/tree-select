import * as React from 'react';
import type { DefaultOptionType, FieldNames } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  listHeight: number;
  listItemHeight: number;
  treeData: DefaultOptionType[];
  fieldNames: FieldNames;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
