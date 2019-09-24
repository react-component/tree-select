import React from 'react';
import { DefaultValueType } from 'rc-select/lib/interface/generator';
import { DataEntity } from 'rc-tree/lib/interface';
import { RawValueType, FlattenDataNode, Key, LabelValueType } from '../interface';
import { SkipType } from './useKeyValueMapping';
import { toArray, getRawValueLabeled } from '../utils/valueUtil';
import { formatStrategyValues, CheckedStrategy } from '../utils/strategyUtil';

interface Config {
  treeConduction: boolean;
  /** Current `value` of TreeSelect */
  value: DefaultValueType;
  showCheckedStrategy: CheckedStrategy;
  conductKeyEntities: Record<Key, DataEntity>;
  getEntityByValue: (value: RawValueType, skipType?: SkipType) => FlattenDataNode;
  treeNodeLabelProp: string;
}

/** Return  */
export default function useSelectValues(
  rawValues: RawValueType[],
  {
    value,
    getEntityByValue,
    treeConduction,
    showCheckedStrategy,
    conductKeyEntities,
    treeNodeLabelProp,
  }: Config,
): LabelValueType[] {
  return React.useMemo(() => {
    let mergedRawValues = rawValues;

    if (treeConduction) {
      mergedRawValues = formatStrategyValues(
        rawValues as RawValueType[],
        showCheckedStrategy,
        conductKeyEntities,
      );
    }

    return getRawValueLabeled(mergedRawValues, value, getEntityByValue, treeNodeLabelProp);
  }, [rawValues, value, treeConduction, showCheckedStrategy, treeNodeLabelProp]);
}
