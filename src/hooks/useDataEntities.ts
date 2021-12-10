import * as React from 'react';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import type { DataEntity } from 'rc-tree/lib/interface';
import type { FieldNames } from '../TreeSelect';

export default (treeData: any, fieldNames: FieldNames) =>
  React.useMemo<{ keyEntities: Record<string, DataEntity> }>(
    () =>
      convertDataToEntities(treeData, {
        fieldNames,
        initWrapper: wrapper => ({
          ...wrapper,
          valueEntities: new Map(),
        }),
        processEntity: (entity, wrapper: any) => {
          wrapper.valueEntities.set(entity.node[fieldNames.value], entity);
        },
      }),
    [treeData, fieldNames],
  ) as ReturnType<typeof convertDataToEntities> & { valueEntities: Map<any, DataEntity> };
