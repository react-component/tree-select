import { fireEvent, createEvent, act } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';

const keyMap: Record<number, string> = {
  [KeyCode.BACKSPACE]: 'Backspace',
  [KeyCode.ESC]: 'Escape',
  [KeyCode.ENTER]: 'Enter',
  [KeyCode.DOWN]: 'ArrowDown',
  [KeyCode.UP]: 'ArrowUp',
};

export function flushTimers() {
  if ((setTimeout as any).clock || jest.isMockFunction(setTimeout)) {
    act(() => {
      jest.advanceTimersByTime(10000);
    });
  }
}

export function selectNode(index = 0) {
  const treeNode = document.querySelectorAll('.rc-tree-select-tree-node-content-wrapper')[index];
  fireEvent.click(treeNode);
}

export function keyDown(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyDown(element, {
    key: keyMap[keyCode],
    keyCode,
    which: keyCode,
  });
  fireEvent(element, event);
}

export function keyUp(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyUp(element, {
    key: keyMap[keyCode],
    keyCode,
    which: keyCode,
  });
  fireEvent(element, event);
}

export function triggerOpen(element: HTMLElement) {
  fireEvent.mouseDown(element.querySelector('.rc-tree-select')!);
  flushTimers();
}

export function expectOpen(element: HTMLElement, open = true) {
  flushTimers();
  return expect(!!element.querySelector('.rc-tree-select-open')).toBe(open);
}

export function search(element: HTMLElement, value: string) {
  const input = element.querySelector('input')!;
  fireEvent.change(input, { target: { value } });
  flushTimers();
}

export function clearSelection(element: HTMLElement, index = 0) {
  const removeButton = element.querySelectorAll('.rc-tree-select-selection-item-remove')[index];
  fireEvent.click(removeButton);
}

export function clearAll(element: HTMLElement) {
  fireEvent.click(element.querySelector('.rc-tree-select-clear')!);
}

export function getSelections(element: HTMLElement = document.body) {
  return element.querySelectorAll('.rc-tree-select-selection-item');
}

export function getSelectionText(element: HTMLElement = document.body, index = 0) {
  const selection = getSelections(element)[index];
  return (selection?.querySelector('.rc-tree-select-selection-item-content') || selection)
    ?.textContent;
}

export function getInput(element: HTMLElement = document.body) {
  return element.querySelector('input') as HTMLInputElement;
}

export function getVisibleTreeNodes(element: HTMLElement = document.body) {
  return Array.from(element.querySelectorAll('.rc-tree-select-tree-treenode')).filter(
    node => !node.hasAttribute('aria-hidden'),
  );
}
