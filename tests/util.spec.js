import { findPopupContainer } from '../src/util';

describe('util', () => {
  it('should stop loop if get null', () => {
    const node = {
      parentNode: {
        parentNode: {},
      },
    };
    expect(findPopupContainer(node, 'not-exist')).toBe(null);
  });
});
