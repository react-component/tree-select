import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from 'rc-util/lib/warning';
import TreeSelect from '../src';

describe('TreeSelect.warning', () => {
  let spy = null;

  beforeAll(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    resetWarned();
    spy.mockReset();
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it('warns on invalid value when labelInValue', () => {
    mount(<TreeSelect value="foo" labelInValue />);

    expect(spy).toHaveBeenCalledWith(
      'Warning: Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.',
    );
  });

  it('warns on invalid value when treeCheckable and treeCheckStrictly', () => {
    mount(<TreeSelect value="foo" treeCheckable treeCheckStrictly />);

    expect(spy).toHaveBeenCalledWith(
      'Warning: Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.',
    );
  });

  it('warns on invalid value when single', () => {
    mount(<TreeSelect value={[]} />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `value` should not be array when `TreeSelect` is single mode.',
    );
  });

  it('warns on invalid value when multiple', () => {
    mount(<TreeSelect multiple value="233" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `value` should be an array when `TreeSelect` is checkable or multiple.',
    );
  });

  it('treeCheckStrictly but not labelInValue', () => {
    mount(<TreeSelect treeCheckStrictly labelInValue={false} />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `treeCheckStrictly` will force set `labelInValue` to `true`.',
    );
  });

  it('documentClickClose should removed', () => {
    const wrapper = mount(
      <TreeSelect
        onDropdownVisibleChange={(_, { documentClickClose }) => {
          expect(documentClickClose).toBeFalsy();
        }}
      />,
    );

    wrapper.openSelect();

    expect(spy).toHaveBeenCalledWith(
      'Warning: Second param of `onDropdownVisibleChange` has been removed.',
    );
  });
});
