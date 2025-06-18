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
    const searchConfig: SearchConfig = {
      searchValue: searchValue ?? inputValue,
      onSearch,
      autoClearSearchValue,
      filterTreeNode,
      treeNodeFilterProp,
      ...(typeof showSearch === 'object' ? showSearch : {}),
    };
    if (showSearch === false) {
      return [false, {}];
    }

    if (showSearch === undefined) {
      return [undefined, searchConfig];
    }

    return [true, searchConfig];
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
