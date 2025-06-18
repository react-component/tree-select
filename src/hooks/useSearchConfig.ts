import type { SearchConfig, TreeSelectProps } from '@/TreeSelect';
import * as React from 'react';

// Convert `showSearch` to unique config
export default function useSearchConfig(
  showSearch: boolean | SearchConfig,
  props: TreeSelectProps,
) {
  const {
    searchValue,
    inputValue,
    onSearch,
    autoClearSearchValue,
    filterTreeNode,
    treeNodeFilterProp,
  } = props;
  return React.useMemo<[boolean | undefined, SearchConfig]>(() => {
    const isObject = typeof showSearch === 'object';

    const searchConfig: SearchConfig = {
      searchValue: searchValue ?? inputValue,
      onSearch,
      autoClearSearchValue,
      filterTreeNode,
      treeNodeFilterProp,
      ...(isObject ? showSearch : {}),
    };

    return [isObject ? true : showSearch, searchConfig];
  }, [
    showSearch,
    searchValue,
    inputValue,
    onSearch,
    autoClearSearchValue,
    filterTreeNode,
    treeNodeFilterProp,
  ]);
}
