/* eslint-disable no-param-reassign,no-plusplus */
import React, { PureComponent } from 'react';
import { Button, Icon, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const url = 'http://ssys.dochen.cn/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';

class UsersList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      lists: [],
      merchant2: [], // 代理商
      merchant3: [], // 经销商
    };
  }

  componentWillMount() {
    this.getPersonnelList();
    this.getMerchantsList();
  }

  // 获取用户列表
  getPersonnelList() {
    const getPersonnelUrl = `${url}/users`;
    fetch(getPersonnelUrl, {
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
        res.json().then(info => {
          if (info.status) {
            const lists = [];
            info.data.forEach((val, index) => {
              val.key = index + 1;
              lists.push(val);
            });
            this.setState({ lists, loading: false });
          } else {
            message.warning(`提示：[${info.message}]`);
            this.setState({ loading: false });
          }
        });
      }
    });
  }

  // 获取商家列表
  getMerchantsList() {
    const getMerchantsUrl = `${url}/merchants`;
    fetch(getMerchantsUrl, {
      headers: {
        vid: auth.uuid,
      },
    }).then(res => {
      if (res.ok) {
        res.json().then(info => {
          if (info.status) {
            const merchant2 = [];
            const merchant3 = [];
            info.data.forEach(val => {
              if (val.type === 2) merchant2.push(val);
              if (val.type === 3) merchant3.push(val);
            });
            this.setState({ merchant2, merchant3 });
          }
        });
      }
    });
  }

  render() {
    const { lists, merchant2, merchant3, loading } = this.state;
    // 根据 lists 的 mid 在商家列表中找对应的代理商或经销商
    lists.forEach(val => {
      merchant2.forEach(m2 => {
        if (val.mid === m2.uuid) val.agent = m2.contact;
      });
      merchant3.forEach(m3 => {
        if (val.mid === m3.uuid) val.distributor = m3.contact;
      });
    });

    // 安装工字段数据还没写
    const columns = [
      { title: '序号', dataIndex: 'key', align: 'center' },
      { title: '姓名', dataIndex: 'name', align: 'center' },
      { title: '电话', dataIndex: 'mobile', align: 'center' },
      { title: '品牌商', dataIndex: 'm1name', align: 'center' },
      { title: '运营商', dataIndex: 'm2name', align: 'center' },
      { title: '代理商', dataIndex: 'm3name', align: 'center' },
      { title: '安装工', dataIndex: 'personnel', align: 'center' },
    ];

    return (
      <PageHeaderLayout title="用户列表">
        <div style={styles.content}>
          <div>
            <Button
              type="primary"
              style={{ marginBottom: 20 }}
              onClick={() => {
                location.hash = '/users/add-edit-user';
              }}
              hidden
            >
              <Icon type="plus" />添加用户
            </Button>
            <Table columns={columns} dataSource={lists} loading={loading} />
          </div>
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
};

export default UsersList;
