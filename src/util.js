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

// =============== Current ===============
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

/**
 * Convert value to array format to make logic simplify
 */
export function formatValue(value, props) {
  if (!value) return [];

  const valueList = Array.isArray(value) ? value : [value];

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
