import React from 'react';
import { render } from '@testing-library/react';
import TreeSelect, { TreeNode } from '../src';

describe('TreeSelect.semantic', () => {
  const createSingleSelect = (props = {}) => (
    <TreeSelect {...props}>
      <TreeNode value="0" title="Node 0" key="0">
        <TreeNode value="0-0" title="Node 0-0" key="0-0" />
        <TreeNode value="0-1" title="Node 0-1" key="0-1" />
      </TreeNode>
      <TreeNode value="1" title="Node 1" key="1" />
    </TreeSelect>
  );

  const createMultipleSelect = (props = {}) => (
    <TreeSelect multiple {...props}>
      <TreeNode value="0" title="Node 0" key="0">
        <TreeNode value="0-0" title="Node 0-0" key="0-0" />
        <TreeNode value="0-1" title="Node 0-1" key="0-1" />
      </TreeNode>
      <TreeNode value="1" title="Node 1" key="1" />
    </TreeSelect>
  );

  it('should support semantic classNames and styles in single mode', () => {
    const classNames = {
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      input: 'custom-input',
      clear: 'custom-clear',
      placeholder: 'custom-placeholder',
      content: 'custom-content',
    };

    const styles = {
      prefix: { color: 'red' },
      suffix: { color: 'blue' },
      input: { backgroundColor: 'yellow' },
      clear: { fontSize: '14px' },
      placeholder: { fontStyle: 'italic' },
      content: { fontWeight: 'bold' },
    };

    const { container } = render(
      createSingleSelect({
        value: '0',
        prefix: <span>Prefix</span>,
        suffix: <span>Suffix</span>,
        allowClear: true,
        placeholder: 'Please select',
        classNames,
        styles,
      }),
    );

    // Test prefix
    const prefixElement = container.querySelector(`.${classNames.prefix}`);
    expect(prefixElement).toBeTruthy();
    expect(prefixElement).toHaveStyle(styles.prefix);

    // Test suffix
    const suffixElement = container.querySelector(`.${classNames.suffix}`);
    expect(suffixElement).toBeTruthy();
    expect(suffixElement).toHaveStyle(styles.suffix);

    // Test content
    const contentElement = container.querySelector(`.${classNames.content}`);
    expect(contentElement).toBeTruthy();
    expect(contentElement).toHaveStyle(styles.content);

    // Test clear
    const clearElement = container.querySelector(`.${classNames.clear}`);
    expect(clearElement).toBeTruthy();
    expect(clearElement).toHaveStyle(styles.clear);
  });

  it('should support semantic classNames and styles in multiple mode', () => {
    const classNames = {
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      content: 'custom-content',
      clear: 'custom-clear',
      item: 'custom-item',
      itemContent: 'custom-item-content',
      itemRemove: 'custom-item-remove',
    };

    const styles = {
      prefix: { color: 'red' },
      suffix: { color: 'blue' },
      content: { fontWeight: 'bold' },
      clear: { fontSize: '14px' },
      item: { border: '1px solid green' },
      itemContent: { padding: '4px' },
      itemRemove: { color: 'orange' },
    };

    const { container } = render(
      createMultipleSelect({
        value: ['0', '1'],
        prefix: <span>Prefix</span>,
        suffix: <span>Suffix</span>,
        allowClear: true,
        classNames,
        styles,
      }),
    );

    // Test prefix
    const prefixElement = container.querySelector(`.${classNames.prefix}`);
    expect(prefixElement).toBeTruthy();
    expect(prefixElement).toHaveStyle(styles.prefix);

    // Test suffix
    const suffixElement = container.querySelector(`.${classNames.suffix}`);
    expect(suffixElement).toBeTruthy();
    expect(suffixElement).toHaveStyle(styles.suffix);

    // Test content
    const contentElement = container.querySelector(`.${classNames.content}`);
    expect(contentElement).toBeTruthy();
    expect(contentElement).toHaveStyle(styles.content);

    // Test clear
    const clearElement = container.querySelector(`.${classNames.clear}`);
    expect(clearElement).toBeTruthy();
    expect(clearElement).toHaveStyle(styles.clear);

    // Test items (multiple mode specific)
    const items = container.querySelectorAll(`.${classNames.item}`);
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item).toHaveStyle(styles.item);
    });

    // Test item contents (multiple mode specific)
    const itemContents = container.querySelectorAll(`.${classNames.itemContent}`);
    expect(itemContents.length).toBeGreaterThan(0);
    itemContents.forEach(content => {
      expect(content).toHaveStyle(styles.itemContent);
    });

    // Test item remove buttons (multiple mode specific)
    const removeButtons = container.querySelectorAll(`.${classNames.itemRemove}`);
    expect(removeButtons.length).toBeGreaterThan(0);
    removeButtons.forEach(button => {
      expect(button).toHaveStyle(styles.itemRemove);
    });
  });
});
