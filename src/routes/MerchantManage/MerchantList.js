/* eslint-disable no-param-reassign,no-plusplus */
import React, { PureComponent } from 'react';
import { Button, Col, Icon, Input, message, Row, Table, Tabs } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const url = 'http://ssys.dochen.cn/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';
const authority = localStorage.getItem('antd-pro-authority');

class MerchantList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      merchant1: [], // 运营商
      merchant2: [], // 代理商
      merchant3: [], // 经销商
      m1: '', // 搜索输入的运营商值
      m2: '', // 搜索输入的代理商值
      m3: '', // 搜索输入的经销商值
    };
  }

  componentWillMount() {
    this.getMerchantsList();
  }

  getMerchantsList() {
    const getMerchantsUrl = `${url}/merchants`;
    fetch(getMerchantsUrl, {
      // auth.type 存在，表示是商家登录，否则是管理员登录
      headers: auth.type
        ? {
            mid: auth.uuid,
          }
        : {
            vid: auth.uuid,
          },
    }).then(res => {
      if (res.ok) {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            const merchant1 = [];
            const merchant2 = [];
            const merchant3 = [];
            info.data.forEach(val => {
              if (val.type === 1 && val.state === 1) merchant1.push(val);
              if (val.type === 2 && val.state === 1) merchant2.push(val);
              if (val.type === 3 && val.state === 1) merchant3.push(val);
            });
            this.setState({ merchant1, merchant2, merchant3, loading: false });
          } else {
            message.warning(`提示：[${info.message}]`);
            this.setState({ loading: false });
          }
        });
      }
    });
  }

  // 获取搜索列表
  searchList() {
    const { merchant1, merchant2, merchant3, m1, m2, m3 } = this.state;
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    merchant1.forEach(val => {
      if (val.contact === m1) arr1.push(val);
    });
    merchant2.forEach(val => {
      if (val.contact === m2) arr2.push(val);
    });
    merchant3.forEach(val => {
      if (val.contact === m3) arr3.push(val);
    });

    if (arr1.length === 0 && arr2.length === 0 && arr3.length === 0)
      message.error('没找到对应的数据');

    this.setState({
      merchant1: arr1.length > 0 ? arr1 : merchant1,
      merchant2: arr2.length > 0 ? arr2 : merchant2,
      merchant3: arr3.length > 0 ? arr3 : merchant3,
    });
  }

  render() {
    const { merchant1, merchant2, merchant3, loading } = this.state;
    // 给各级商家列表添加序号
    merchant1.forEach((item, index) => {
      item.key = index + 1;
    });
    merchant2.forEach((item, index) => {
      item.key = index + 1;
    });
    merchant3.forEach((item, index) => {
      item.key = index + 1;
    });

    const columns1 = [
      { title: '序号', dataIndex: 'key', key: 'id', align: 'center' },
      { title: '录入时间', dataIndex: 'created_at', key: 'created_at', align: 'center' },
      { title: '单位名称', dataIndex: 'organization', key: 'organization', align: 'center' },
      { title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center' },
      { title: '联系人电话', dataIndex: 'mobile', key: 'mobile', align: 'center' },
      { title: '所在区域', dataIndex: 'area', key: 'area', align: 'center' },
      {
        title: '操作',
        dataIndex: 'uuid',
        key: 'uuid',
        align: 'center',
        render: (val, infos) => (
          <Button.Group size="small">
            {/* <Button
              onClick={() => {
                location.hash = ``;
              }}
            >
              详情
            </Button> */}
            <Button
              hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
              onClick={() => {
                location.hash = `/merchant/add-edit-merchant/?mid=${val}`;
              }}
            >
              编辑
            </Button>
            {infos.state !== 0 ? (
              <Button
                hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                onClick={() => {
                  const delMerchants = `${url}/merchants/${val}`;
                  fetch(delMerchants, {
                    method: 'DELETE',
                  }).then(res => {
                    if (res.ok)
                      res.json().then(info => {
                        if (info.status) this.getMerchantsList();
                      });
                  });
                }}
              >
                注销
              </Button>
            ) : (
              ''
            )}
          </Button.Group>
        ),
      },
    ];

    const columns2 = [
      { title: '序号', dataIndex: 'key', key: 'id', align: 'center' },
      { title: '录入时间', dataIndex: 'created_at', key: 'created_at', align: 'center' },
      { title: '所属运营商', dataIndex: 'm1name', key: 'm1name', align: 'center' },
      { title: '单位名称', dataIndex: 'organization', key: 'organization', align: 'center' },
      { title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center' },
      { title: '联系人电话', dataIndex: 'mobile', key: 'mobile', align: 'center' },
      { title: '所在区域', dataIndex: 'area', key: 'area', align: 'center' },
      localStorage.getItem('antd-pro-authority') === 'vendors'
        ? {
            title: '操作',
            dataIndex: 'uuid',
            key: 'uuid',
            align: 'center',
            render: (val, infos) => (
              <Button.Group size="small">
                {/* <Button
              onClick={() => {
                location.hash = ``;
              }}
            >
              详情
            </Button> */}
                <Button
                  // hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                  onClick={() => {
                    location.hash = `/merchant/add-edit-merchant/?mid=${val}`;
                  }}
                >
                  编辑
                </Button>
                {infos.state !== 0 ? (
                  <Button
                    // hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                    onClick={() => {
                      const delMerchants = `${url}/merchants/${val}`;
                      fetch(delMerchants, {
                        method: 'DELETE',
                      }).then(res => {
                        if (res.ok)
                          res.json().then(info => {
                            if (info.status) this.getMerchantsList();
                          });
                      });
                    }}
                  >
                    注销
                  </Button>
                ) : (
                  ''
                )}
              </Button.Group>
            ),
          }
        : {},
    ];

    const columns3 = [
      { title: '序号', dataIndex: 'key', key: 'id', align: 'center' },
      { title: '录入时间', dataIndex: 'created_at', key: 'created_at', align: 'center' },
      { title: '所属品牌商', dataIndex: 'm1name', key: 'm1name', align: 'center' },
      { title: '所属运营商', dataIndex: 'm2name', key: 'm2name', align: 'center' },
      { title: '单位名称', dataIndex: 'organization', key: 'organization', align: 'center' },
      { title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center' },
      { title: '联系人电话', dataIndex: 'mobile', key: 'mobile', align: 'center' },
      { title: '所在区域', dataIndex: 'area', key: 'area', align: 'center' },
      localStorage.getItem('antd-pro-authority') === 'vendors'
        ? {
            title: '操作',
            dataIndex: 'uuid',
            key: 'uuid',
            align: 'center',
            render: (val, infos) => (
              <Button.Group size="small">
                {/* <Button
              onClick={() => {
                location.hash = ``;
              }}
            >
              详情
            </Button> */}
                <Button
                  // hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                  onClick={() => {
                    location.hash = `/merchant/add-edit-merchant/?mid=${val}`;
                  }}
                >
                  编辑
                </Button>
                {infos.state !== 0 ? (
                  <Button
                    // hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                    onClick={() => {
                      const delMerchants = `${url}/merchants/${val}`;
                      fetch(delMerchants, {
                        method: 'DELETE',
                      }).then(res => {
                        if (res.ok)
                          res.json().then(info => {
                            if (info.status) this.getMerchantsList();
                          });
                      });
                    }}
                  >
                    注销
                  </Button>
                ) : (
                  ''
                )}
              </Button.Group>
            ),
          }
        : {},
    ];

    const tabPane = [
      <Tabs.TabPane tab={`品牌商列表（${merchant1.length}）`} key="1">
        <Table rowkey="id" columns={columns1} dataSource={merchant1} loading={loading} />
      </Tabs.TabPane>,
      <Tabs.TabPane tab={`运营商列表（${merchant2.length}）`} key="2">
        <Table rowkey="id" columns={columns2} dataSource={merchant2} loading={loading} />
      </Tabs.TabPane>,
      <Tabs.TabPane tab={`代理商列表（${merchant3.length}）`} key="3">
        <Table rowkey="id" columns={columns3} dataSource={merchant3} loading={loading} />
      </Tabs.TabPane>,
    ];

    return (
      <PageHeaderLayout title="客户管理">
        <div style={styles.content}>
          <Row>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                品牌商：
              </Col>
              <Col span={16}>
                <Input
                  placeholder="请输入需要查找的品牌商"
                  onChange={e => {
                    this.setState({ m1: e.target.value });
                  }}
                />
              </Col>
            </Col>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                运营商：
              </Col>
              <Col span={16}>
                <Input
                  placeholder="请输入需要查找的运营商"
                  onChange={e => {
                    this.setState({ m2: e.target.value });
                  }}
                />
              </Col>
            </Col>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                代理商：
              </Col>
              <Col span={16}>
                <Input
                  placeholder="请输入需要查找的代理商"
                  onChange={e => {
                    this.setState({ m3: e.target.value });
                  }}
                />
              </Col>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={this.searchList.bind(this)}>
                <Icon type="search" />查找
              </Button>
            </Col>
          </Row>
        </div>
        <div style={styles.content}>
          <div hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}>
            <Button
              type="primary"
              style={{ marginBottom: 20 }}
              onClick={() => {
                location.hash = '/merchant/add-edit-merchant';
              }}
            >
              <Icon type="plus" />添加客户
            </Button>
          </div>
          <Tabs defaultActiveKey="1">
            {authority === 'merchants_01' && tabPane.slice(1)}
            {authority === 'merchants_02' && tabPane.slice(2)}
            {authority === 'vendors' && tabPane}
          </Tabs>
        </div>
      </PageHeaderLayout>
    );
  }
}

const styles = {
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: 15,
  },
  tit: {
    minWidth: 110,
    textAlign: 'right',
    lineHeight: '32px',
  },
};

export default MerchantList;
