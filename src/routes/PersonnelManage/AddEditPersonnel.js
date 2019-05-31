/* eslint-disable react/no-array-index-key,no-param-reassign,radix */
import React, { PureComponent } from 'react';
import { Card, Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const url = 'http://ssys.dochen.cn/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';

class AddEditPersonnel extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      personnelInfo: {},
      lists: [],
      type: '', // 1:安装工，2:财务
      mobile: '',
      mid: '',
    };
  }

  componentDidMount() {
    this.getPersonnelInfo();
    this.getMerchantsList();
  }

  // 获取员工信息
  getPersonnelInfo() {
    const { location: { search } } = this.props;
    const pid = search.slice(1).split('=')[1];
    const infoUrl = `${url}/personnel/${pid}`;
    fetch(infoUrl, {
      // 判断是管理员登录还是商家登录
      headers: auth.permission
        ? {
            vid: auth.uuid,
          }
        : {
            mid: auth.uuid,
          },
    }).then(res => {
      if (res.status) {
        res.json().then(info => {
          if (info.status) this.setState({ personnelInfo: info.data, type: info.data.type });
        });
      }
    });
  }

  // 获取商家列表
  getMerchantsList() {
    const getMerchants = `${url}/merchants`;
    fetch(getMerchants, {
      headers: {
        vid: auth.uuid,
      },
    }).then(res => {
      if (res.ok) {
        res.json().then(info => {
          if (info.status) this.setState({ lists: info.data });
        });
      }
    });
  }

  render() {
    const { form, location: { search } } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { personnelInfo, lists, type, mobile, mid } = this.state;
    const merchantsList = [];
    lists.forEach(val => {
      if (val.type === 2 || val.type === 3)
        merchantsList.push(
          <Select.Option key={val.uuid}>
            {val.contact}（{val.area}）
          </Select.Option>
        );
    });

    // 布局
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 } },
    };

    // 输入框
    const fieldLabels = {
      // 基础信息
      type: '类型',
      name: '姓名',
      mobile: '手机号',
      username: '手机号',
      password: '初始密码',
      mid: '所属商家',
    };

    // 需要编辑员工的uuid
    const pid = search.slice(1).split('=')[1];

    // 请求添加或修改商家
    const addOrEdit = () => {
      validateFieldsAndScroll((error, values) => {
        values.type = parseInt(values.type);
        values.mid = values.mid || auth.uuid;
        console.log(values);
        if (!error) {
          let postPersonnel = `${url}/personnel`;
          postPersonnel += pid ? `/${pid}` : '';
          fetch(postPersonnel, {
            method: pid ? `PUT` : `POST`,
            body: JSON.stringify(values),
            // 判断是管理员登录还是商家登录
            headers: auth.permission
              ? {
                  vid: auth.uuid,
                }
              : {
                  mid: auth.uuid,
                },
          }).then(res => {
            if (res.ok) {
              console.log(res);
              res.json().then(info => {
                console.log(info);
                if (info.status) location.hash = `/personnel/personnel-list`;
              });
            }
          });
        }
      });
    };

    return (
      <PageHeaderLayout title={`${pid ? '修改' : '添加'}员工`}>
        <Card bordered={false}>
          <Form>
            {pid ? (
              personnelInfo.type ? (
                <Form.Item label={fieldLabels.type} {...formItemLayout}>
                  {getFieldDecorator('type', {
                    initialValue: personnelInfo.type.toString(),
                    rules: [{ required: true, message: '商家类型必须选择' }],
                  })(<Input type="hidden" />)}
                  <Select
                    style={{ width: '100%' }}
                    onChange={value => this.setState({ type: value })}
                    placeholder="请选择"
                    optionFilterProp="children"
                    defaultValue={personnelInfo.type.toString()}
                  >
                    <Select.Option value="1">安装工</Select.Option>
                    {/* <Select.Option value="2">财务</Select.Option> */}
                  </Select>
                </Form.Item>
              ) : (
                ''
              )
            ) : (
              <Form.Item label={fieldLabels.type} {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: type,
                  rules: [{ required: true, message: '商家类型必须选择' }],
                })(<Input type="hidden" />)}
                <Select
                  style={{ width: '100%' }}
                  onChange={value => this.setState({ type: value })}
                  placeholder="请选择"
                  optionFilterProp="children"
                  //defaultValue="安装工"
                >
                  <Select.Option value="1">安装工</Select.Option>
                  {/* <Select.Option value="2">财务</Select.Option> */}
                </Select>
              </Form.Item>
            )}
            {auth.type ? (
              ''
            ) : pid ? (
              personnelInfo.mid ? (
                <Form.Item label={fieldLabels.mid} {...formItemLayout}>
                  {getFieldDecorator('mid', {
                    initialValue: personnelInfo.mid || mid,
                    rules: [{ required: true, message: '必须选择所属代理/经销商' }],
                  })(<Input type="hidden" />)}
                  <Select
                    style={{ width: '100%' }}
                    onChange={value => this.setState({ mid: value })}
                    placeholder="请选择所属代理商或经销商"
                    defaultValue={personnelInfo.mid || mid}
                    disabled
                  >
                    {merchantsList}
                  </Select>
                </Form.Item>
              ) : (
                ''
              )
            ) : (
              <Form.Item label={fieldLabels.mid} {...formItemLayout}>
                {getFieldDecorator('mid', {
                  initialValue: mid,
                  rules: [{ required: true, message: '必须选择所属代理/经销商' }],
                })(<Input type="hidden" />)}
                <Select
                  style={{ width: '100%' }}
                  onChange={value => this.setState({ mid: value })}
                  placeholder="请选择所属代理商或经销商"
                  optionFilterProp="children"
                >
                  {merchantsList}
                </Select>
              </Form.Item>
            )}
            <Form.Item label={fieldLabels.name} {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: personnelInfo.name,
                rules: [{ required: true, message: '姓名必须填写' }],
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            {/*<Form.Item label={fieldLabels.mobile} {...formItemLayout}>*/}
            {/*{getFieldDecorator('mobile', {*/}
            {/*initialValue: personnelInfo.mobile,*/}
            {/*rules: [*/}
            {/*{ required: true, message: '手机号码必须输入' },*/}
            {/*{ pattern: /^1\d{10}$/, message: '手机号格式错误！' },*/}
            {/*],*/}
            {/*})(*/}
            {/*<Input*/}
            {/*maxLength={11}*/}
            {/*placeholder="请输入手机号码"*/}
            {/*onChange={e => this.setState({ mobile: e.target.value })}*/}
            {/*/>*/}
            {/*)}*/}
            {/*</Form.Item>*/}
            {pid ? (
              <Form.Item label={fieldLabels.username} {...formItemLayout}>
                {getFieldDecorator('username', {
                  initialValue: personnelInfo.username || mobile,
                  rules: [
                    { required: true, message: '用户名必须填写' },
                    { pattern: /^1\d{10}$/, message: '用户名必须为有效的手机号！' },
                  ],
                })(<Input maxLength={11} placeholder="用户名必须是有效的手机号" disabled />)}
              </Form.Item>
            ) : (
              <Form.Item label={fieldLabels.username} {...formItemLayout}>
                {getFieldDecorator('username', {
                  initialValue: personnelInfo.username || mobile,
                  rules: [
                    { required: true, message: '用户名必须填写' },
                    { pattern: /^1\d{10}$/, message: '用户名必须为有效的手机号！' },
                  ],
                })(<Input maxLength={11} placeholder="用户名必须是有效的手机号" />)}
              </Form.Item>
            )}
            <Form.Item label={fieldLabels.password} {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue: '0123456789',
              })(<Input disabled />)}
            </Form.Item>
          </Form>
        </Card>
        <br />
        <div style={{ display: `flex`, alignItems: `center`, flexDirection: `row-reverse` }}>
          <Button type="primary" onClick={addOrEdit}>
            提交资料
          </Button>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(AddEditPersonnel));
