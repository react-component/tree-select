import * as React from 'react';
import type { DataEntity } from 'rc-tree/lib/interface';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import type { LabeledValueType, SafeKey } from '../interface';

export default (
  rawLabeledValues: LabeledValueType[],
  rawHalfCheckedValues: LabeledValueType[],
  treeConduction: boolean,
  keyEntities: Record<SafeKey, DataEntity>,
) =>
  React.useMemo(() => {
    const getValues = (values: LabeledValueType[]) => values.map(({ value }) => value);
    const checkedKeys = getValues(rawLabeledValues);
    const halfCheckedKeys = getValues(rawHalfCheckedValues);

    const missingValues = checkedKeys.filter(key => !keyEntities[key]);

    const finalCheckedKeys = treeConduction
      ? conductCheck(checkedKeys, true, keyEntities).checkedKeys
      : checkedKeys;

    return [
      Array.from(new Set([...missingValues, ...finalCheckedKeys])),
      treeConduction
        ? conductCheck(checkedKeys, true, keyEntities).halfCheckedKeys
        : halfCheckedKeys,
    ];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
