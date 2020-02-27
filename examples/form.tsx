import React, { Component } from 'react';
import Select from 'rc-select';
import Form, { useForm, Field } from 'rc-field-form';
import TreeSelect from '../src';
import 'rc-select/assets/index.less';
import '../assets/index.less';
import { gData } from './utils/dataUtil';

const { Option } = Select;

const regionStyle = {
  border: '1px solid red',
  marginTop: 10,
  padding: 10,
};

const errorStyle = {
  color: 'red',
  marginTop: 10,
  padding: 10,
};

class TreeSelectInput extends Component<{
  onChange?: Function;
  style: React.CSSProperties;
}> {
  onChange = (value, ...args) => {
    console.log(value, ...args);
    const { props } = this;
    if (props.onChange) {
      props.onChange(value);
    }
  };

  render() {
    return <TreeSelect {...this.props} onChange={this.onChange} />;
  }
}

const Demo = () => {
  const [form] = useForm();

  const onFinish = values => {
    console.log('Submit:', values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const tProps = {
    multiple: true,
    treeData: gData,
    treeCheckable: true,
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>validity</h2>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          'tree-select': ['0-0-0-value'],
          'tree-select1': ['0-0-0-value'],
          select: ['jack'],
        }}
      >
        <div style={regionStyle}>
          <div>
            <p style={{ color: 'blue' }}>no onChange</p>
            <Field
              name="tree-select"
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: 'tree-select 需要必填',
                },
              ]}
            >
              {(control, { errors }) => (
                <div>
                  <TreeSelect {...tProps} {...control} style={{ width: 300 }} />

                  <p style={errorStyle}>{errors.join(',')}</p>
                </div>
              )}
            </Field>
          </div>
        </div>

        <div style={regionStyle}>
          <div>
            <p style={{ color: 'blue' }}>custom onChange</p>
            <Field
              name="tree-select1"
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: 'tree-select1 需要必填',
                },
              ]}
            >
              {(control, { errors }) => (
                <div>
                  <TreeSelectInput
                    {...tProps}
                    {...control}
                    style={{ width: 300 }}
                  />

                  <p style={errorStyle}>{errors.join(',')}</p>
                </div>
              )}
            </Field>
          </div>
        </div>

        <div style={regionStyle}>
          <div>
            <Field
              name="select"
              rules={[
                { required: true, type: 'array', message: 'select 需要必填' },
              ]}
            >
              {(control, { errors }) => (
                <div>
                  <Select
                    style={{ width: 200 }}
                    {...control}
                    allowClear
                    mode="multiple"
                  >
                    <Option value="jack">jack</Option>
                    <Option value="lucy">lucy</Option>
                    <Option value="disabled" disabled>
                      disabled
                    </Option>
                    <Option value="yiminghe">yiminghe</Option>
                  </Select>

                  <p style={errorStyle}>{errors.join(',')}</p>
                </div>
              )}
            </Field>
          </div>
        </div>

        <div style={regionStyle}>
          <button type="button" onClick={onReset}>
            reset
          </button>
          &nbsp;
          <input type="submit" value="submit" />
        </div>
      </Form>
    </div>
  );
};

export default Demo;
