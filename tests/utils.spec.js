import { isValueDisabled } from '../src/utils/valueUtil';

describe('TreeSelect.util', () => {
  it('isValueDisabled', () => {
    const options = [
      { data: { value: 'disabled', disabled: true } },
      { data: { value: 'pass' } },
    ];
    expect(isValueDisabled('disabled', options)).toBeTruthy();
    expect(isValueDisabled('pass', options)).toBeFalsy();
    expect(isValueDisabled('not-exist', options)).toBeFalsy();
  });
});
