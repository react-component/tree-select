import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export default function useKeyValueMapping(
  cacheKeyMap: Map<Key, FlattenDataNode>,
  cacheValueMap: Map<RawValueType, FlattenDataNode>,
): [
  (key: Key, allowDisabled?: boolean) => FlattenDataNode,
  (value: RawValueType, allowDisabled?: boolean) => FlattenDataNode,
] {
  const getEntityByKey = React.useCallback(
    (key: Key, allowDisabled: boolean = false) => {
      const dataNode = cacheKeyMap.get(key);

      if (!dataNode || (!allowDisabled && dataNode.data.disabled)) {
        return null;
      }

      return dataNode;
    },
    [cacheKeyMap],
  );

  const getEntityByValue = React.useCallback(
    (value: RawValueType, allowDisabled: boolean = false) => {
      const dataNode = cacheValueMap.get(value);

      if (!dataNode || (!allowDisabled && dataNode.data.disabled)) {
        return null;
      }

      return dataNode;
    },
    [cacheValueMap],
  );

  return [getEntityByKey, getEntityByValue];
}
