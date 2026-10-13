import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import TreeSelect from '../src';

describe.each([false, true])('allowClear treeCheckable=%s', treeCheckable => {
  it('passes the complete configuration to Select and preserves clear callbacks', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const props = {
      treeCheckable,
      defaultValue: treeCheckable ? ['one'] : 'one',
      treeData: [{ value: 'one', title: 'One' }],
      onChange,
      onClear,
    };
    const config = { clearIcon: 'custom', label: 'Erase', tabIndex: -1 };
    const { container, getByRole, queryByRole, rerender } = render(
      <TreeSelect {...props} allowClear={false} />,
    );
    const markup = container.innerHTML;
    rerender(<TreeSelect {...props} allowClear={{ ...config, disabled: true }} />);
    expect(container.innerHTML).toBe(markup);
    expect(queryByRole('button', { name: 'Erase' })).toBeNull();
    expect(onClear).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    rerender(<TreeSelect {...props} allowClear={config} />);
    const button = getByRole('button', { name: 'Erase' });
    expect(button.tabIndex).toBe(-1);
    expect(button).toHaveTextContent('custom');
    rerender(<TreeSelect {...props} allowClear={{ ...config, tabIndex: 0 }} />);
    expect(getByRole('button', { name: 'Erase' }).tabIndex).toBe(0);
    fireEvent.click(getByRole('button', { name: 'Erase' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(treeCheckable ? [] : undefined);
    expect(queryByRole('button', { name: 'Erase' })).toBeNull();
  });
});
