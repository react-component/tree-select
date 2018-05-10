import PropTypes from 'prop-types';
import { isLabelInValue } from './util';

export function genArrProps(propType) {
  return PropTypes.oneOfType([
    propType,
    PropTypes.arrayOf(propType),
  ]);
}

/**
 * Origin code check `multiple` is true when `treeCheckStrictly` & `labelInValue`.
 * But in process logic is already cover to array.
 * Check array is not necessary. Let's simplify this check logic.
 */
export function valueProp(...args) {
  const [props] = args;

  if (isLabelInValue(props)) {
    return genArrProps(PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.string,
    }))(...args);
  }

  return genArrProps(PropTypes.string)(...args);
}
