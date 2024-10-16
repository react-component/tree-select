import type { DataNode, FieldNames, SafeKey } from '../interface';

export const toArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : value !== undefined ? [value] : [];

export const fillFieldNames = (fieldNames?: FieldNames) => {
  const { label, value, children } = fieldNames || {};
  return {
    _title: label ? [label] : ['title', 'label'],
    value: value || 'value',
    key: value || 'value',
    children: children || 'children',
  };
};

export const isCheckDisabled = (node: DataNode): boolean =>
  !node || node.disabled || node.disableCheckbox || node.checkable === false;

export const getAllKeys = (treeData: DataNode[], fieldNames: FieldNames): SafeKey[] => {
  const keys: SafeKey[] = [];

  const dig = (list: DataNode[]): void => {
    list.forEach(item => {
      const children = item[fieldNames.children];
      if (children) {
        keys.push(item[fieldNames.value]);
        dig(children);
      }
    });
  };

  dig(treeData);

  return keys;
};

export const isNil = (val: any): boolean => val === null || val === undefined;
