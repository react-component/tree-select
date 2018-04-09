import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import SelectTrigger from './SelectTrigger';
import SelectInput from './SelectInput';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    multiple: PropTypes.bool,
    treeCheckable: PropTypes.bool,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    // TODO: double confirm
  };

  state = {
    value: [],
  };

  // Tree checkable is also a multiple case
  isMultiple = () => {
    const { multiple, treeCheckable } = this.props;
    return !!(multiple || treeCheckable);
  };

  render() {
    const { value } = this.state;
    const isMultiple = this.isMultiple();
    const passProps = {
      ...this.props,
      isMultiple,
      value,
    };

    return (
      <SelectTrigger {...passProps}>
        <SelectInput {...passProps} />
      </SelectTrigger>
    );
  }
}

polyfill(Select);

export default Select;
