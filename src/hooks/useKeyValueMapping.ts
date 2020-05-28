import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export type SkipType = null | 'select' | 'checkbox';

export default function useKeyValueMapping(
  cacheKeyMap: Map<Key, FlattenDataNode>,
  cacheValueMap: Map<RawValueType, FlattenDataNode>,
): [(key: Key) => FlattenDataNode, (value: RawValueType) => FlattenDataNode] {
  const getEntityByKey = React.useCallback((key: Key) => cacheKeyMap.get(key), [cacheKeyMap]);

  const getEntityByValue = React.useCallback((value: RawValueType) => cacheValueMap.get(value), [
    cacheValueMap,
  ]);

  return [getEntityByKey, getEntityByValue];
}
