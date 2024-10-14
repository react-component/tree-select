import type * as React from 'react';
import type { DataNode, FieldNames } from '../interface';
import type { DefaultOptionType, InternalFieldName } from '../TreeSelect';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export function fillFieldNames(fieldNames?: FieldNames) {
  const { label, value, children } = fieldNames || {};

  const mergedValue = value || 'value';

  return {
    _title: label ? [label] : ['title', 'label'],
    value: mergedValue,
    key: mergedValue,
    children: children || 'children',
  };
}

export function isCheckDisabled(node: DataNode) {
  return !node || node.disabled || node.disableCheckbox || node.checkable === false;
}

/** Loop fetch all the keys exist in the tree */
export function getAllKeys(treeData: DefaultOptionType[], fieldNames: InternalFieldName) {
  const keys: React.Key[] = [];

  function dig(list: DefaultOptionType[]) {
    list.forEach(item => {
      const children = item[fieldNames.children];
      if (children) {
        keys.push(item[fieldNames.value]);
        dig(children);
      }
    });
  }

  dig(treeData);

  return keys;
}

export function isNil(val: any) {
  return val === null || val === undefined;
}
