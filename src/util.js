// Shallow copy of React 16.3 createRef api
export function createRef() {
  const func = function (node) {
    func.current = node;
  };
  return func;
}
