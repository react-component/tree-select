import * as React from 'react';
import type { DataEntity } from 'rc-tree/lib/interface';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import type { LabeledValueType, RawValueType } from '../TreeSelect';

export default (
  rawLabeledValues: LabeledValueType[],
  rawHalfCheckedValues: LabeledValueType[],
  treeConduction: boolean,
  keyEntities: Record<React.Key, DataEntity>,
) =>
  React.useMemo(() => {
    let checkedKeys: RawValueType[] = rawLabeledValues.map(({ value }) => value);
    let halfCheckedKeys: RawValueType[] = rawHalfCheckedValues.map(({ value }) => value);

    const missingValues = checkedKeys.filter(key => !keyEntities[key]);

    if (treeConduction) {
      ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities));
    }

    return [[...missingValues, ...checkedKeys], halfCheckedKeys];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
