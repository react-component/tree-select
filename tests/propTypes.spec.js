import React from 'react';
import { mount } from 'enzyme';
import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret';
import { valueProp } from '../src/propTypes';
import TreeSelect from '../src';

// React only console error once when the message is the same for the same propType.
// Use native Type to check the validate.
describe('TreeSelect.propTypes', () => {
  it('warns on invalid value when labelInValue', () => {
    const error = valueProp({
      labelInValue: true,
      value: 'foo',
    }, 'value', 'TreeSelect', '', '', ReactPropTypesSecret);
    expect(error.message).toBe(
      'Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string } or [{ label: string, value: string }] instead.'
    );
  });

  it('warns on invalid value when treeCheckable and treeCheckStrictly', () => {
    const error = valueProp({
      treeCheckable: true,
      treeCheckStrictly: true,
      value: 'foo',
    }, 'value', 'TreeSelect', '', '', ReactPropTypesSecret);
    expect(error.message).toBe(
      'Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string } or [{ label: string, value: string }] instead.'
    );
  });

  it('warns on invalid value when multiple', () => {
    mount(
      <TreeSelect
        multiple
        value=""
      />
    );

    const error = valueProp({
      multiple: true,
      value: '',
    }, 'value', 'TreeSelect', '', '', ReactPropTypesSecret);
    expect(error).toBeNull();
  });
});
