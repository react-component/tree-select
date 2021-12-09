import * as React from 'react';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import type { DefaultOptionType } from '../TreeSelect';
import useRefFunc from './useRefFunc';

/**
 * This function will try to call requestIdleCallback if available to save performance.
 */
export default (
  treeData: DefaultOptionType[],
  treeConduction: boolean,
  fieldNames: InternalFieldName,
) => {
  // const { keyEntities: conductKeyEntities } = React.useMemo(() => {
  //   if (treeConduction) {
  //     return convertDataToEntities(mergedTreeData as any);
  //   }
  //   return { keyEntities: null };
  // }, [mergedTreeData, treeCheckable, treeCheckStrictly]);
  const cacheRef = React.useRef<{
    process?: DefaultOptionType[];
    treeData?: DefaultOptionType[];
    keyEntities?: Record<string, any>;
  }>({});

  // Call useIdleCallback to get data async
  React.useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined' && typeof cancelIdleCallback !== 'undefined') {
      cacheRef.current.process = treeData;

      // Call requestIdleCallback
      const id = requestIdleCallback(() => {
        console.log('waht????');
      });

      return () => cancelIdleCallback(id);
    }
  }, [treeData]);

  return useRefFunc(() => {
    if (cacheRef.current.treeData !== treeData) {
      // Force generate conduction data
    }

    return cacheRef.current.keyEntities;
  });
};
