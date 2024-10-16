import * as React from 'react';
import type { TreeSelectProps } from '../TreeSelect';
import type { DataNode, FieldNames } from '../interface';
import { fillLegacyProps } from '../utils/legacyUtil';

type FilterFn = NonNullable<TreeSelectProps['filterTreeNode']>;

const useFilterTreeData = (
  treeData: DataNode[],
  searchValue: string,
  options: {
    fieldNames: FieldNames;
    treeNodeFilterProp: string;
    filterTreeNode: TreeSelectProps['filterTreeNode'];
  },
) => {
  const { fieldNames, treeNodeFilterProp, filterTreeNode } = options;
  const { children: fieldChildren } = fieldNames;

  return React.useMemo(() => {
    if (!searchValue || filterTreeNode === false) {
      return treeData;
    }

    const filterOptionFunc: FilterFn =
      typeof filterTreeNode === 'function'
        ? filterTreeNode
        : (_, dataNode) =>
            String(dataNode[treeNodeFilterProp]).toUpperCase().includes(searchValue.toUpperCase());

    const filterTreeNodes = (nodes: DataNode[], keepAll = false): DataNode[] =>
      nodes.reduce<DataNode[]>((filtered, node) => {
        const children = node[fieldChildren];
        const isMatch = keepAll || filterOptionFunc(searchValue, fillLegacyProps(node));
        const filteredChildren = filterTreeNodes(children || [], isMatch);

        if (isMatch || filteredChildren.length) {
          filtered.push({
            ...node,
            isLeaf: undefined,
            [fieldChildren]: filteredChildren,
          });
        }
        return filtered;
      }, []);

    return filterTreeNodes(treeData);
  }, [treeData, searchValue, fieldChildren, treeNodeFilterProp, filterTreeNode]);
};

export default useFilterTreeData;
