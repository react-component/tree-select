import { fireEvent, createEvent, act } from '@testing-library/react';

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

export function triggerOpen(element: HTMLElement) {
  fireEvent.mouseDown(element.querySelector('.rc-tree-select')!);
  act(() => {
    jest.advanceTimersByTime(10000);
  });
}

export function expectOpen(element: HTMLElement, open = true) {
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  return expect(!!element.querySelector('.rc-tree-select-open')).toBe(open);
}

export function search(element: HTMLElement, value: string) {
  const input = element.querySelector('input')!;
  fireEvent.change(input, { target: { value } });
  act(() => {
    jest.advanceTimersByTime(10000);
  });
}

export function clearSelection(element: HTMLElement, index = 0) {
  const removeButton = element.querySelectorAll('.rc-tree-select-selection-item-remove')[index];
  fireEvent.click(removeButton);
}
