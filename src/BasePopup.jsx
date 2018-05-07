import React from 'react';
// import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

export default function () {
  class BasePopup extends React.Component {
    placeholder = null; // TODO: Remove this

    render() {
      return (
        <h1>Nice Day</h1>
      );
    }
  }

  polyfill(BasePopup);

  return BasePopup;
}
