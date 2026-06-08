import React from 'react';
import { render } from '@testing-library/react';
import { resetWarned } from '@rc-component/util';
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
    render(<TreeSelect value="foo" labelInValue />);

    expect(spy).toHaveBeenCalledWith(
      'Warning: Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.',
    );
  });

  it('warns on invalid value when treeCheckable and treeCheckStrictly', () => {
    render(<TreeSelect value="foo" treeCheckable treeCheckStrictly />);

    expect(spy).toHaveBeenCalledWith(
      'Warning: Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.',
    );
  });

  it('warns on invalid value when single', () => {
    render(<TreeSelect value={[]} />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `value` should not be array when `TreeSelect` is single mode.',
    );
  });

  it('warns on invalid value when multiple', () => {
    render(<TreeSelect multiple value="233" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `value` should be an array when `TreeSelect` is checkable or multiple.',
    );
  });

  it('treeCheckStrictly but not labelInValue', () => {
    render(<TreeSelect treeCheckStrictly labelInValue={false} />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `treeCheckStrictly` will force set `labelInValue` to `true`.',
    );
  });

  it('warns on using maxCount with showCheckedStrategy=SHOW_ALL when treeCheckStrictly=false', () => {
    render(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_ALL" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });

  it('warns on using maxCount with showCheckedStrategy=SHOW_PARENT', () => {
    render(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_PARENT" />);
    expect(spy).toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });

  it('does not warn on using maxCount with showCheckedStrategy=SHOW_ALL when treeCheckStrictly=true', () => {
    render(<TreeSelect maxCount={2} showCheckedStrategy="SHOW_ALL" treeCheckStrictly />);
    expect(spy).not.toHaveBeenCalledWith(
      'Warning: `maxCount` not work with `showCheckedStrategy=SHOW_ALL` (when `treeCheckStrictly=false`) or `showCheckedStrategy=SHOW_PARENT`.',
    );
  });
});
