import React from 'react';
import { traverseTreeNodes } from 'rc-tree/lib/util';
import SelectNode from './SelectNode';

// =================== MISC ====================
export function toArray(data) {
  if (!data) return [];

  return Array.isArray(data) ? data : [data];
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

// Shallow copy of React 16.3 createRef api
export function createRef() {
  const func = function setRef(node) {
    func.current = node;
  };
  return func;
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
 * Cover `treeData` to `TreeNode` structure
 */
export function dataToTree(treeData) {
  const list = toArray(treeData);

  return list.map(({ key, label, children ,...nodeProps }) => (
    <SelectNode key={key} title={label} label={label} {...nodeProps}>
      {dataToTree(children)}
    </SelectNode>
  ));
}

// =================== Value ===================
/**
 * Convert value to array format to make logic simplify
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
 * Since value not provide label info, we need nest loop for the label
 */
export function mapValueWithLabel(valueList, treeNodes) {
  const labeledValueList = valueList.slice();

  traverseTreeNodes(treeNodes, ({ node }) => {
    if (!node || !node.props) return;

    const { title, value } = node.props;
    const index = labeledValueList.findIndex(item => item.value === value);

    if (index >= 0) {
      labeledValueList[index].label = title;
    }
  });

  return labeledValueList;
}
