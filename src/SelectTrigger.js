import React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';

class SelectTrigger extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

polyfill(SelectTrigger);

export default SelectTrigger;
