import React from 'react';
import { FlattenDataNode, Key, RawValueType } from '../interface';

export type SkipType = null | 'select' | 'checkbox';

// export function isDisabled(dataNode: FlattenDataNode, skipType: SkipType): boolean {
//   if (!dataNode) {
//     return true;
//   }

//   const { disabled, disableCheckbox } = dataNode.data;

//   switch (skipType) {
//     case 'select':
//       return disabled;
//     case 'checkbox':
//       return disabled || disableCheckbox;
//   }

//   return false;
// }

export default function useKeyValueMapping(
  cacheKeyMap: Map<Key, FlattenDataNode>,
  cacheValueMap: Map<RawValueType, FlattenDataNode>,
): [
  (key: Key, skipType?: SkipType) => FlattenDataNode,
  (value: RawValueType, skipType?: SkipType) => FlattenDataNode,
] {
  const getEntityByKey = React.useCallback((key: Key) => cacheKeyMap.get(key), [cacheKeyMap]);

  const getEntityByValue = React.useCallback((value: RawValueType) => cacheValueMap.get(value), [
    cacheValueMap,
  ]);

  return [getEntityByKey, getEntityByValue];
}
