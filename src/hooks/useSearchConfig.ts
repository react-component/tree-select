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
    const legacysearchConfig: SearchConfig = {
      searchValue: searchValue ?? inputValue,
      onSearch,
      autoClearSearchValue,
      filterTreeNode,
      treeNodeFilterProp,
    };

    if (showSearch === undefined || showSearch === true) {
      return [showSearch as boolean, legacysearchConfig];
    }

    if (!showSearch) {
      return [false, {}];
    }

    const searchConfig = {
      ...legacysearchConfig,
      ...showSearch,
    };

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
