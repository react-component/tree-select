import React from 'react';

interface ContextProps {
  checkable: boolean;
}

export const SelectContext = React.createContext<ContextProps>(null);
