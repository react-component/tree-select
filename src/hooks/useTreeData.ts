import React from 'react';
import { DataNode, InnerDataNode } from '../interface';
import { convertChildrenToData } from '../utils/legacyUtil';
import { formatTreeData } from '../utils/valueUtil';

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(treeData: DataNode[], children: React.ReactNode) {
  const cacheRef = React.useRef<{
    treeData?: DataNode[];
    children?: React.ReactNode;
    formatTreeData?: InnerDataNode[];
  }>({});

  if (treeData) {
    cacheRef.current.formatTreeData =
      cacheRef.current.treeData === treeData
        ? cacheRef.current.formatTreeData
        : formatTreeData(treeData);
  } else {
    cacheRef.current.formatTreeData =
      cacheRef.current.children === children
        ? cacheRef.current.formatTreeData
        : formatTreeData(convertChildrenToData(children));
  }

  return cacheRef.current.formatTreeData;
}
