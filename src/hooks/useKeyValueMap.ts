import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

/**
 * Return cached Key Value map with DataNode.
 * Only re-calculate when `flattenOptions` changed.
 */
export default function useKeyValueMap(flattenOptions: FlattenDataNode[]) {
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
