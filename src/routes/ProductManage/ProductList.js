import React, { PureComponent } from 'react';
import { Button, Icon, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const url = 'http://ssys.dochen.cn/api';

class ProductList extends PureComponent {
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
      <PageHeaderLayout title="产品列表">
        <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: 15 }}>
          <div hidden={!(localStorage.getItem('antd-pro-authority') === 'vendors') || false}>
            <Button
              type="primary"
              style={{ marginBottom: 20 }}
              onClick={() => {
                location.hash = '/products/add-edit-product';
              }}
            >
              <Icon type="plus" />添加产品
            </Button>
          </div>
          <Table rowkey="id" columns={columns} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default ProductList;
