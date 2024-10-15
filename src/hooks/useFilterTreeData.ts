import * as React from 'react';
import type { DefaultOptionType, InternalFieldName, TreeSelectProps } from '../TreeSelect';
import { fillLegacyProps } from '../utils/legacyUtil';

type GetFuncType<T> = T extends boolean ? never : T;
type FilterFn = GetFuncType<TreeSelectProps['filterTreeNode']>;

export default (
  treeData: DefaultOptionType[],
  searchValue: string,
  {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames,
  }: {
    fieldNames: InternalFieldName;
    treeNodeFilterProp: string;
    filterTreeNode: TreeSelectProps['filterTreeNode'];
  },
) => {
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

    function dig(list: DefaultOptionType[], keepAll: boolean = false) {
      return list.reduce<DefaultOptionType[]>((total, dataNode) => {
        const children = dataNode[fieldChildren];

        const match = keepAll || filterOptionFunc(searchValue, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList.length) {
          total.push({
            ...dataNode,
            isLeaf: undefined,
            [fieldChildren]: childList,
          });
        }
        return total;
      }, []);
    }

    return dig(treeData);
  }, [treeData, searchValue, fieldChildren, treeNodeFilterProp, filterTreeNode]);
};
