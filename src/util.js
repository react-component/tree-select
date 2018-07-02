import React from 'react';
import warning from 'warning';
import SelectNode from './SelectNode';
import { SHOW_CHILD, SHOW_PARENT } from './strategies';

// When treeNode not provide key, and we will use value as key.
// Some time value is empty, we should pass it instead.
const KEY_OF_VALUE_EMPTY = 'RC_TREE_SELECT_KEY_OF_VALUE_EMPTY';

let warnDeprecatedLabel = false;

// =================== MISC ====================
export function toTitle(title) {
  if (typeof title === 'string') {
    return title;
  }
  return null;
}

export function toArray(data) {
  if (!data) return [];

  return Array.isArray(data) ? data : [data];
}

// Shallow copy of React 16.3 createRef api
export function createRef() {
  const func = function setRef(node) {
    func.current = node;
  };
  return func;
}

// =============== Legacy ===============
export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
};

/**
 * Convert position list to hierarchy structure.
 * This is little hack since use '-' to split the position.
 */
export function flatToHierarchy(positionList) {
  if (!positionList.length) {
    return [];
  }

  const entrances = {};

  // Prepare the position map
  const posMap = {};
  const parsedList = positionList.slice().map(entity => {
    const clone = {
      ...entity,
      fields: entity.pos.split('-'),
    };
    delete clone.children;
    return clone;
  });

  parsedList.forEach((entity) => {
    posMap[entity.pos] = entity;
  });

  parsedList.sort((a, b) => {
    return a.fields.length - b.fields.length;
  });

  // Create the hierarchy
  parsedList.forEach((entity) => {
    const parentPos = entity.fields.slice(0, -1).join('-');
    const parentEntity = posMap[parentPos];

    if (!parentEntity) {
      entrances[entity.pos] = entity;
    } else {
      parentEntity.children = parentEntity.children || [];
      parentEntity.children.push(entity);
    }

    // Some time position list provide `key`, we don't need it
    delete entity.key;
    delete entity.fields;
  });

  return Object.keys(entrances).map(key => entrances[key]);
}

// =============== Accessibility ===============
let ariaId = 0;

export function resetAriaId() {
  ariaId = 0;
}

export function generateAriaId(prefix) {
  ariaId += 1;
  return `${prefix}_${ariaId}`;
}

export function isLabelInValue(props) {
  const { treeCheckable, treeCheckStrictly, labelInValue } = props;
  if (treeCheckable && treeCheckStrictly) {
    return true;
  }
  return labelInValue || false;
}

