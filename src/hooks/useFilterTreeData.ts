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

    let filterOptionFunc: FilterFn;
    if (typeof filterTreeNode === 'function') {
      filterOptionFunc = filterTreeNode;
    } else {
      const upperStr = searchValue.toUpperCase();
      filterOptionFunc = (_, dataNode) => {
        const value = dataNode[treeNodeFilterProp];

        return String(value).toUpperCase().includes(upperStr);
      };
    }

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
