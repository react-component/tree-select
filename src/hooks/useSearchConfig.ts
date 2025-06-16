import type { SearchConfig } from '@/TreeSelect';
import * as React from 'react';
const legacySearchProps = [
  'searchValue',
  'onSearch',
  'autoClearSearchValue',
  'filterTreeNode',
  'treeNodeFilterProp',
];
// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch: boolean | SearchConfig, props: any) {
  const {
    searchValue,
    inputValue,
    onSearch,
    autoClearSearchValue,
    filterTreeNode,
    treeNodeFilterProp,
  } = props;
  return React.useMemo<[boolean | undefined, SearchConfig]>(() => {
    const legacyShowSearch: SearchConfig = {};
    legacySearchProps.forEach(name => {
      const val = props?.[name];
      if (val !== undefined) {
        legacyShowSearch[name] = val;
      }
      if (name === 'searchValue') {
        legacyShowSearch[name] = val ?? props?.inputValue;
      }
    });
    const searchConfig: SearchConfig =
      typeof showSearch === 'object' ? showSearch : legacyShowSearch;
    if (showSearch === undefined) {
      return [undefined, searchConfig];
    }
    if (!showSearch) {
      return [false, {}];
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
