import { fireEvent } from '@testing-library/react';

export function selectNode(index = 0) {
  const treeNode = document.querySelectorAll('.rc-tree-select-tree-node-content-wrapper')[index];
  fireEvent.click(treeNode);
}
