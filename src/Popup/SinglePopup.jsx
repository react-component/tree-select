import React from 'react';
import PropTypes from 'prop-types';
import BasePopup from '../Base/BasePopup';
import SearchInput from '../SearchInput';

class SinglePopup extends React.Component {
  static propTypes = {
    ...BasePopup.propTypes,
    searchValue: PropTypes.string,
    showSearch: PropTypes.bool,
    dropdownPrefixCls: PropTypes.string,
    disabled: PropTypes.bool,
  };

  renderSearch = () => {
    const { showSearch, dropdownPrefixCls } = this.props;

    if (!showSearch) {
      return null;
    }

    return (
      <span className={`${dropdownPrefixCls}-search`}>
        <SearchInput {...this.props} />
      </span>
    );
  };

  render() {
    return (
      <BasePopup
        {...this.props}

        renderSearch={this.renderSearch}
      />
    );
  }
}

export default SinglePopup;
