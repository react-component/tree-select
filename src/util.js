import React from 'react';
import { traverseTreeNodes } from 'rc-tree/lib/util';
import SelectNode from './SelectNode';

// =================== MISC ====================
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

export function preventDefaultEvent(e) {
  e.preventDefault();
}

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
  const parsedList = positionList.slice().map(entity => ({
    ...entity,
    fields: entity.pos.split('-'),
  }));

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

    // Some time position list provide key, we don't need it
    delete entity.key;
    delete entity.fields;
  });

  return Object.keys(entrances).map(key => entrances[key]);
}

// =================== Delay ===================
export class Defer {
  id = null;
  func = null;
  priority = -1;

  next(func, priority = 0) {
    if (!this.func || this.priority <= priority) {
      this.func = func;
      this.priority = priority;

      this._timeout();
    }
  }

  _timeout() {
    clearTimeout(this.id);
    this.id = setTimeout(() => {
      if (this.func) {
        this.func();
        this.func = null;
        this.priority = -1;
      }
    }, 0);
  }
}

// =============== Accessibility ===============
const ARIA_BASIC = String(Math.random()).replace( /\D/g, '');
let ariaId = 0;

export function generateAriaId() {
  ariaId += 1;
  return `RC_TREE_SELECT_${ARIA_BASIC}_${ariaId}`;
}

export function isLabelInValue(props) {
  const { treeCheckable, treeCheckStrictly, labelInValue } = props;
  if (treeCheckable && treeCheckStrictly) {
    return true;
  }
  return labelInValue || false;
}

// =================== Tree ====================
/**
 * Cover `treeData` to `TreeNode` structure.
 * `label` will force replace the `title` props.
 * ref: https://github.com/ant-design/ant-design/issues/9879
 */
export function dataToTree(treeData) {
  const list = toArray(treeData);

  return list.map(({ key, label, children ,...nodeProps }) => (
    <SelectNode key={key} {...nodeProps} title={label} label={label}>
      {dataToTree(children)}
    </SelectNode>
  ));
}

// =================== Value ===================
/**
 * Convert value to array format to make logic simplify.
 */
export function formatValue(value, props) {
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

/**
 * Convert value list to node list.
 * This will filter value if not exist in tree.
 */
export function mapValueToEntity(valueList, treeNodes) {
  const nodeList = [];

  traverseTreeNodes(treeNodes, ({ node, key, pos }) => {
    if (!node || !node.props) return;

    const { value } = node.props;
    const index = valueList.findIndex(item => item.value === value);

    if (index >= 0) {
      nodeList[index] = { node, key, pos };
    }
  });

  return nodeList.filter(node => node);
}

/**
 * Since value not provide label info, we need nest loop for the label.
 * This will filter value if not exist in tree.
 */
export function mapValueWithLabel(valueList, treeNodes) {
  return mapValueToEntity(valueList, treeNodes).map(({ node, key }) => {
    const { title, value } = node.props;
    return {
      label: title,
      value,
      key,
    };
  });
}
