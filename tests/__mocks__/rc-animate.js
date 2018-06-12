import { genAnimate } from 'rc-animate';
import { genAnimateChild } from 'rc-animate/lib/AnimateChild';

const AnimateChild = genAnimateChild(true);
export default genAnimate(AnimateChild);
