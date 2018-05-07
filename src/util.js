const ARIA_BASIC = String(Math.random()).replace( /\D/g, '');
let ariaId = 0;

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

export function generateAriaId () {
  ariaId += 1;
  return `RC_TREE_SELECT_${ARIA_BASIC}_${ariaId}`;
}
