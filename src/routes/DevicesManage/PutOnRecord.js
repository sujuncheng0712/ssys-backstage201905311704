/* eslint-disable no-param-reassign,no-plusplus */
import React, { PureComponent } from 'react';
import { Card, Button, Form, Input, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const url = 'http://ssys.dochen.cn/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';

class PutOnRecord extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;

    // 布局
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 } },
    };

    // 输入框
    const fieldLabels = {
      // 基础信息
      model: '型号',
      brand: '品牌',
      version: '版本号',
      eids: '设备ID',
    };

    const submit = () => {
      validateFieldsAndScroll((error, values) => {
        values.eids = values.eids.split(/\s*,\s*/);
        if (!error) {
          const submitUrl = `${url}/equipment`;
          fetch(submitUrl, {
            method: 'POST',
            headers: {
              vid: auth.uuid,
            },
            body: JSON.stringify(values),
          }).then(res => {
            if (res.ok) {
              res.json().then(info => {
                if (info.status) {
                  message.success('备案成功');
                  location.hash = `/devices/devices-list`;
                } else {
                  message.warning(`提示：[${info.message}]`);
                }
              });
            }
          });
        }
      });
    };

    return (
      <PageHeaderLayout title="ID备案">
        <Card bordered={false}>
          <Form>
            <Form.Item label={fieldLabels.model} {...formItemLayout}>
              {getFieldDecorator('model', {
                rules: [{ required: true, message: '必须输入设备型号' }],
              })(<Input placeholder="请输入设备型号" />)}
            </Form.Item>
            <Form.Item label={fieldLabels.brand} {...formItemLayout}>
              {getFieldDecorator('brand', {
                rules: [{ required: true, message: '必须输入品牌' }],
              })(<Input placeholder="请输入品牌" />)}
            </Form.Item>
            {/*<Form.Item label={fieldLabels.version} {...formItemLayout}>
              {getFieldDecorator('version', {
                rules: [{required: true, message: '必须输入版本号'}],
              })(<Input placeholder='请输入版本号' />)}
            </Form.Item>*/}
            <Form.Item label={fieldLabels.eids} {...formItemLayout}>
              {getFieldDecorator('eids', {
                rules: [{ required: true, message: '必须输入设备ID' }],
              })(
                <Input.TextArea
                  autosize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入设备ID，若需输入多个ID，请以 ' , ' 隔开"
                  style={{ resize: 'none' }}
                />
              )}
            </Form.Item>
          </Form>
        </Card>
        <br />
        <div style={{ display: `flex`, alignItems: `center`, flexDirection: `row-reverse` }}>
          <Button type="primary" onClick={submit}>
            提交
          </Button>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(PutOnRecord));
