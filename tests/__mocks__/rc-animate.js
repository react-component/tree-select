import React from 'react';
import Animate, { genAnimate } from 'rc-animate/lib/Animate';
import { genAnimateChild } from 'rc-animate/lib/AnimateChild';

let mockTransition = false;

export function setMock(useTransitionMock) {
  mockTransition = useTransitionMock;
}

const MockAnimateChild = genAnimateChild(true);
const MockAnimate = genAnimate(MockAnimateChild);

export default (props) => (
  mockTransition ? <MockAnimate {...props} /> : <Animate {...props} />
);
