import * as React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export type SkipType = null | 'select' | 'checkbox';

export function isDisabled(dataNode: FlattenDataNode, skipType: SkipType): boolean {
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
  (key: Key, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode,
  (value: RawValueType, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode,
] {
  const getEntityByKey = React.useCallback(
    (key: Key, skipType: SkipType = 'select', ignoreDisabledCheck?: boolean) => {
      const dataNode = cacheKeyMap.get(key);

      if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
        return null;
      }

      return dataNode;
    },
    [cacheKeyMap],
  );

  const getEntityByValue = React.useCallback(
    (value: RawValueType, skipType: SkipType = 'select', ignoreDisabledCheck?: boolean) => {
      const dataNode = cacheValueMap.get(value);

      if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
        return null;
      }

      return dataNode;
    },
    [cacheValueMap],
  );

  return [getEntityByKey, getEntityByValue];
}
