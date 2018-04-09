import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import SelectTrigger from './SelectTrigger';
import SelectInput from './SelectInput';

class Select extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'rc-tree-select',
    // TODO: double confirm
  };

  render() {
    return (
      <SelectTrigger {...this.props}>
        <SelectInput {...this.props} />
      </SelectTrigger>
    );
  }
}

polyfill(Select);

export default Select;
