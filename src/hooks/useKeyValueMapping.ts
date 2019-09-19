import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

function useCacheOptions(flattenOptions: FlattenDataNode[]) {
  return React.useMemo(() => {
    const cacheKeyMap: Map<Key, FlattenDataNode> = new Map();
    const cacheValueMap: Map<RawValueType, FlattenDataNode> = new Map();

    // Cache options by key
    flattenOptions.forEach((dataNode: FlattenDataNode) => {
      cacheKeyMap.set(dataNode.key, dataNode);
      cacheValueMap.set(dataNode.data.value, dataNode);
    });

    return [cacheKeyMap, cacheValueMap];
  }, [flattenOptions]);
}

export default function useKeyValueMapping(flattenOptions: FlattenDataNode[]) {
  const [cacheKeyMap, cacheValueMap] = useCacheOptions(flattenOptions);

  const getValueByKey = React.useCallback(
    (key: Key, allowDisabled: boolean = false) => {
      const dataNode = cacheKeyMap.get(key);

      if (!dataNode || (!allowDisabled && dataNode.data.disabled)) {
        return null;
      }

      return dataNode.data.value;
    },
    [cacheKeyMap],
  );

  const getKeyByValue = React.useCallback(
    (value: RawValueType, allowDisabled: boolean = false) => {
      const dataNode = cacheValueMap.get(value);

      if (!dataNode || (!allowDisabled && dataNode.data.disabled)) {
        return null;
      }

      return dataNode.key;
    },
    [cacheValueMap],
  );

  return { getValueByKey, getKeyByValue };
}
