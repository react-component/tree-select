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
    searchPlaceholder: PropTypes.string,
    onPlaceholderClick: PropTypes.func,
  };

  renderPlaceholder = () => {
    const { valueList, searchPlaceholder, prefixCls, onPlaceholderClick } = this.props;

    if (!searchPlaceholder) return null;

    const hasValue = !!valueList.length;

    return (
      <span
        style={{ display: hasValue ? 'none' : 'block' }}
        onClick={onPlaceholderClick}
        className={`${prefixCls}-search__field__placeholder`}
      >
        {searchPlaceholder}
      </span>
    );
  };

  renderSearch = () => {
    const { showSearch, dropdownPrefixCls } = this.props;

    if (!showSearch) {
      return null;
    }

    return (
      <span className={`${dropdownPrefixCls}-search`}>
        <SearchInput
          {...this.props}
          renderPlaceholder={this.renderPlaceholder}
        />
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