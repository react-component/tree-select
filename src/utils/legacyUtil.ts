import React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import { DataNode } from '../interface';

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
