import PropTypes from 'prop-types';
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';

function nonEmptyStringType(props, propsName) {
  const value = props[propsName];
  if (typeof value !== 'string' || !value) {
    return new Error(); // Just a flag, so don't need message.
  }
}

function valueType(props, propName, componentName) {
  const labelInValueShape = PropTypes.shape({
    value: nonEmptyStringType,
    label: PropTypes.node,
  });
  if (props.labelInValue) {
    const validate = PropTypes.oneOfType([
      PropTypes.arrayOf(labelInValueShape),
      labelInValueShape,
    ]);
    const error = validate(...arguments);
    if (error) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`, ` +
        `when \`labelInValue\` is \`true\`, \`${propName}\` should in ` +
        `shape of \`{ value: string, label?: string }\`.`
      );
    }
  } else if (props.treeCheckable && props.treeCheckStrictly) {
    const validate = PropTypes.oneOfType([
      PropTypes.arrayOf(labelInValueShape),
      labelInValueShape,
    ]);
    const error = validate(...arguments);
    if (error) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`, ` +
        `when \`treeCheckable\` and \`treeCheckStrictly\` are \`true\`, ` +
        `\`${propName}\` should in shape of \`{ value: string, label?: string }\`.`
      );
    }
  } else if (props.multiple && props[propName] === '') {
    return new Error(
      `Invalid prop \`${propName}\` of type \`string\` supplied to \`${componentName}\`, ` +
      `expected \`array\` when \`multiple\` is \`true\`.`
    );
  } else {
    const validate = PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]);
    return validate(...arguments);
  }
}

export const SelectPropTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  multiple: PropTypes.bool,
  filterTreeNode: PropTypes.any,
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  showArrow: PropTypes.bool,
  allowClear: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  transitionName: PropTypes.string,
  animation: PropTypes.string,
  choiceTransitionName: PropTypes.string,
  onBeforeSelect: PropTypes.func,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  placeholder: PropTypes.any,
  inputValue: PropTypes.any,
  value: valueType,
  defaultValue: valueType,
  label: PropTypes.node,
  defaultLabel: PropTypes.any,
  labelInValue: PropTypes.bool,
  dropdownStyle: PropTypes.object,
  dropdownPopupAlign: PropTypes.object,
  onDropdownVisibleChange: PropTypes.func,
  maxTagTextLength: PropTypes.number,
  showCheckedStrategy: PropTypes.oneOf([
    SHOW_ALL, SHOW_PARENT, SHOW_CHILD,
  ]),
  treeCheckStrictly: PropTypes.bool,
  treeIcon: PropTypes.bool,
  treeLine: PropTypes.bool,
  treeDefaultExpandAll: PropTypes.bool,
  treeCheckable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]),
  treeNodeLabelProp: PropTypes.string,
  treeNodeFilterProp: PropTypes.string,
  treeData: PropTypes.array,
  treeDataSimpleMode: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  loadData: PropTypes.func,
};
