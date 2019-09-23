import React from 'react';
import { Key } from './interface';

interface ContextProps {
  checkable: boolean;
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
}

export const SelectContext = React.createContext<ContextProps>(null);
