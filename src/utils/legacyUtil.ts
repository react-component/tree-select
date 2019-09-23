import React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import warning from 'rc-util/lib/warning';
import { DataNode, LegacyDataNode } from '../interface';

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
