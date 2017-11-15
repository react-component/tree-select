/* eslint-disable no-undef */
import React from 'react';
import TreeSelect from '../../src/Select';
import { mount } from 'enzyme';

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
    const treeData = [
      { key: '0', value: '0', label: '0 label' },
    ];
    const wrapper = mount(
      <TreeSelect
        {...{ [mode]: true }}
        onFocus={handleFocus}
        treeData={treeData}
      />,
      { attachTo: container }
    );

    wrapper.instance().focus();
    expect(handleFocus).toBeCalled();
  });


  it('blur()', () => {
    const handleBlur = jest.fn();
    const treeData = [
      { key: '0', value: '0', label: '0 label' },
    ];
    const wrapper = mount(
      <TreeSelect
        {...{ [mode]: true }}
        onBlur={handleBlur}
        treeData={treeData}
      />,
      { attachTo: container }
    );
    wrapper.instance().focus();
    wrapper.instance().blur();
    expect(handleBlur).toBeCalled();
  });

  it('autoFocus', () => {
    const handleFocus = jest.fn();
    const treeData = [
      { key: '0', value: '0', label: '0 label' },
    ];
    mount(
      <TreeSelect
        {...{ [mode]: true }}
        autoFocus
        onFocus={handleFocus}
        treeData={treeData}
      />,
      { attachTo: container }
    );
    expect(handleFocus).toBeCalled();
  });
}
