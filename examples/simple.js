// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import TreeSelect from 'rc-tree-select';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<div style={{padding:'10px 30px'}}>
    <h3>simple content</h3>
    <TreeSelect trigger={['click']} overlay={<span>popup content</span>} animation="slide-up">
      <button style={{width:100}}>open</button>
    </TreeSelect>
  </div>, document.getElementById('__react-content'));
