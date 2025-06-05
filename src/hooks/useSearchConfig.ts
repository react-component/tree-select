import type { SearchConfig } from '@/TreeSelect';
import * as React from 'react';
const legacySearchProps = [
  'searchValue',
  'inputValue',
  'onSearch',
  'autoClearSearchValue',
  'filterTreeNode',
  'treeNodeFilterProp',
];
// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch, props) {
  return React.useMemo<[boolean, SearchConfig]>(() => {
    const legacyShowSearch: SearchConfig = {};
    legacySearchProps.forEach(propsName => {
      legacyShowSearch[propsName] = props?.[propsName];
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
    props?.searchValue,
    props?.inputValue,
    props?.onSearch,
    props?.autoClearSearchValue,
    props?.filterTreeNode,
    props?.treeNodeFilterProp,
  ]);
}
