/* eslint-disable no-param-reassign,no-plusplus */
import React, { PureComponent } from 'react';
import { List, Modal, Button, Icon, Table, Input, Row, Col, Tabs, message, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { url } from '../../services/api';
const auth = sessionStorage.getItem('dochen-auth')
  ? JSON.parse(sessionStorage.getItem('dochen-auth'))
  : '';
const authority = localStorage.getItem('antd-pro-authority');

class DevicesList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      eLists: [],
      rLists: [],
      rListsNum: '',
      totalNum: 0,
      eid: '',
      model: '',
      brand: '',
      curPage: 1,
      merchant1: [],
      merchant2: [],
      merchant3: [],
      userList: [],
      rentList: [],
      rentNum: 0,
      overtimeNum: 0,
      overtime: [],
      filter: [],
      filterLoading: true,
      filterInfo: false,
      filterDay: 0,
    };
  }

  componentWillMount() {
    this.getEquipmentList();
    this.getMerchantsList();
    this.getUsers();
    this.getRentList();
    this.getOvertimeList();
  }

  //获取滤芯到期列表
  getOvertimeList() {
    fetch(`${url}/filter_element/0`, {
      headers:
        auth.type === 0
          ? { vid: auth.uuid }
          : auth.type === 'merchants' ? { mid: auth.uuid } : { pid: auth.uuid },
    }).then(res => {
      if (res.ok)
        res.json().then(info => {
          let arr = [];
          if (info.data.length > 0) {
            for (let i = 0; i < info.data.length - 1; i++) {
              if (info.data[i].eid != info.data[i + 1].eid) {
                arr.push(info.data[i]);
              }
            }
            arr.push(info.data[info.data.length - 1]);
          }
          this.setState({ overtime: arr, overtimeNum: arr.length });
        });
    });
  }

  //获取出租统计列表
  getRentList() {
    fetch(`${url}/rent`, {
      headers:
        auth.type === 0
          ? { vid: auth.uuid }
          : auth.type === 'merchants' ? { mid: auth.uuid } : { pid: auth.uuid },
    }).then(res => {
      if (res.ok)
        res.json().then(info => {
          this.setState({ rentList: info.data, rentNum: info.total });
        });
    });
  }

  // 获取设备列表
  getEquipmentList() {
    //let rentNum = 0;
    //let overtimeNum = 0;
    //let rentList=[];
    //let overtime = [];
    const getEquipmentUrl = `${url}/equipment`;
    fetch(getEquipmentUrl, {
      headers:
        auth.type === 0
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
            const eLists = [];
            let rLists = [];
            info.data.forEach((val, index) => {
              val.key = index + 1;
              if (val.state == 1) {
                eLists.push(val);
              } else if (val.state == 2) {
                rLists.push(val);
              }
            });
            /*eLists.forEach(val => {
              const rentListUrl = `${url}/filter_element`;
              fetch(rentListUrl, {
                method: 'GET',
                headers:
                  { eid: val.uuid, }
              }).then(res => {
                if (res.ok) {
                  res.json().then(info => {
                    if (info.data.length === 5) {
                      if (info.data[0].lifetime == info.data[1].lifetime && info.data[0].lifetime == info.data[2].lifetime && info.data[0].lifetime == info.data[3].lifetime
                        && info.data[0].lifetime == info.data[4].lifetime) {
                        val.renttime = info.data[0].lifetime;
                        rentList.push(val);
                        rentNum = rentNum+1;
                        this.setState({rentNum})
                      };

                      if(info.data[0].lifetime <=0 || info.data[1].lifetime <=0 || info.data[2].lifetime <=0
                        || info.data[3].lifetime <=0 || info.data[4].lifetime <=0 ){
                        let overFilter = '';
                        for(let i=0;i<info.data.length;i++){
                            if(info.data[i].lifetime<=0){
                              overFilter = `N${i+1}`;
                            }
                        }
                        val.overFilter = overFilter;
                        overtime.push(val);
                        overtimeNum++;
                        this.setState({overtimeNum,overtime})
                      }
                    };
                  })
                }
              })
            });*/
            console.log(rLists);
            console.log(eLists);
            this.setState({
              eLists,
              rLists,
              rListsNum: rLists.length,
              totalNum: eLists.length,
              loading: false,
            });
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
      headers:
        auth.type === 0
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
            const merchant1 = [];
            const merchant2 = [];
            const merchant3 = [];
            info.data.forEach(val => {
              if (val.type === 1) merchant1.push(val);
              if (val.type === 2) merchant2.push(val);
              if (val.type === 3) merchant3.push(val);
            });
            this.setState({ merchant1, merchant2, merchant3 });
          }
        });
      }
    });
  }

  // 获取用户列表
  getUsers() {
    const getUsersUrl = `${url}/users`;
    fetch(getUsersUrl, {
      headers:
        auth.type === 0
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
            this.setState({ userList: info.data });
          }
        });
      }
    });
  }

  // 获取搜索列表
  searchList() {
    const { eLists, eid, model, brand } = this.state;
    const arr = [];

    eLists.forEach(val => {
      if (val.uuid === eid || val.model === model || val.brand === brand) arr.push(val);
    });

    if (arr.length === 0) message.error('没找到对应的数据');

    this.setState({
      eLists: arr.length > 0 ? arr : eLists,
    });
  }

  //弹窗
  showModal = params => {
    console.log(params);
    fetch(`${url}/filter_element`, {
      headers: {
        eid: params.eid,
      },
    }).then(res => {
      if (res.ok)
        res.json().then(info => {
          console.log(111);
          console.log(info);
          if (info.data.length > 0) {
            let filter = new Array(5);
            let num = 0;
            let filterInfo = false;
            let filterDay = 0;
            info.data.forEach((val, i) => {
              //剩余时间一样++ 控制滤芯或者出租详情的显示
              if (info.data[0].lifetime === info.data[i].lifetime) num++;
              filter[parseInt(...val.grade[1]) - 1] = val;
            });

            //剩余时间一样 控制滤芯或者出租详情的显示
            filterDay = info.data[0].lifetime;
            //  if(num === filter.length) filterInfo = true;
            //else filterDay = info.data[0].lifetime;
            if (num === 5) {
              filterInfo = true;
              filterDay = info.data[0].lifetime;
            } else {
              filterInfo = false;
            }

            this.setState({ filter, filterLoading: false, filterInfo, filterDay });
          } else {
            this.setState({ filter: [], filterLoading: false });
          }
        });
    });
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  //解绑用户
  removeUser(params) {
    fetch(`${url}/users`, {
      method: 'DELETE',
      headers:
        params.type === 0
          ? {
              vid: 'f024e5ceef9811e8b4ea00163e0e26fc',
            }
          : {
              mid: params.mid,
            },
      body: JSON.stringify(params),
    }).then(res => {
      if (res.ok) {
        res.json().then(info => {
          this.getEquipmentList();
          this.getMerchantsList();
          this.getUsers();
          this.getRentList();
          this.getOvertimeList();
        });
      }
    });
  }

  render() {
    const {
      filterDay,
      filterInfo,
      filterLoading,
      filter,
      loading,
      eLists,
      totalNum,
      curPage,
      merchant1,
      merchant2,
      merchant3,
      userList,
      rentList,
      rentNum,
      overtimeNum,
      overtime,
      rLists,
      rListsNum,
    } = this.state;

    // 给各级商家列表添加序号
    rLists.forEach((item, index) => {
      item.key = index + 1;
    });
    eLists.forEach((item, index) => {
      item.key = index + 1;
    });

    // 根据 eLists 的 mid 在商家列表中找对应的运营商、代理商或经销商
    eLists.forEach((val, index) => {
      merchant3.forEach(m3 => {
        if (val.mid === m3.uuid) {
          val.distributor = m3.contact;
          val.sid = m3.sid;
        }
      });
      merchant2.forEach(m2 => {
        if (val.mid === m2.uuid) {
          val.agent = m2.contact;
          val.sid = m2.sid;
        }
        if (val.sid && val.sid === m2.uuid) val.operator = m2.contact;
      });
      merchant1.forEach(m1 => {
        if (val.mid === m1.uuid) val.operator = m1.contact;
        if (val.sid && val.sid === m1.uuid) val.operator = m1.contact;
      });
      // 根据uid从 userList 找出用户
      userList.forEach(u => {
        if (val.uid === u.uuid) val.user = u.name;
      });
    });

    const columns1 = [
      {
        title: '序号',
        dataIndex: 'key',
        align: 'center',
        render: (text, record, index) => ` ${index + 1}`,
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        align: 'center',
        defaultSortOrder: 'descend',
        sorter: (prev, next) => Date.parse(prev.created_at) - Date.parse(next.created_at),
      },
      { title: '设备ID', dataIndex: 'uuid', align: 'center' },
      { title: '品牌', dataIndex: 'brand', align: 'center' },
      { title: '型号', dataIndex: 'model', align: 'center' },
      /*{ title: '在线状态',
        dataIndex: '',
        align: 'center',
        render: info =>
          info.online_at && !info.offline_at ? (
            <Badge status="success" text="在线" />
          ) : (
            <Badge status="default" text="离线" />
          ),
      },*/
      { title: '用户', dataIndex: 'user', align: 'center', render: info => info || '--' },
      { title: '安装工', dataIndex: 'personnel', align: 'center', render: info => info || '--' },
      authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '代理商', dataIndex: 'm3name', align: 'center' },
      authority === 'merchants_02' || authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '运营商', dataIndex: 'm2name', align: 'center' },
      authority !== 'vendors'
        ? { colSpan: 0 }
        : { title: '品牌商', dataIndex: 'm1name', align: 'center' },
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        render: (val, infos) => (
          <Button.Group size="small">
            <Button
              onClick={() => {
                this.showModal({ eid: val.uuid });
              }}
            >
              详情
            </Button>
            <Modal
              title="设备详情"
              visible={this.state.visible}
              onOk={this.hideModal}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
              maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              <List
                loading={filterLoading}
                header={
                  <div style={{ display: 'flex', fontSize: 16 }}>
                    <div>名称</div>
                    <div style={{ marginLeft: 'auto' }}>剩余寿命</div>
                  </div>
                }
                footer={
                  <div style={{ textAlign: 'center' }} hidden={filter.length > 0 ? false : filter}>
                    <div style={{ fontSize: 16 }}>设备出租详情</div>
                    <div>剩余{filterInfo ? filterDay : '--'}天可用</div>
                  </div>
                }
                dataSource={filter}
                renderItem={item => (
                  <List.Item style={{ display: 'flex' }}>
                    <div>
                      <div>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#bbb' }}>
                        {item.grade == 'N1'
                          ? '第一级滤芯'
                          : item.grade == 'N2'
                            ? '第二级滤芯'
                            : item.grade == 'N3'
                              ? '第三级滤芯'
                              : item.grade == 'N4'
                                ? '第四级滤芯'
                                : item.grade == 'N5' ? '第五级滤芯' : ''}
                      </div>
                    </div>
                    <div style={styles.lifetime}>{!filterInfo ? `${item.lifetime}天` : '--'}</div>
                  </List.Item>
                )}
              />
            </Modal>
            <Button
              onClick={() => {
                console.log(val);
                this.removeUser({ type: auth.type, mid: auth.uuid, uid: val.uid, eid: val.uuid });
              }}
            >
              注销
            </Button>
          </Button.Group>
        ),
      },
    ];

    const columns2 = [
      {
        title: '序号',
        dataIndex: 'id',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      { title: '时间', dataIndex: 'created_at', align: 'center' },
      { title: '设备ID', dataIndex: 'eid', align: 'center' },
      { title: '品牌', dataIndex: 'brand', align: 'center' },
      { title: '型号', dataIndex: 'model', align: 'center' },
      /*{ title: '在线状态',
        dataIndex: '',
        align: 'center',
        render: info =>
          info.online_at && !info.offline_at ? (
            <Badge status="success" text="在线" />
          ) : (
            <Badge status="default" text="离线" />
          ),
      },*/
      { title: '出租时间', dataIndex: 'lifetime', align: 'center' },
      { title: '用户', dataIndex: 'user', align: 'center', render: info => info || '--' },
      { title: '安装工', dataIndex: 'personnel', align: 'center', render: info => info || '--' },
      authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '代里商', dataIndex: 'm3name', align: 'center', render: info => info || '--' },
      authority === 'merchants_02' || authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '运营商', dataIndex: 'm2name', align: 'center', render: info => info || '--' },
      authority !== 'vendors'
        ? { colSpan: 0 }
        : { title: '品牌商', dataIndex: 'm1name', align: 'center', render: info => info || '--' },
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        render: (val, infos) => (
          <Button.Group size="small">
            <Button
              onClick={() => {
                console.log(val);
                this.showModal({ eid: val.eid });
              }}
            >
              详情
            </Button>
            <Modal
              title="设备详情"
              visible={this.state.visible}
              onOk={this.hideModal}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
              maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              <List
                loading={filterLoading}
                header={
                  <div style={{ display: 'flex', fontSize: 16 }}>
                    <div>名称</div>
                    <div style={{ marginLeft: 'auto' }}>剩余寿命</div>
                  </div>
                }
                footer={
                  <div style={{ textAlign: 'center' }} hidden={filter.length > 0 ? false : filter}>
                    <div style={{ fontSize: 16 }}>设备出租详情</div>
                    <div>剩余{filterInfo ? filterDay : '--'}天可用</div>
                  </div>
                }
                dataSource={filter}
                renderItem={item => (
                  <List.Item style={{ display: 'flex' }}>
                    <div>
                      <div>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#bbb' }}>
                        {item.grade == 'N1'
                          ? '第一级滤芯'
                          : item.grade == 'N2'
                            ? '第二级滤芯'
                            : item.grade == 'N3'
                              ? '第三级滤芯'
                              : item.grade == 'N4'
                                ? '第四级滤芯'
                                : item.grade == 'N5' ? '第五级滤芯' : ''}
                      </div>
                    </div>
                    <div style={styles.lifetime}>{!filterInfo ? `${item.lifetime}天` : '--'}</div>
                  </List.Item>
                )}
              />
            </Modal>
            <Button
              onClick={() => {
                console.log(val);
                this.removeUser({ type: auth.type, mid: auth.uuid, uid: val.uid, eid: val.eid });
              }}
            >
              注销
            </Button>
          </Button.Group>
        ),
      },
    ];

    const columns3 = [
      {
        title: '序号',
        dataIndex: 'id',
        align: 'center',
        render: (text, record, index) => ` ${index + 1}`,
      },
      { title: '时间', dataIndex: 'created_at', align: 'center' },
      { title: '设备ID', dataIndex: 'eid', align: 'center' },
      { title: '品牌', dataIndex: 'brand', align: 'center' },
      { title: '型号', dataIndex: 'model', align: 'center' },
      /*{ title: '在线状态',
        dataIndex: '',
        align: 'center',
        render: info =>
          info.online_at && !info.offline_at ? (
            <Badge status="success" text="在线" />
          ) : (
            <Badge status="default" text="离线" />
          ),
      },*/
      { title: '到期滤芯', dataIndex: 'overFilter', align: 'center' },
      { title: '用户', dataIndex: 'user', align: 'center', render: info => info || '--' },
      { title: '安装工', dataIndex: 'personnel', align: 'center', render: info => info || '--' },
      authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '代理商', dataIndex: 'm3name', align: 'center', render: info => info || '--' },
      authority === 'merchants_02' || authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '运营商', dataIndex: 'm2name', align: 'center', render: info => info || '--' },
      authority !== 'vendors'
        ? { colSpan: 0 }
        : { title: '品牌商', dataIndex: 'm1name', align: 'center', render: info => info || '--' },
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        render: (val, infos) => (
          <Button.Group size="small">
            <Button
              onClick={() => {
                this.showModal({ eid: val.eid });
              }}
            >
              详情
            </Button>
            <Modal
              title="设备详情"
              visible={this.state.visible}
              onOk={this.hideModal}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
              maskStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              <List
                loading={filterLoading}
                header={
                  <div style={{ display: 'flex', fontSize: 16 }}>
                    <div>名称</div>
                    <div style={{ marginLeft: 'auto' }}>剩余寿命</div>
                  </div>
                }
                footer={
                  <div style={{ textAlign: 'center' }} hidden={filter.length > 0 ? false : filter}>
                    <div style={{ fontSize: 16 }}>设备出租详情</div>
                    <div>剩余{filterInfo ? filterDay : '--'}天可用</div>
                  </div>
                }
                dataSource={filter}
                renderItem={item => (
                  <List.Item style={{ display: 'flex' }}>
                    <div>
                      <div>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#bbb' }}>
                        {item.grade == 'N1'
                          ? '第一级滤芯'
                          : item.grade == 'N2'
                            ? '第二级滤芯'
                            : item.grade == 'N3'
                              ? '第三级滤芯'
                              : item.grade == 'N4'
                                ? '第四级滤芯'
                                : item.grade == 'N5' ? '第五级滤芯' : ''}
                      </div>
                    </div>
                    <div style={styles.lifetime}>{!filterInfo ? `${item.lifetime}天` : '--'}</div>
                  </List.Item>
                )}
              />
            </Modal>
            <Button
              onClick={() => {
                console.log(val);
                this.removeUser({ type: auth.type, mid: auth.uuid, uid: val.uid, eid: val.eid });
              }}
            >
              注销
            </Button>
          </Button.Group>
        ),
      },
    ];

    const columns4 = [
      { title: '序号', dataIndex: 'key', align: 'center' },
      { title: '时间', dataIndex: 'created_at', align: 'center' },
      { title: '设备ID', dataIndex: 'uuid', align: 'center' },
      { title: '品牌', dataIndex: 'brand', align: 'center' },
      { title: '型号', dataIndex: 'model', align: 'center' },
      /*{ title: '在线状态',
        dataIndex: '',
        align: 'center',
        render: info =>
          info.online_at && !info.offline_at ? (
            <Badge status="success" text="在线" />
          ) : (
            <Badge status="default" text="离线" />
          ),
      },*/
      { title: '到期滤芯', dataIndex: 'overFilter', align: 'center' },
      { title: '用户', dataIndex: 'user', align: 'center', render: info => info || '--' },
      { title: '安装工', dataIndex: 'personnel', align: 'center', render: info => info || '--' },
      authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '代理商', dataIndex: 'm3name', align: 'center', render: info => info || '--' },
      authority === 'merchants_02' || authority === 'merchants_03'
        ? { colSpan: 0 }
        : { title: '运营商', dataIndex: 'm2name', align: 'center', render: info => info || '--' },
      authority !== 'vendors'
        ? { colSpan: 0 }
        : { title: '品牌商', dataIndex: 'm1name', align: 'center', render: info => info || '--' },
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        render: (val, infos) => <Button.Group size="small" />,
      },
    ];

    const tabPane = [
      <Tabs.TabPane tab={`设备汇总（${totalNum}）`} key="1">
        <Table
          rowkey="id"
          columns={columns1}
          dataSource={eLists}
          loading={loading}
          onChange={current => this.setState({ curPage: current })}
        />
      </Tabs.TabPane>,
      <Tabs.TabPane tab={`出租统计（${rentNum}）`} key="2">
        <Table rowkey="id" columns={columns2} dataSource={rentList} loading={loading} />
      </Tabs.TabPane>,
      <Tabs.TabPane tab={`滤芯到期（${overtimeNum}）`} key="3">
        <Table rowkey="id" columns={columns3} dataSource={overtime} loading={loading} />
      </Tabs.TabPane>,
      <Tabs.TabPane tab={`已备案ID（${rListsNum}）`} key="4">
        <Table rowkey="id" columns={columns4} dataSource={rLists} loading={loading} />
      </Tabs.TabPane>,
    ];

    return (
      <PageHeaderLayout title="设备管理">
        <div style={styles.content}>
          <Row>
            <Col span={10}>
              <Col span={6} style={styles.tit}>
                设备ID：
              </Col>
              <Col span={14}>
                <Input
                  placeholder="请输入需要查找的设备ID"
                  onChange={e => {
                    this.setState({ eid: e.target.value });
                  }}
                />
              </Col>
            </Col>
            <Col span={10}>
              <Col span={6} style={styles.tit}>
                型号：
              </Col>
              <Col span={14}>
                <Input
                  placeholder="请输入需要查找的设备型号"
                  onChange={e => {
                    this.setState({ model: e.target.value });
                  }}
                />
              </Col>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={10}>
              <Col span={6} style={styles.tit}>
                品牌：
              </Col>
              <Col span={14}>
                <Input
                  placeholder="请输入需要查找的品牌"
                  onChange={e => {
                    this.setState({ brand: e.target.value });
                  }}
                />
              </Col>
            </Col>
            <Col span={10}>
              <Col span={6} style={styles.tit}>
                选择运营商：
              </Col>
              <Col span={14}>
                <Input placeholder="请输入需要查找的运营商" />
              </Col>
            </Col>
            <Col span={4}>
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
                location.hash = '/devices/put-on-record';
              }}
            >
              ID备案
            </Button>
          </div>
          <Tabs defaultActiveKey="1">{tabPane}</Tabs>
        </div>
      </PageHeaderLayout>
    );
  }
}

const styles = {
  lifetime: {
    marginLeft: 'auto',
    marginRight: '5%',
    alignSelf: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: 15,
  },
  tit: {
    minWidth: 110,
    textAlign: 'right',
    lineHeight: '36px',
  },
};

export default DevicesList;
