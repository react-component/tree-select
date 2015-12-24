// use jsx to render html, do not modify simple.html
import 'rc-select/assets/index.css';
import 'rc-tree/assets/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Select, {Option} from 'rc-select';
import Tree, {TreeNode} from 'rc-tree';
import { gData } from './util';

const Demo = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },
  componentDidMount() {
    console.log(this.refs);
    // this.setState({
    //   data: [1],
    // });
  },
  onChange(value) {
    console.log('change', value);
  },
  onSelect(value) {
    console.log('select ', value);
  },
  handleSelect(info) {
    console.log('selected: ', info);
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    const option = (<Option key={Date.now() + '1'}>
      <Tree defaultExpandAll={false}
            onSelect={this.handleSelect} multiple>
        {loop(gData)}
      </Tree>
    </Option>);
    return (<div>
      <p style={{color: 'red'}}> not work!</p>
      <Select
        ref="select"
        style={{width: 200}}
        combobox
        showSearch={false}
        defaultActiveFirstOption={false}
        notFoundContent=""
        onChange={this.onChange} onSelect={this.onSelect}>
        {this.state.data.length ? option : null}
      </Select>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
