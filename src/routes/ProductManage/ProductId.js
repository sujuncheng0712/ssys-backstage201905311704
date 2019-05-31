import React, { PureComponent } from 'react';
import { Button, Icon, Table, Input, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

class ProductId extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {};
  }
  render() {
    const columns = [
      { title: '序号', dataIndex: '', align: 'center' },
      { title: '录入时间', dataIndex: '', align: 'center' },
      { title: '品牌', dataIndex: '', align: 'center' },
      { title: '型号', dataIndex: '', align: 'center' },
      { title: 'ID号', dataIndex: '', align: 'center' },
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        render: (val, infos) => (
          <Button.Group size="small">
            <Button
              onClick={() => {
                location.hash = ``;
              }}
            >
              详情
            </Button>
            <Button
              hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
              onClick={() => {
                location.hash = ``;
              }}
            >
              编辑
            </Button>
            {infos.state !== 0 ? (
              <Button
                hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}
                onClick={() => {
                  const delMerchants = ``;
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

    return (
      <PageHeaderLayout title="产品ID">
        <div style={styles.headerButton}>
          <div hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}>
            <Button type="primary" style={{ marginBottom: 20 }}>
              ID备案
            </Button>
          </div>
        </div>
        <div style={styles.content}>
          <Row>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                设备ID：
              </Col>
              <Col span={16}>
                <Input placeholder="请输入需要查找的设备ID" />
              </Col>
            </Col>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                型号：
              </Col>
              <Col span={16}>
                <Input placeholder="请输入需要查找的设备型号" />
              </Col>
            </Col>
            <Col span={6}>
              <Col span={4} style={styles.tit}>
                品牌：
              </Col>
              <Col span={16}>
                <Input placeholder="请输入需要查找的品牌" />
              </Col>
            </Col>
            <Col span={6}>
              <Button type="primary">
                <Icon type="search" />查找
              </Button>
            </Col>
          </Row>
        </div>
        <div style={styles.content}>
          <Table rowkey="id" columns={columns} />
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
  headerButton: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: 15,
    height: 72,
  },
  tit: {
    minWidth: 110,
    textAlign: 'right',
    lineHeight: '32px',
  },
};

export default ProductId;
