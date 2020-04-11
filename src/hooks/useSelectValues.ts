import React from 'react';
import { DefaultValueType } from 'rc-select/lib/interface/generator';
import { DataEntity } from 'rc-tree/lib/interface';
import { RawValueType, FlattenDataNode, Key, LabelValueType, DataNode } from '../interface';
import { SkipType } from './useKeyValueMapping';
import { getRawValueLabeled } from '../utils/valueUtil';
import { formatStrategyKeys, CheckedStrategy } from '../utils/strategyUtil';

interface Config {
  treeConduction: boolean;
  /** Current `value` of TreeSelect */
  value: DefaultValueType;
  showCheckedStrategy: CheckedStrategy;
  conductKeyEntities: Record<Key, DataEntity>;
  getEntityByKey: (key: Key, skipType?: SkipType) => FlattenDataNode;
  getEntityByValue: (value: RawValueType, skipType?: SkipType) => FlattenDataNode;
  getLabelProp: (node: DataNode) => React.ReactNode;
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
