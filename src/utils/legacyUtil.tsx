import React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import warning from 'rc-util/lib/warning';
import {
  DataNode,
  LegacyDataNode,
  ChangeEventExtra,
  InnerDataNode,
  Key,
  RawValueType,
  LegacyCheckedNode,
} from '../interface';
import TreeNode from '../TreeNode';

export function convertChildrenToData(nodes: React.ReactNode): DataNode[] {
  return toArray(nodes)
    .map((node: React.ReactElement) => {
      if (!React.isValidElement(node) || !node.type) {
        return null;
      }

      const {
        key,
        props: { children, value, ...restProps },
      } = node as React.ReactElement;

      const data = {
        key,
        value,
        ...restProps,
      };

      const childData = convertChildrenToData(children);
      if (childData.length) {
        data.children = childData;
      }

      return data;
    })
    .filter(data => data);
}

export function fillLegacyProps(dataNode: DataNode): LegacyDataNode {
  const cloneNode = { ...dataNode };

  if (!('props' in cloneNode)) {
    Object.defineProperty(cloneNode, 'props', {
      get() {
        warning(
          false,
          'New `rc-tree-select` not support return node instance as argument anymore. Please consider to remove `props` access.',
        );
        return cloneNode;
      },
    });
  }

  return cloneNode as LegacyDataNode;
}

export function fillAdditionalInfo(
  extra: ChangeEventExtra,
  triggerValue: RawValueType,
  checkedValues: RawValueType[],
  treeData: InnerDataNode[],
  treeCheckStrictly: boolean,
) {
  let nodeMap: Map<RawValueType, LegacyCheckedNode> = null;

  function generateMap() {
    if (!nodeMap) {
      nodeMap = new Map();

      function dig(list: InnerDataNode[], level: string = '0'): LegacyCheckedNode[] {
        return list.map((dataNode, index) => {
          const pos = `${level}-${index}`;
          const children = dig(dataNode.children || [], pos);

          const checkedNode: LegacyCheckedNode = {
            pos,
            node: <TreeNode {...dataNode}>{children.map(child => child.node)}</TreeNode>,
            children,
          };

          nodeMap.set(dataNode.value, checkedNode);

          return checkedNode;
        });
      }

      dig(treeData);
    }
    return nodeMap;
  }

  Object.defineProperty(extra, 'triggerNode', {
    get() {
      warning(false, '`triggerNode` is deprecated. Please consider decoupling data with node.');
      generateMap();

      return nodeMap.get(triggerValue);
    },
  });
  Object.defineProperty(extra, 'allCheckedNodes', {
    get() {
      warning(false, '`allCheckedNodes` is deprecated. Please consider decoupling data with node.');
      generateMap();

      const list = checkedValues.map(val => nodeMap.get(val));

      if (treeCheckStrictly) {
        return list.map(({ node }) => node);
      }

      return list;
    },
  });
}
