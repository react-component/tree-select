import { flattenTreeData } from 'rc-tree/lib/utils/treeUtil';
import { FlattenNode } from 'rc-tree/lib/interface';
import { FilterFunc } from 'rc-select/lib/interface/generator';
import {
  FlattenDataNode,
  Key,
  RawValueType,
  DataNode,
  DefaultValueType,
  LabelValueType,
  LegacyDataNode,
} from '../interface';
import { fillLegacyProps } from './legacyUtil';
import { SkipType } from '../hooks/useKeyValueMapping';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export function findValueOption(values: RawValueType[], options: FlattenDataNode[]): DataNode[] {
  const optionMap: Map<RawValueType, DataNode> = new Map();

  options.forEach(flattenItem => {
    const { data } = flattenItem;
    optionMap.set(data.value, data);
  });

  return values.map(val => fillLegacyProps(optionMap.get(val)));
}

export function isValueDisabled(value: RawValueType, options: FlattenDataNode[]): boolean {
  const option = findValueOption([value], options)[0];
  if (option) {
    return option.disabled;
  }

  return false;
}

export function isCheckDisabled(node: DataNode) {
  return node.disabled || node.disableCheckbox || node.checkable === false;
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
    return (list || []).map(node => {
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

function getDefaultFilterOption(optionFilterProp: string) {
  return (searchValue: string, dataNode: LegacyDataNode) => {
    const value = dataNode[optionFilterProp];

    return String(value)
      .toLowerCase()
      .includes(String(searchValue).toLowerCase());
  };
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: DataNode[],
  {
    optionFilterProp,
    filterOption,
  }: { optionFilterProp: string; filterOption: boolean | FilterFunc<LegacyDataNode> },
): DataNode[] {
  if (filterOption === false) {
    return options;
  }

  let filterOptionFunc: FilterFunc<LegacyDataNode>;
  if (typeof filterOption === 'function') {
    filterOptionFunc = filterOption;
  } else {
    filterOptionFunc = getDefaultFilterOption(optionFilterProp);
  }

  function dig(list: DataNode[], keepAll: boolean = false) {
    return list
      .map(dataNode => {
        const { children } = dataNode;

        const match = keepAll || filterOptionFunc(searchValue, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList.length) {
          return {
            ...dataNode,
            children: childList,
          };
        }
        return null;
      })
      .filter(node => node);
  }

  return dig(options);
}

export function getRawValueLabeled(
  values: RawValueType[],
  prevValue: DefaultValueType,
  getEntityByValue: (value: RawValueType, skipType?: SkipType) => FlattenDataNode,
  getLabelProp: (node: DataNode) => React.ReactNode,
): LabelValueType[] {
  const valueMap = new Map<RawValueType, LabelValueType>();

  toArray(prevValue).forEach(item => {
    if (item && typeof item === 'object' && 'value' in item) {
      valueMap.set(item.value, item);
    }
  });

  return values.map(val => {
    const item: LabelValueType = { value: val };
    const entity = getEntityByValue(val);
    const label = entity ? getLabelProp(entity.data) : val;

    if (valueMap.has(val)) {
      const labeledValue = valueMap.get(val);
      item.label = 'label' in labeledValue ? labeledValue.label : label;
      if ('halfChecked' in labeledValue) {
        item.halfChecked = labeledValue.halfChecked;
      }
    } else {
      item.label = label;
    }

    return item;
  });
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
