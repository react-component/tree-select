import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export type SkipType = null | 'select' | 'checkbox';

export function isDisabled(
  dataNode: FlattenDataNode,
  skipType: SkipType,
): boolean {
  if (!dataNode) {
    return true;
  }

  const { disabled, disableCheckbox } = dataNode.data;

  switch (skipType) {
    case 'select':
      return disabled;
    case 'checkbox':
      return disabled || disableCheckbox;
  }

  return false;
}

export default function useKeyValueMapping(
  cacheKeyMap: Map<Key, FlattenDataNode>,
  cacheValueMap: Map<RawValueType, FlattenDataNode>,
): [
  (key: Key, skipType?: SkipType) => FlattenDataNode,
  (value: RawValueType, skipType?: SkipType) => FlattenDataNode,
] {
  const getEntityByKey = React.useCallback(
    (key: Key, skipType: SkipType = 'select') => {
      const dataNode = cacheKeyMap.get(key);

      if (isDisabled(dataNode, skipType)) {
        return null;
      }

      return dataNode;
    },
    [cacheKeyMap],
  );

  const getEntityByValue = React.useCallback(
    (value: RawValueType, skipType: SkipType = 'select') => {
      const dataNode = cacheValueMap.get(value);

      if (isDisabled(dataNode, skipType)) {
        return null;
      }

      return dataNode;
    },
    [cacheValueMap],
  );

  return [getEntityByKey, getEntityByValue];
}
