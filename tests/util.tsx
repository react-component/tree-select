import { fireEvent, createEvent } from '@testing-library/react';

export function selectNode(index = 0) {
  const treeNode = document.querySelectorAll('.rc-tree-select-tree-node-content-wrapper')[index];
  fireEvent.click(treeNode);
}

export function keyDown(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyDown(element, { keyCode });
  fireEvent(element, event);
}

export function keyUp(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyUp(element, { keyCode });
  fireEvent(element, event);
}
