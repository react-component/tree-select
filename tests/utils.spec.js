import { isValueDisabled } from '../src/utils/valueUtil';
import { isDisabled } from '../src/hooks/useKeyValueMapping';

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

  it('isDisabled', () => {
    expect(isDisabled({ data: { disabled: true } }, 'select')).toBeTruthy();
    expect(
      isDisabled({ data: { disableCheckbox: true } }, 'select'),
    ).toBeFalsy();
    expect(isDisabled({ data: { disabled: true } }, 'checkbox')).toBeTruthy();
    expect(
      isDisabled({ data: { disableCheckbox: true } }, 'checkbox'),
    ).toBeTruthy();
    expect(isDisabled({ data: { disabled: true } }, null)).toBeFalsy();
  });
});
