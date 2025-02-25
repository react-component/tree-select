import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from '@rc-component/util/lib/warning';
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

  it('warns on using maxCount with showCheckedStrategy=SHOW_ALL when treeCheckStrictly=false', () => {
    mount(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_ALL" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });

  it('warns on using maxCount with showCheckedStrategy=SHOW_PARENT', () => {
    mount(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_PARENT" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });

  it('does not warn on using maxCount with showCheckedStrategy=SHOW_ALL when treeCheckStrictly=true', () => {
    mount(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_ALL" treeCheckStrictly />);
    expect(spy).not.toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });
});
