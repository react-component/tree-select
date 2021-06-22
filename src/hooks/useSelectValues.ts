import * as React from 'react';
import type { DefaultValueType } from 'rc-select/lib/interface/generator';
import type { DataEntity } from 'rc-tree/lib/interface';
import type { RawValueType, FlattenDataNode, Key, LabelValueType } from '../interface';
import type { SkipType } from './useKeyValueMapping';
import { getRawValueLabeled } from '../utils/valueUtil';
import type { CheckedStrategy } from '../utils/strategyUtil';
import { formatStrategyKeys } from '../utils/strategyUtil';

interface Config {
  treeConduction: boolean;
  /** Current `value` of TreeSelect */
  value: DefaultValueType;
  showCheckedStrategy: CheckedStrategy;
  conductKeyEntities: Record<Key, DataEntity>;
  getEntityByKey: (key: Key, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode;
  getEntityByValue: (
    value: RawValueType,
    skipType?: SkipType,
    ignoreDisabledCheck?: boolean,
  ) => FlattenDataNode;
  getLabelProp: (entity: FlattenDataNode) => React.ReactNode;
}

/** Return  */
export default function useSelectValues(
  rawValues: RawValueType[],
  {
    value,
    getEntityByValue,
    getEntityByKey,
    treeConduction,
    showCheckedStrategy,
    conductKeyEntities,
    getLabelProp,
  }: Config,
): LabelValueType[] {
  return React.useMemo(() => {
    let mergedRawValues = rawValues;

    if (treeConduction) {
      const rawKeys = formatStrategyKeys(
        rawValues.map(val => {
          const entity = getEntityByValue(val);
          return entity ? entity.key : val;
        }),
        showCheckedStrategy,
        conductKeyEntities,
      );

      mergedRawValues = rawKeys.map(key => {
        const entity = getEntityByKey(key);
        return entity ? entity.data.value : key;
      });
    }

    return getRawValueLabeled(mergedRawValues, value, getEntityByValue, getLabelProp);
  }, [rawValues, value, treeConduction, showCheckedStrategy, getEntityByValue]);
}
