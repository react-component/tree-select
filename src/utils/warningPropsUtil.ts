import React from 'react';
import warning, { noteOnce } from 'rc-util/lib/warning';
import { TreeSelectProps } from '../TreeSelect';

function warningProps(props: TreeSelectProps) {
  const { searchPlaceholder, treeCheckStrictly, labelInValue } = props;
  warning(!searchPlaceholder, '`searchPlaceholder` has been removed.');
  if (treeCheckStrictly && labelInValue === false) {
    warning(false, '`treeCheckStrictly` will force set `labelInValue` to `true`');
  }
}

export default warningProps;
