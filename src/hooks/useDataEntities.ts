import * as React from 'react';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import type { DataEntity } from 'rc-tree/lib/interface';
import type { FieldNames, RawValueType } from '../TreeSelect';
import warning from 'rc-util/lib/warning';
import { isNil } from '../utils/valueUtil';

export default (treeData: any, fieldNames: FieldNames) =>
  React.useMemo<{ keyEntities: Record<string, DataEntity> }>(() => {
    const collection = convertDataToEntities(treeData, {
      fieldNames,
      initWrapper: wrapper => ({
        ...wrapper,
        valueEntities: new Map(),
      }),
      processEntity: (entity, wrapper: any) => {
        const val = entity.node[fieldNames.value];

        // Check if exist same value
        if (process.env.NODE_ENV !== 'production') {
          const key = entity.node.key;

          warning(!isNil(val), 'TreeNode `value` is invalidate: undefined');
          warning(!wrapper.valueEntities.has(val), `Same \`value\` exist in the tree: ${val}`);
          warning(
            !key || String(key) === String(val),
            `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${val}.`,
          );
        }
        wrapper.valueEntities.set(val, entity);
      },
    });

    return collection;
  }, [treeData, fieldNames]) as ReturnType<typeof convertDataToEntities> & {
    valueEntities: Map<RawValueType, DataEntity>;
  };