// =================== Tree ====================
export function parseSimpleTreeData(treeData, { id, pId, rootPId }) {
  const keyNodes = {};
  const rootNodeList = [];

  // Fill in the map
  const nodeList = treeData.map((node) => {
    const clone = { ...node };
    const key = clone[id];
    keyNodes[key] = clone;
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
 * `Tree` use `key` to track state but it will changed by React.
 * We need convert it back to the data and re-generate by `key`.
 * This is will cause performance issue.
 */
export function convertTreeToData(treeNodes) {
  return React.Children.map(treeNodes || [], (node) => {
    if (!React.isValidElement(node) || !node.type || !node.type.isTreeNode) {
      return null;
    }

    const { key, props } = node;

    return {
      ...props,
      key,
      children: convertTreeToData(props.children),
    };
  }).filter(data => data);
}

/**
 * Convert `treeData` to TreeNode List contains the mapping data.
 */
export function convertDataToEntities(treeData) {
  const list = toArray(treeData);

  const valueEntities = {};
  const keyEntities = {};
  const posEntities = {};

  function traverse(subTreeData, parentPos) {
    const subList = toArray(subTreeData);

    return subList.map(({ key, title, label, value, children ,...nodeProps }, index) => {
      const pos = `${parentPos}-${index}`;

      const entity = { key, value, pos };

      // This may cause some side effect, need additional check
      entity.key = entity.key || value;
      if (!entity.key && entity.key !== 0) {
        entity.key = KEY_OF_VALUE_EMPTY;
      }

      // Fill children
      entity.parent = posEntities[parentPos];
      if (entity.parent) {
        entity.parent.children = entity.parent.children || [];
        entity.parent.children.push(entity);
      }

      // Fill entities
      valueEntities[value] = entity;
      keyEntities[entity.key] = entity;
      posEntities[pos] = entity;

      // Warning user not to use deprecated label prop.
      if ((!title && label) && !warnDeprecatedLabel) {
        warning(
          false,
          '\'label\' in treeData is deprecated. Please use \'title\' instead.'
        );
        warnDeprecatedLabel = true;
      }

      const node = (
        <SelectNode key={entity.key} {...nodeProps} title={title || label} label={label} value={value}>
          {traverse(children, pos)}
        </SelectNode>
      );

      entity.node = node;

      return node;
    });
  }

  const treeNodes = traverse(list, '0');

  return {
    treeNodes,

    valueEntities,
    keyEntities,
    posEntities,
  };
}

/**
 * Detect if position has relation.
 * e.g. 1-2 related with 1-2-3
 * e.g. 1-3-2 related with 1
 * e.g. 1-2 not related with 1-21
 */
export function isPosRelated(pos1, pos2) {
  const fields1 = pos1.split('-');
  const fields2 = pos2.split('-');

  const minLen = Math.min(fields1.length, fields2.length);
  for (let i = 0; i < minLen; i += 1) {
    if (fields1[i] !== fields2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Get a filtered TreeNode list by provided treeNodes.
 * [Legacy] Since `Tree` use `key` as map but `key` will changed by React,
 * we have to convert `treeNodes > data > treeNodes` to keep the key.
 * Such performance hungry!
 */
export function getFilterTree(treeNodes, searchValue, filterFunc) {
  if (!searchValue) {
    return null;
  }

  function mapFilteredNodeToData(node) {
    if (!node) return null;

    let match = false;
    if (filterFunc(searchValue, node)) {
      match = true;
    }

    const children = (React.Children.map(node.props.children, mapFilteredNodeToData) || []).filter(n => n);

    if (children.length || match) {
      return {
        ...node.props,
        key: node.key,
        children,
      };
    }

    return null;
  }

  return convertDataToEntities(
    treeNodes.map(mapFilteredNodeToData).filter(node => node)
  ).treeNodes;
}

// =================== Value ===================
/**
 * Convert value to array format to make logic simplify.
 */
export function formatInternalValue(value, props) {
  const valueList = toArray(value);

  // Parse label in value
  if (isLabelInValue(props)) {
    return valueList.map((val) => {
      if (typeof val !== 'object' || !val) {
        return {
          value: '',
          label: '',
        };
      }

      return val;
    });
  }

  return valueList.map(val => ({
    value: val,
  }));
}

export function getLabel(wrappedValue, entity, treeNodeLabelProp) {
  if (wrappedValue.label) {
    return wrappedValue.label;
  }

  if (entity && entity.node.props) {
    return entity.node.props[treeNodeLabelProp];
  }

  // Since value without entity will be in missValueList.
  // This code will never reached, but we still need this in case.
  return wrappedValue.value;
}

/**
 * Convert internal state `valueList` to user needed value list.
 * This will return an array list. You need check if is not multiple when return.
 *
 * `allCheckedNodes` is used for `treeCheckStrictly`
 */
export function formatSelectorValue(valueList, props, valueEntities) {
  const {
    treeNodeLabelProp,
    treeCheckable, treeCheckStrictly, showCheckedStrategy,
  } = props;


  // Will hide some value if `showCheckedStrategy` is set
  if (treeCheckable && !treeCheckStrictly) {
    const values = {};
    valueList.forEach((wrappedValue) => {
      values[wrappedValue.value] = wrappedValue;
    });
    const hierarchyList = flatToHierarchy(valueList.map(({ value }) => valueEntities[value]));

    if (showCheckedStrategy === SHOW_PARENT) {
      // Only get the parent checked value
      return hierarchyList.map(({ node: { props: { value } } }) => ({
        label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
        value,
      }));

    } else if (showCheckedStrategy === SHOW_CHILD) {
      // Only get the children checked value
      const targetValueList = [];

      // Find the leaf children
      const traverse = ({ node: { props: { value } }, children }) => {
        if (!children || children.length === 0) {
          targetValueList.push({
            label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
            value,
          });
          return;
        }

        children.forEach((entity) => {
          traverse(entity);
        });
      };

      hierarchyList.forEach((entity) => {
        traverse(entity);
      });

      return targetValueList;
    }
  }

  return valueList.map(wrappedValue => ({
    label: getLabel(wrappedValue, valueEntities[wrappedValue.value], treeNodeLabelProp),
    value: wrappedValue.value,
  }));
}

/**
 * When user search the tree, will not get correct tree checked status.
 * For checked key, use the `rc-tree` `calcCheckStateConduct` function.
 * For unchecked key, we need the calculate ourselves.
 */
export function calcUncheckConduct(keyList, uncheckedKey, keyEntities) {
  let myKeyList = keyList.slice();

  function conductUp(conductKey) {
    myKeyList = myKeyList.filter(key => key !== conductKey);

    // Check if need conduct
    const parentEntity = keyEntities[conductKey].parent;
    if (parentEntity && myKeyList.some(key => key === parentEntity.key)) {
      conductUp(parentEntity.key);
    }
  }

  function conductDown(conductKey) {
    myKeyList = myKeyList.filter(key => key !== conductKey);

    (keyEntities[conductKey].children || []).forEach((childEntity) => {
      conductDown(childEntity.key);
    });
  }

  conductUp(uncheckedKey);
  conductDown(uncheckedKey);

  return myKeyList;
}
