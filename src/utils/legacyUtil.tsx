import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import warning from 'rc-util/lib/warning';
import type { DataNode, ChangeEventExtra, RawValueType, LegacyCheckedNode } from '../interface';
import TreeNode from '../TreeNode';
import type { DefaultOptionType, FieldNames } from '../TreeSelect';

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

export function fillLegacyProps(dataNode: DataNode): any {
  if (!dataNode) {
    return dataNode;
  }

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

  return cloneNode;
}

export function fillAdditionalInfo(
  extra: ChangeEventExtra,
  triggerValue: RawValueType,
  checkedValues: RawValueType[],
  treeData: DefaultOptionType[],
  showPosition: boolean,
  fieldNames: FieldNames,
) {
  let triggerNode: React.ReactNode = null;
  let nodeList: LegacyCheckedNode[] = null;

  function generateMap() {
    function dig(list: DefaultOptionType[], level = '0', parentIncluded = false) {
      return list
        .map((option, index) => {
          const pos = `${level}-${index}`;
          const value = option[fieldNames.value];
          const included = checkedValues.includes(value);
          const children = dig(option[fieldNames.children] || [], pos, included);
          const node = (
            <TreeNode {...(option as Required<DefaultOptionType>)}>
              {children.map(child => child.node)}
            </TreeNode>
          );

          // Link with trigger node
          if (triggerValue === value) {
            triggerNode = node;
          }

          if (included) {
            const checkedNode: LegacyCheckedNode = {
              pos,
              node,
              children,
            };

            if (!parentIncluded) {
              nodeList.push(checkedNode);
            }

            return checkedNode;
          }
          return null;
        })
        .filter(node => node);
    }

    if (!nodeList) {
      nodeList = [];

      dig(treeData);

      // Sort to keep the checked node length
      nodeList.sort(
        (
          {
            node: {
              props: { value: val1 },
            },
          },
          {
            node: {
              props: { value: val2 },
            },
          },
        ) => {
          const index1 = checkedValues.indexOf(val1);
          const index2 = checkedValues.indexOf(val2);
          return index1 - index2;
        },
      );
    }
  }

  Object.defineProperty(extra, 'triggerNode', {
    get() {
      warning(false, '`triggerNode` is deprecated. Please consider decoupling data with node.');
      generateMap();

      return triggerNode;
    },
  });
  Object.defineProperty(extra, 'allCheckedNodes', {
    get() {
      warning(false, '`allCheckedNodes` is deprecated. Please consider decoupling data with node.');
      generateMap();

      if (showPosition) {
        return nodeList;
      }

      return nodeList.map(({ node }) => node);
    },
  });
}
