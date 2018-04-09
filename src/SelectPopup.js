import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

/**
 * Provide popup tree view
 */
class SelectPopup extends React.Component {
  static propTypes = {
    // Pass by Select
    isMultiple: PropTypes.bool,
    dropdownPrefixCls: PropTypes.string,
    showSearch: PropTypes.bool,
  };

  renderSearch = () => {
    const { isMultiple, showSearch, dropdownPrefixCls } = this.props;

    if (isMultiple || !showSearch) {
      return null;
    }

    // TODO: render input
    return (
      <span className={`${dropdownPrefixCls}-search`}>
      </span>
    );
  };

  render() {
    // const popupElement = (
    //   <div>
    //     {search}
    //     {notFoundContent || this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)}
    //   </div>
    // );

    return (
      <div>
        {this.renderSearch()}
      </div>
    );
  }
}

polyfill(SelectPopup);

export default SelectPopup;
