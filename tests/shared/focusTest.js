/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import TreeSelect from '../../src';

export default function focusTest(multiple = false) {
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
    const treeRef = React.createRef();

    mount(
      <TreeSelect multiple={multiple} onFocus={handleFocus} treeData={treeData} ref={treeRef} />,
      { attachTo: container },
    );

    treeRef.current.focus();
    expect(handleFocus).toHaveBeenCalled();
  });

  it('blur()', () => {
    const handleBlur = jest.fn();
    const treeData = [{ key: '0', value: '0', title: '0 label' }];
    const treeRef = React.createRef();

    mount(
      <TreeSelect multiple={multiple} onBlur={handleBlur} treeData={treeData} ref={treeRef} />,
      { attachTo: container },
    );
    treeRef.current.focus();
    treeRef.current.blur();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('autoFocus', () => {
    const handleFocus = jest.fn();
    const treeData = [{ key: '0', value: '0', title: '0 label' }];
    mount(<TreeSelect multiple={multiple} autoFocus onFocus={handleFocus} treeData={treeData} />, {
      attachTo: container,
    });
    expect(handleFocus).toHaveBeenCalled();
  });
}
