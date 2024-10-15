import type { DataNode, FieldNames, SafeKey } from '../interface';
import type { DefaultOptionType, InternalFieldName } from '../TreeSelect';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export function fillFieldNames(fieldNames?: FieldNames) {
  const { label, value, children } = fieldNames || {};
  return {
    _title: label ? [label] : ['title', 'label'],
    value: value || 'value',
    key: value || 'value',
    children: children || 'children',
  };
}

export function isCheckDisabled(node: DataNode) {
  return !node || node.disabled || node.disableCheckbox || node.checkable === false;
}

/** 递归获取树中所有存在的键 */
export function getAllKeys(
  treeData: DefaultOptionType[],
  fieldNames: InternalFieldName,
): SafeKey[] {
  const keys: SafeKey[] = [];
  const traverseTree = (nodes: DefaultOptionType[]): void => {
    nodes.forEach(node => {
      keys.push(node[fieldNames.value]);
      const children = node[fieldNames.children];
      if (Array.isArray(children)) {
        traverseTree(children);
      }
    });
  };
  traverseTree(treeData);
  return keys;
}

export function isNil(val: any) {
  return val === null || val === undefined;
}
