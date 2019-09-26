/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect from '../../src';

export default function focusTest(mode) {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('focus()', () => {
    const handleFocus = jest.fn();
    const treeData = [{ key: '0', value: '0', title: '0 label' }];
    const wrapper = mount(
      <TreeSelect {...{ [mode]: true }} onFocus={handleFocus} treeData={treeData} />,
      { attachTo: container },
    );

    wrapper.instance().focus();
    expect(handleFocus).toHaveBeenCalled();
  });

  it('blur()', () => {
    const handleBlur = jest.fn();
    const treeData = [{ key: '0', value: '0', title: '0 label' }];
    const wrapper = mount(
      <TreeSelect {...{ [mode]: true }} onBlur={handleBlur} treeData={treeData} />,
      { attachTo: container },
    );
    wrapper.instance().focus();
    wrapper.instance().blur();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('autoFocus', () => {
    const handleFocus = jest.fn();
    const treeData = [{ key: '0', value: '0', title: '0 label' }];
    mount(
      <TreeSelect {...{ [mode]: true }} autoFocus onFocus={handleFocus} treeData={treeData} />,
      { attachTo: container },
    );
    expect(handleFocus).toHaveBeenCalled();
  });
}
