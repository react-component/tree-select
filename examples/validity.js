// use jsx to render html, do not modify simple.html

import 'rc-tree-select/assets/index.less';
import 'rc-tree-select/assets/demo.less';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import {createForm} from 'rc-form';
import {regionStyle, errorStyle} from './styles';
import { gData } from './util';

const Demo = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  onSelect(selectedValue, info) {
    console.log('onSelect: ', selectedValue, info);
    let newVal = [...this.props.value];

    function setNewVal(i) {
      let index = i;
      if (index > -1) {
        index = newVal.indexOf(info.node.props.value);
        if (index > -1) {
          newVal.splice(index, 1);
        }
      } else if (index === -1) {
        newVal.push(info.node.props.value);
      }
    }

    function getNode(arr, val) {
      let node;
      return arr.some(item => {
        if (item.key === val) {
          node = item.node;
          return true;
        }
      }) && node;
    }

    if (info.event === 'select') {
      setNewVal(info.selectedKeys.indexOf(info.node.props.eventKey));
    } else if (info.event === 'check') {
      newVal = [];
      info.filterAllCheckedKeys.forEach((item) => {
        const node = getNode(info.allCheckedNodesKeys, item);
        if (node) {
          newVal.push(node.props.value);
        } else if (info.node.props.eventKey === item) {
          newVal.push(info.node.props.value);
        }
      });
    }
    this.props.onChange(newVal);
  },
  onChange(value, label) {
    console.log('onChange ', value, label);
  },
  render() {
    const props = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = props.form;
    const errors = getFieldError('treeselect');

    const tProps = {
      // defaultValue: this.props.value,
      value: this.props.value,
      onChange: this.onChange,
      onSelect: this.onSelect,
      multiple: true,
      treeCheckable: true,
      treeDefaultExpandAll: true,
      // treeNodeLabelProp: 'title',
    };
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} value={item.key} title={item.key + ' label'}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} value={item.key} title={item.key + ' label'} />;
      });
    };
    return (<div style={regionStyle}>
      <div>
        <p style={{color: 'blue'}}>not work rightly</p>
        <TreeSelect style={{width: 200}} {...tProps} {...getFieldProps('treeselect', {
          validateTrigger: 'onSelect',
          trigger: 'onSelect',
          initialValue: this.props.value,
          rules: [
            {required: true, type: 'array'},
          ],
        })}>
          {loop(gData)}
        </TreeSelect>
      </div>
      <p style={errorStyle}>
        {(errors) ? errors.join(',') : null}
      </p>
      <p style={errorStyle}>
        {isFieldValidating('treeselect') ? 'validating' : null}
      </p>
    </div>);
  },
});

const Demo1 = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  onSelect(selectedValue, info) {
    console.log('onSelect: ', selectedValue, info);
    let newVal = [...this.props.value];

    function setNewVal(i) {
      let index = i;
      if (index > -1) {
        index = newVal.indexOf(info.node.props.value);
        if (index > -1) {
          newVal.splice(index, 1);
        }
      } else if (index === -1) {
        newVal.push(info.node.props.value);
      }
    }

    function getNode(arr, val) {
      let node;
      return arr.some(item => {
        if (item.key === val) {
          node = item.node;
          return true;
        }
      }) && node;
    }

    if (info.event === 'select') {
      setNewVal(info.selectedKeys.indexOf(info.node.props.eventKey));
    } else if (info.event === 'check') {
      newVal = [];
      info.filterAllCheckedKeys.forEach((item) => {
        const node = getNode(info.allCheckedNodesKeys, item);
        if (node) {
          newVal.push(node.props.value);
        } else if (info.node.props.eventKey === item) {
          newVal.push(info.node.props.value);
        }
      });
    }
    this.props.onChange(newVal);
  },
  render() {
    const tProps = {
      // defaultValue: this.props.value,
      value: this.props.value,
      // onChange: this.onChange,
      onSelect: this.onSelect,
      multiple: true,
      treeCheckable: true,
      treeDefaultExpandAll: true,
      // treeNodeLabelProp: 'title',
    };
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} value={item.key} title={item.key + ' label'}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} value={item.key} title={item.key + ' label'} />;
      });
    };
    return (
        <TreeSelect style={{width: 200}} {...tProps}>
          {loop(gData)}
        </TreeSelect>
      );
  },
});

@createForm({
  // mapPropsToFields(props) {
  //   console.log('mapPropsToFields', props);
  //   return props.formState;
  // },
  onFieldsChange(props, fields) {
    console.log('onFieldsChange', fields);
  },
})
class Form extends Component {
  static propTypes = {
    form: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ['0-0-0'],
      initialValue: ['0-0-0'],
    };
  }

  onChange(newVal) {
    console.log('newVal', newVal);
    this.setState({
      value: newVal,
    });
  }

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
    const {getFieldProps, getFieldError, isFieldValidating} = form;
    const errors = getFieldError('treeselect1');
    return (<div style={{margin: 20}}>
      <h2>validity</h2>
      <form onSubmit={this.onSubmit}>
        <div style={regionStyle}>
          <p>normal input, no validate</p>
          <p>
            <input {...getFieldProps('normal')}/>
          </p>
        </div>

        <Demo form={form} value={this.state.value} onChange={this.onChange.bind(this)} />

        <div style={regionStyle}>
          <div>
            <p style={{color: 'blue'}}>work rightly</p>
            <Demo1 form={form} value={this.state.value} {...getFieldProps('treeselect1', {
              initialValue: this.state.value,
              rules: [
                {required: true, type: 'array'},
              ],
            })} />
          </div>
          <p style={errorStyle}>
            {(errors) ? errors.join(',') : null}
          </p>
          <p style={errorStyle}>
            {isFieldValidating('treeselect1') ? 'validating' : null}
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
