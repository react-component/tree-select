/* eslint-disable no-undef, react/no-multi-comp, no-console */
import React from 'react';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from 'rc-tree';
import Trigger from 'rc-trigger';
import TreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode as SelectNode } from '../src';
import { resetAriaId } from '../src/util';
import { setMock } from './__mocks__/rc-animate';

describe('TreeSelect.tree', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetAriaId();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createSelect = (props) => (
    <Tree {...props}>
      <TreeNode key="0-0">
        <TreeNode key="0-0-0">
        <TreeNode key="0-0-0-0" />
        <TreeNode key="0-0-0-1" />
        </TreeNode>
        <TreeNode key="0-0-1">
          <TreeNode key="0-0-1-0" />
          <TreeNode key="0-0-1-1" />
        </TreeNode>
      </TreeNode>
    </Tree>
  );

  describe('treeExpandedKeys', () => {
    it('controlled', () => {
      // const 
      // const wrapper = mount(createSelect({}));
    });
  });
});
