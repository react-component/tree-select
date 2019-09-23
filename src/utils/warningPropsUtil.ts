import React from 'react';
import warning, { noteOnce } from 'rc-util/lib/warning';
import { TreeSelectProps } from '../TreeSelect';

function warningProps(props: TreeSelectProps) {
  warning(!props.searchPlaceholder, '`searchPlaceholder` has been removed.');
}

export default warningProps;
