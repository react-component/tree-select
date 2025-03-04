import * as React from 'react';
import type { DataEntity } from '@rc-component/tree/lib/interface';
import { conductCheck } from '@rc-component/tree/lib/utils/conductUtil';
import type { LabeledValueType, SafeKey, Key } from '../interface';

const useCheckedKeys = (
  rawLabeledValues: LabeledValueType[],
  rawHalfCheckedValues: LabeledValueType[],
  treeConduction: boolean,
  keyEntities: Record<SafeKey, DataEntity>,
) => {
  return React.useMemo(() => {
    const extractValues = (values: LabeledValueType[]): Key[] => values.map(({ value }) => value);

    const checkedKeys = extractValues(rawLabeledValues);
    const halfCheckedKeys = extractValues(rawHalfCheckedValues);

    const missingValues = checkedKeys.filter(key => !keyEntities[key as SafeKey]);

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
