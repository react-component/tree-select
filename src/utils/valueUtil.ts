import { flattenTreeData } from 'rc-tree/lib/utils/treeUtil';
import { FlattenNode } from 'rc-tree/lib/interface';
import { FilterFunc } from 'rc-select/lib/interface/generator';
import {
  FlattenDataNode,
  Key,
  RawValueType,
  DataNode,
  InnerDataNode,
  DefaultValueType,
  LabelValueType,
} from '../interface';

export function findValueOption(values: RawValueType[], options: FlattenDataNode[]): DataNode[] {
  const optionMap: Map<RawValueType, DataNode> = new Map();

  options.forEach(flattenItem => {
    const { data } = flattenItem;
    optionMap.set(data.value, data);
  });

  return values.map(val => optionMap.get(val));
}

export function isValueDisabled(value: RawValueType, options: FlattenDataNode[]): boolean {
  const option = findValueOption([value], options)[0];
  if (option) {
    return option.disabled;
  }

  return false;
}

interface TreeDataNode {
  key: Key;
}

function getLevel({ parent }: FlattenNode): number {
  let level = 0;
  let current = parent;

  while (current) {
    current = current.parent;
    level += 1;
  }

  return level;
}

/**
 * Before reuse `rc-tree` logic, we need to add key since TreeSelect use `value` instead of `key`.
 */
export function flattenOptions(options: DataNode[]): FlattenDataNode[] {
  // Add missing key
  function fillKey(list: DataNode[]): TreeDataNode[] {
    return list.map(node => {
      const { value, key, children } = node;

      const clone = {
        ...node,
        key: 'key' in node ? key : value,
      };

      if (children) {
        clone.children = fillKey(children);
      }

      return clone;
    });
  }

  const flattenList = flattenTreeData(fillKey(options), true);

  return flattenList.map(node => ({
    key: node.data.key,
    data: node.data,
    level: getLevel(node),
  }));
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: DataNode[],
  {
    optionFilterProp,
    filterOption,
  }: { optionFilterProp: string; filterOption: boolean | FilterFunc<DataNode> },
) {
  // TODO: handle this
  return options;
}

export function getRawValue(value: DefaultValueType, labelInValue: boolean): RawValueType {
  return labelInValue ? (value as LabelValueType).value : (value as RawValueType);
}

export function getRawValues(
  value: DefaultValueType,
  multiple: boolean,
  labelInValue: boolean,
): RawValueType[] {
  const values = ((multiple ? value : [value]) as (RawValueType | LabelValueType)[]) || [];

  return values.map(val => getRawValue(val, labelInValue));
}

export function addValue(rawValues: RawValueType[], value: RawValueType) {
  const values = new Set(rawValues);
  values.add(value);
  return Array.from(values);
}
export function removeValue(rawValues: RawValueType[], value: RawValueType) {
  const values = new Set(rawValues);
  values.delete(value);
  return Array.from(values);
}

export function processConduction(rawValues: RawValueType[]): RawValueType[] {}
