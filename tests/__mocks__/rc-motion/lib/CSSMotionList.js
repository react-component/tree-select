import React from 'react';
import { genCSSMotion } from 'rc-motion/lib/CSSMotion';
import CSSMotionList, { genCSSMotionList } from 'rc-motion/lib/CSSMotionList';

let mock = false;

export function setMock(useMotionMock) {
  mock = useMotionMock;
}

const MockCSSMotion = genCSSMotion(true);
const MockCSSMotionList = genCSSMotionList(true, MockCSSMotion);

export default props => {
  const Component = mock ? MockCSSMotionList : CSSMotionList;
  return <Component {...props} />;
};
