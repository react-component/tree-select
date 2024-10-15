import * as React from 'react';
import type { DataEntity } from 'rc-tree/lib/interface';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import type { LabeledValueType, SafeKey } from '../interface';

const useCheckedKeys = (
  rawLabeledValues: LabeledValueType[],
  rawHalfCheckedValues: LabeledValueType[],
  treeConduction: boolean,
  keyEntities: Record<SafeKey, DataEntity>,
) => {
  return React.useMemo(() => {
    const extractValues = (values: LabeledValueType[]): SafeKey[] =>
      values.map(({ value }) => value);

    const checkedKeys = extractValues(rawLabeledValues);
    const halfCheckedKeys = extractValues(rawHalfCheckedValues);

    const missingValues = checkedKeys.filter(key => !keyEntities[key]);

    let finalCheckedKeys = checkedKeys;
    let finalHalfCheckedKeys = halfCheckedKeys;

    if (treeConduction) {
      const conductResult = conductCheck(checkedKeys, true, keyEntities);
      finalCheckedKeys = conductResult.checkedKeys;
      finalHalfCheckedKeys = conductResult.halfCheckedKeys;
    }

    return [Array.from(new Set([...missingValues, ...finalCheckedKeys])), finalHalfCheckedKeys];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
};

export default useCheckedKeys;
