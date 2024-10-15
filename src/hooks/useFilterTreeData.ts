import * as React from 'react';
import type { DefaultOptionType, InternalFieldName, TreeSelectProps } from '../TreeSelect';
import { fillLegacyProps } from '../utils/legacyUtil';

type FilterFn = NonNullable<TreeSelectProps['filterTreeNode']>;

const useFilterTreeData = (
  treeData: DefaultOptionType[],
  searchValue: string,
  options: {
    fieldNames: InternalFieldName;
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

    const filterTreeNodes = (nodes: DefaultOptionType[], keepAll = false): DefaultOptionType[] =>
      nodes.reduce<DefaultOptionType[]>((filtered, node) => {
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
