import { DataEntity } from 'rc-tree/lib/interface';
import { RawValueType, Key, DataNode } from '../interface';

export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';

export type CheckedStrategy = typeof SHOW_ALL | typeof SHOW_PARENT | typeof SHOW_CHILD;

export function formatStrategyValues(
  rawValues: RawValueType[],
  strategy: CheckedStrategy,
  keyEntities: Record<Key, DataEntity>,
): RawValueType[] {
  const valueSet = new Set(rawValues);

  if (strategy === SHOW_CHILD) {
    return rawValues.filter(val => {
      const { children } = keyEntities[val];

      if (children && children.every(({ node }) => valueSet.has((node as DataNode).value))) {
        return false;
      }
      return true;
    });
  } if (strategy === SHOW_PARENT) {
    return rawValues.filter(val => {
      const { parent } = keyEntities[val];

      if (parent && valueSet.has((parent.node as DataNode).value)) {
        return false;
      }
      return true;
    });
  }
  return rawValues;
}
