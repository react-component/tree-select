import React from 'react';
import warning from 'rc-util/lib/warning';
import { DataNode, InnerDataNode, SimpleModeConfig } from '../interface';
import { convertChildrenToData } from '../utils/legacyUtil';

function parseSimpleTreeData(
  treeData: DataNode[],
  { id, pId, rootPId }: SimpleModeConfig,
): DataNode[] {
  const keyNodes = {};
  const rootNodeList = [];

  // Fill in the map
  const nodeList = treeData.map(node => {
    const clone = { ...node };
    const key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach(node => {
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
function formatTreeData(treeData: DataNode[], labelProp: string): InnerDataNode[] {
  return treeData.map(node => {
    const { key, value, children, ...rest } = node;

    const mergedValue = 'value' in node ? value : key;

    const dataNode: InnerDataNode = {
      ...rest,
      key: mergedValue,
      value: mergedValue,
      title: node[labelProp],
    };

    warning(
      key === null || key === undefined || value === undefined || String(key) === String(value),
      '`key` or `value` with TreeNode must be the same or you can remove one of them.',
    );

    if ('children' in node) {
      dataNode.children = formatTreeData(children, labelProp);
    }

    return dataNode;
  });
}

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(
  treeData: DataNode[],
  children: React.ReactNode,
  {
    labelProp,
    simpleMode,
  }: {
    labelProp: string;
    simpleMode: boolean | SimpleModeConfig;
  },
) {
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
            labelProp || 'label',
          );
  } else {
    cacheRef.current.formatTreeData =
      cacheRef.current.children === children
        ? cacheRef.current.formatTreeData
        : formatTreeData(convertChildrenToData(children), labelProp || 'title');
  }

  return cacheRef.current.formatTreeData;
}
