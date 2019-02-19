/* eslint react/no-multi-comp:0, no-console:0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TreeSelect from 'rc-tree-select';
import Select from 'rc-select';
import { createForm } from 'rc-form';
import 'rc-select/assets/index.css';
import 'rc-tree-select/assets/index.less';
import { regionStyle, errorStyle } from './styles';
import { gData } from './util';
import './demo.less';

const { Option } = Select;

class TreeSelectInput extends Component {
  onChange = (value, ...args) => {
    console.log(value, ...args);
    const props = this.props;
    if (props.onChange) {
      props.onChange(value);
    }
  };

  render() {
    return <TreeSelect {...this.props} onChange={this.onChange} />;
  }
}

// @createForm()
class Form extends Component {
  static propTypes = {
    form: PropTypes.object,
  };

  onSubmit = e => {
    const { form } = this.props;
    console.log('submit');
    e.preventDefault();
    form.validateFields((error, values) => {
      if (!error) {
        console.log('ok', values);
      } else {
        console.log('error', error, values);
      }
    });
  };

  reset = e => {
    const { form } = this.props;
    e.preventDefault();
    form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldError } = form;
    const tProps = {
      multiple: true,
      treeData: gData,
      treeCheckable: true,
      // treeDefaultExpandAll: true,
    };
    return (
      <div style={{ margin: 20 }}>
        <h2>validity</h2>
        <form onSubmit={this.onSubmit}>
          <div style={regionStyle}>
            <div>
              <p style={{ color: 'blue' }}>no onChange</p>
              {getFieldDecorator('tree-select', {
                initialValue: ['0-0-0-value'],
                rules: [{ required: true, type: 'array', message: 'tree-select 需要必填' }],
              })(<TreeSelect {...tProps} style={{ width: 300 }} />)}
            </div>
            <p style={errorStyle}>
              {getFieldError('tree-select') ? getFieldError('tree-select').join(',') : null}
            </p>
          </div>

          <div style={regionStyle}>
            <div>
              <p style={{ color: 'blue' }}>custom onChange</p>
              {getFieldDecorator('tree-select1', {
                initialValue: ['0-0-0-value'],
                rules: [{ required: true, type: 'array', message: 'tree-select1 需要必填' }],
              })(<TreeSelectInput {...tProps} style={{ width: 300 }} treeData={gData} />)}
            </div>
            <p style={errorStyle}>
              {getFieldError('tree-select1') ? getFieldError('tree-select1').join(',') : null}
            </p>
          </div>

          <div style={regionStyle}>
            {getFieldDecorator('select', {
              initialValue: 'jack',
              rules: [{ required: true, type: 'array', message: 'select 需要必填' }],
            })(
              <Select style={{ width: 200 }} allowClear multiple>
                <Option value="jack">jack</Option>
                <Option value="lucy">lucy</Option>
                <Option value="disabled" disabled>
                  disabled
                </Option>
                <Option value="yiminghe">yiminghe</Option>
              </Select>,
            )}
            <p style={errorStyle}>
              {getFieldError('select') ? getFieldError('select').join(',') : null}
            </p>
          </div>

          <div style={regionStyle}>
            <button type="button" onClick={this.reset}>
              reset
            </button>
            &nbsp;
            <input type="submit" value="submit" />
          </div>
        </form>
      </div>
    );
  }
}

// ReactDOM.render(<Form />, document.getElementById('__react-content'));
const NewForm = createForm()(Form);
ReactDOM.render(<NewForm />, document.getElementById('__react-content'));
