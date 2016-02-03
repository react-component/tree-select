/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-tree-select/assets/index.less';
import 'rc-tree-select/assets/demo.less';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import TreeSelect from 'rc-tree-select';
import {createForm} from 'rc-form';
import {regionStyle, errorStyle} from './styles';
import { gData } from './util';

class TreeSelectInput extends Component {
  onChange(value) {
    console.log(value, arguments);
    const props = this.props;
    if (props.onChange) {
      props.onChange(value);
    }
  }
  render() {
    return (
      <TreeSelect {...this.props} onChange={this.onChange.bind(this)} />
    );
  }
}

@createForm()
class Form extends Component {
  static propTypes = {
    form: PropTypes.object,
    value: PropTypes.array,
  };
  onSubmit = (e) => {
    console.log('submit');
    e.preventDefault();
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        console.log('ok', values);
      } else {
        console.log('error', error, values);
      }
    });
  };
  reset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  };
  render() {
    const {form} = this.props;
    const {getFieldProps, getFieldError} = form;
    const tProps = {
      multiple: true,
      value: this.props.value,
      treeData: gData,
      treeCheckable: true,
      treeDefaultExpandAll: true,
    };
    return (<div style={{margin: 20}}>
      <h2>validity</h2>
      <form onSubmit={this.onSubmit}>
        <div style={regionStyle}>
          <div>
            <p style={{color: 'blue'}}>no onChange</p>
            <TreeSelect style={{width: 300}} {...tProps}
              {...getFieldProps('tree-select', {
                initialValue: ['0-0-0-value'],
                rules: [
                  {required: true, type: 'array', message: 'tree-select 需要必填'},
                ],
              })} />
          </div>
          <p style={errorStyle}>
            {(getFieldError('tree-select')) ? getFieldError('tree-select').join(',') : null}
          </p>
        </div>

        <div style={regionStyle}>
          <div>
            <p style={{color: 'blue'}}>custom onChange</p>
            <TreeSelectInput style={{width: 300}} {...tProps}
              treeData={[{label: 'xx', value: 'xx', children: [{label: 'y', value: 'yy', children: []}]}]}
              {...getFieldProps('tree-select1', {
                initialValue: ['0-0-0-value'],
                rules: [
                  {required: true, type: 'array', message: 'tree-select1 需要必填'},
                ],
              })} />
          </div>
          <p style={errorStyle}>
            {(getFieldError('tree-select1')) ? getFieldError('tree-select1').join(',') : null}
          </p>
        </div>

        <div style={regionStyle}>
          <button onClick={this.reset}>reset</button>
          &nbsp;
          <input type="submit" value="submit"/>
        </div>
      </form>
    </div>);
  }
}

ReactDOM.render(<Form />, document.getElementById('__react-content'));
