import PropTypes from 'prop-types';

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
export function valueProp(props, propName, componentName) {

  if (props.treeCheckable && props.treeCheckStrictly) {
    genArrProps(PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.string,
    }))(props, propName, componentName);
  }

  if (props.labelInValue) {
    genArrProps(PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.string,
    }))(props, propName, componentName);
  }

  genArrProps(PropTypes.string)(props, propName, componentName);

  return null;
}
