import React, { useState } from 'react'
import { Table, Space, Typography, Tabs, Button } from 'antd'
import useService from 'hooks/useService'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
    fixed: 'left',
    width: '70px',
  },
  {
    title: 'Loại phòng',
    dataIndex: 'type',
  },
  {
    title: 'Số lượng tối đa',
    dataIndex: 'max_slot',
  },
  {
    title: 'Số lượng hiện tại',
    dataIndex: 'current_slot',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
  },
]

const StorageInfo = () => {
  const { serviceStorage } = useService()

  return (
    <div className="storage-info">
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Typography.Title level={2}>Bảng giá dịch vụ lưu trữ</Typography.Title>
        <br />
        <br />
      </Space>
      <Table
        dataSource={serviceStorage}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
      ;
    </div>
  )
}

export default StorageInfo
