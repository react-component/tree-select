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
    let checkedKeys: SafeKey[] = rawLabeledValues.map(({ value }) => value);
    let halfCheckedKeys: SafeKey[] = rawHalfCheckedValues.map(({ value }) => value);

    const missingValues = checkedKeys.filter(key => !keyEntities[key]);

    if (treeConduction) {
      ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities));
    }

    return [
      // Checked keys should fill with missing keys which should de-duplicated
      Array.from(new Set([...missingValues, ...checkedKeys])),
      // Half checked keys
      halfCheckedKeys,
    ];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
