import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export default function useKeyValueMapping(
  cacheKeyMap: Map<Key, FlattenDataNode>,
  cacheValueMap: Map<RawValueType, FlattenDataNode>,
) {
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

  return [getValueByKey, getKeyByValue];
}
