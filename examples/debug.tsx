/* eslint-disable react/no-array-index-key */

import React from 'react';
import TreeSelect from '../src';
import '../assets/index.less';

export default () => {
  const [treeData, setTreeData] = React.useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      console.clear();
      setTreeData([{ value: 'light', title: 'bamboo' }]);
    }, 1000);
  }, []);

  return <TreeSelect value="light" treeData={treeData} />;
};
