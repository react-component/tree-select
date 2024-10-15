import type { InternalFieldName } from '../TreeSelect';
import type { DataEntity } from 'rc-tree/lib/interface';
import type { SafeKey } from '../interface';
import { isCheckDisabled } from './valueUtil';

export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';

export type CheckedStrategy = typeof SHOW_ALL | typeof SHOW_PARENT | typeof SHOW_CHILD;

export function formatStrategyValues(
  values: SafeKey[],
  strategy: CheckedStrategy,
  keyEntities: Record<SafeKey, DataEntity>,
  fieldNames: InternalFieldName,
): SafeKey[] {
  const valueSet = new Set(values);

  if (strategy === SHOW_CHILD) {
    return values.filter(key => {
      const entity = keyEntities[key];
      return (
        !entity ||
        !entity.children ||
        !entity.children.some(({ node }) => valueSet.has(node[fieldNames.value])) ||
        !entity.children.every(
          ({ node }) => isCheckDisabled(node) || valueSet.has(node[fieldNames.value]),
        )
      );
    });
  }
  if (strategy === SHOW_PARENT) {
    return values.filter(key => {
      const entity = keyEntities[key];
      const parent = entity ? entity.parent : null;
      return !parent || isCheckDisabled(parent.node) || !valueSet.has(parent.key);
    });
  }
  return values;
}
