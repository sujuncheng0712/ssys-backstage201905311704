import React, { PureComponent } from 'react';
import { Card, Form, message, Input, Select, Button, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

const url = 'http://ssys.dochen.cn/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';

class AddEditProduct extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      N1: 1,
      N2: 2,
      N3: 3,
      N4: 1,
      N5: 5,
      S1: 180,
      S2: 180,
      S3: 180,
      S4: 180,
      S5: 720,
    };
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;

    const fieldLabels = {
      // 基础信息
      model: '型号',
      brand: '品牌',
      N1: '第一级滤芯',
      N2: '第二级滤芯',
      N3: '第三级滤芯',
      N4: '第四级滤芯',
      N5: '第五级滤芯',
      S1: '第一级滤芯寿命',
      S2: '第二级滤芯寿命',
      S3: '第三级滤芯寿命',
      S4: '第四级滤芯寿命',
      S5: '第五级滤芯寿命',
    };

    // 布局
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 } },
    };

    const submit = () => {
      validateFieldsAndScroll((error, values) => {
        if (this.state.N1 == 1) {
          values.N1 = 'L01';
        } else if (this.state.N1 == 2) {
          values.N1 = 'L02';
        } else if (this.state.N1 == 3) {
          values.N1 = 'L03';
        } else if (this.state.N1 == 4) {
          values.N1 = 'L04';
        } else if (this.state.N1 == 5) {
          values.N1 = 'L09';
        }

        if (this.state.N2 == 1) {
          values.N2 = 'L01';
        } else if (this.state.N2 == 2) {
          values.N2 = 'L02';
        } else if (this.state.N2 == 3) {
          values.N2 = 'L03';
        } else if (this.state.N2 == 4) {
          values.N2 = 'L04';
        } else if (this.state.N2 == 5) {
          values.N2 = 'L09';
        }

        if (this.state.N3 == 1) {
          values.N3 = 'L01';
        } else if (this.state.N3 == 2) {
          values.N3 = 'L02';
        } else if (this.state.N3 == 3) {
          values.N3 = 'L03';
        } else if (this.state.N3 == 4) {
          values.N3 = 'L04';
        } else if (this.state.N3 == 5) {
          values.N3 = 'L09';
        }

        if (this.state.N4 == 1) {
          values.N4 = 'L01';
        } else if (this.state.N4 == 2) {
          values.N4 = 'L02';
        } else if (this.state.N4 == 3) {
          values.N4 = 'L03';
        } else if (this.state.N4 == 4) {
          values.N4 = 'L04';
        } else if (this.state.N4 == 5) {
          values.N4 = 'L09';
        }

        if (this.state.N5 == 1) {
          values.N5 = 'L01';
        } else if (this.state.N5 == 2) {
          values.N5 = 'L02';
        } else if (this.state.N5 == 3) {
          values.N5 = 'L03';
        } else if (this.state.N5 == 4) {
          values.N5 = 'L04';
        } else if (this.state.N5 == 5) {
          values.N5 = 'L09';
        }

        values.S1 = this.state.S1;
        values.S2 = this.state.S2;
        values.S3 = this.state.S3;
        values.S4 = this.state.S4;
        values.S5 = this.state.S5;

        console.log(JSON.stringify(values));
        if (!error) {
          const submitUrl = `${url}/product/?(.*)`;
          fetch(submitUrl, {
            method: 'POST',
            headers: {
              vid: 'f024e5ceef9811e8b4ea00163e0e26fc',
            },
            body: JSON.stringify(values),
          }).then(res => {
            if (res.ok) {
              res.json().then(info => {
                if (info.status) {
                  message.success('添加产品成功');
                  location.hash = `/products/add-edit-product`;
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
      <PageHeaderLayout title="添加产品">
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

            <Form.Item label={fieldLabels.N1} {...formItemLayout}>
              {getFieldDecorator('N1', {})}
              <Select
                style={{ width: '50%' }}
                onChange={value => this.setState({ N1: value })}
                placeholder="请选择"
                defaultValue={'L01 PP棉滤芯'}
              >
                <Select.Option value="1">L01 PP棉滤芯</Select.Option>
                <Select.Option value="2">L02 前置活性炭滤芯</Select.Option>
                <Select.Option value="3">L03 后置活性炭滤芯</Select.Option>
                <Select.Option value="4">L04 小T33后置活性炭滤芯</Select.Option>
                <Select.Option value="5">L09 RO反渗透滤芯</Select.Option>
              </Select>
              <InputNumber
                min={0}
                max={1000}
                defaultValue={180}
                onChange={value => {
                  this.setState({ S1: value });
                }}
                style={{ width: '48.3%', marginLeft: '5px' }}
              />
            </Form.Item>

            <Form.Item label={fieldLabels.N2} {...formItemLayout}>
              {getFieldDecorator('N2', {})(<Input type="hidden" />)}
              <Select
                style={{ width: '50%' }}
                onChange={value => this.setState({ N2: value })}
                placeholder="请选择"
                defaultValue={'L02 前置活性炭滤芯'}
              >
                <Select.Option value="1">L01 PP棉滤芯</Select.Option>
                <Select.Option value="2">L02 前置活性炭滤芯</Select.Option>
                <Select.Option value="3">L03 后置活性炭滤芯</Select.Option>
                <Select.Option value="4">L04 小T33后置活性炭滤芯</Select.Option>
                <Select.Option value="5">L09 RO反渗透滤芯</Select.Option>
              </Select>
              <InputNumber
                min={0}
                max={1000}
                defaultValue={180}
                onChange={value => {
                  this.setState({ S2: value });
                }}
                style={{ width: '48.3%', marginLeft: '5px' }}
              />
            </Form.Item>

            <Form.Item label={fieldLabels.N3} {...formItemLayout}>
              {getFieldDecorator('N3', {})(<Input type="hidden" />)}
              <Select
                style={{ width: '50%' }}
                onChange={value => this.setState({ N3: value })}
                placeholder="请选择"
                defaultValue={'L03 后置活性炭滤芯'}
              >
                <Select.Option value="1">L01 PP棉滤芯</Select.Option>
                <Select.Option value="2">L02 前置活性炭滤芯</Select.Option>
                <Select.Option value="3">L03 后置活性炭滤芯</Select.Option>
                <Select.Option value="4">L04 小T33后置活性炭滤芯</Select.Option>
                <Select.Option value="5">L09 RO反渗透滤芯</Select.Option>
              </Select>
              <InputNumber
                min={0}
                max={1000}
                defaultValue={180}
                onChange={value => {
                  this.setState({ S3: value });
                }}
                style={{ width: '48.3%', marginLeft: '5px' }}
              />
            </Form.Item>

            <Form.Item label={fieldLabels.N4} {...formItemLayout}>
              {getFieldDecorator('N4', {})(<Input type="hidden" />)}
              <Select
                style={{ width: '50%' }}
                onChange={value => this.setState({ N4: value })}
                placeholder="请选择"
                defaultValue={'L01 PP棉滤芯'}
              >
                <Select.Option value="1">L01 PP棉滤芯</Select.Option>
                <Select.Option value="2">L02 前置活性炭滤芯</Select.Option>
                <Select.Option value="3">L03 后置活性炭滤芯</Select.Option>
                <Select.Option value="4">L04 小T33后置活性炭滤芯</Select.Option>
                <Select.Option value="5">L09 RO反渗透滤芯</Select.Option>
              </Select>
              <InputNumber
                min={0}
                max={1000}
                defaultValue={180}
                onChange={value => {
                  this.setState({ S4: value });
                }}
                style={{ width: '48.3%', marginLeft: '5px' }}
              />
            </Form.Item>

            <Form.Item label={fieldLabels.N5} {...formItemLayout}>
              {getFieldDecorator('N5', {})(<Input type="hidden" />)}
              <Select
                style={{ width: '50%' }}
                onChange={value => this.setState({ N5: value })}
                placeholder="请选择"
                defaultValue={'L09 RO反渗透滤芯'}
              >
                <Select.Option value="1">L01 PP棉滤芯</Select.Option>
                <Select.Option value="2">L02 前置活性炭滤芯</Select.Option>
                <Select.Option value="3">L03 后置活性炭滤芯</Select.Option>
                <Select.Option value="4">L04 小T33后置活性炭滤芯</Select.Option>
                <Select.Option value="5">L09 RO反渗透滤芯</Select.Option>
              </Select>
              <InputNumber
                min={0}
                max={1000}
                defaultValue={720}
                onChange={value => {
                  this.setState({ S5: value });
                }}
                style={{ width: '48.3%', marginLeft: '5px' }}
              />
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
}))(Form.create()(AddEditProduct));
