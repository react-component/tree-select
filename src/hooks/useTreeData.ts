import * as React from 'react';
import warning from 'rc-util/lib/warning';
import type { DataNode, InnerDataNode, SimpleModeConfig, RawValueType } from '../interface';
import { convertChildrenToData } from '../utils/legacyUtil';

const MAX_WARNING_TIMES = 10;

function parseSimpleTreeData(
  treeData: DataNode[],
  { id, pId, rootPId }: SimpleModeConfig,
): DataNode[] {
  const keyNodes = {};
  const rootNodeList = [];

  // Fill in the map
  const nodeList = treeData.map((node) => {
    const clone = { ...node };
    const key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach((node) => {
    const parentKey = node[pId];
    const parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || (!parent && rootPId === null)) {
      rootNodeList.push(node);
    }
  });

  return rootNodeList;
}

/**
 * Format `treeData` with `value` & `key` which is used for calculation
 */
function formatTreeData(
  treeData: DataNode[],
  getLabelProp: (node: DataNode) => React.ReactNode,
): InnerDataNode[] {
  let warningTimes = 0;
  const valueSet = new Set<RawValueType>();

  function dig(dataNodes: DataNode[]) {
    return (dataNodes || []).map((node) => {
      const { key, value, children, ...rest } = node;

      const mergedValue = 'value' in node ? value : key;

      const dataNode: InnerDataNode = {
        ...rest,
        key: key !== null && key !== undefined ? key : mergedValue,
        value: mergedValue,
        title: getLabelProp(node),
      };

      // Check `key` & `value` and warning user
      if (process.env.NODE_ENV !== 'production') {
        if (
          key !== null &&
          key !== undefined &&
          value !== undefined &&
          String(key) !== String(value) &&
          warningTimes < MAX_WARNING_TIMES
        ) {
          warningTimes += 1;
          warning(
            false,
            `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${value}.`,
          );
        }

        warning(!valueSet.has(value), `Same \`value\` exist in the tree: ${value}`);
        valueSet.add(value);
      }

      if ('children' in node) {
        dataNode.children = dig(children);
      }

      return dataNode;
    });
  }

  return dig(treeData);
}

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(
  treeData: DataNode[],
  children: React.ReactNode,
  {
    getLabelProp,
    simpleMode,
  }: {
    getLabelProp: (node: DataNode) => React.ReactNode;
    simpleMode: boolean | SimpleModeConfig;
  },
): InnerDataNode[] {
  const cacheRef = React.useRef<{
    treeData?: DataNode[];
    children?: React.ReactNode;
    formatTreeData?: InnerDataNode[];
  }>({});

  if (treeData) {
    cacheRef.current.formatTreeData =
      cacheRef.current.treeData === treeData
        ? cacheRef.current.formatTreeData
        : formatTreeData(
            simpleMode
              ? parseSimpleTreeData(treeData, {
                  id: 'id',
                  pId: 'pId',
                  rootPId: null,
                  ...(simpleMode !== true ? simpleMode : {}),
                })
              : treeData,
            getLabelProp,
          );

    cacheRef.current.treeData = treeData;
  } else {
    cacheRef.current.formatTreeData =
      cacheRef.current.children === children
        ? cacheRef.current.formatTreeData
        : formatTreeData(convertChildrenToData(children), getLabelProp);
  }

  return cacheRef.current.formatTreeData;
}
