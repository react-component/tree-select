import * as React from 'react';
import type { DefaultOptionType, InternalFieldName } from './TreeSelect';

export interface TreeSelectContextProps {
  virtual?: boolean;
  listHeight: number;
  listItemHeight: number;
  treeData: DefaultOptionType[];
  fieldNames: InternalFieldName;
}

const TreeSelectContext = React.createContext<TreeSelectContextProps>(null as any);

export default TreeSelectContext;
