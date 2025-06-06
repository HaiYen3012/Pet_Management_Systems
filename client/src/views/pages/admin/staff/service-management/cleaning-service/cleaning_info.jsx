import React, { useState } from 'react'
import { Table, Space, Typography, Tabs } from 'antd'
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
    title: 'Thời gian',
    dataIndex: 'time',
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

const CleaningInfo = () => {
  const { serviceBeauty } = useService()

  return (
    <div className="beauty-info">
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Typography.Title level={2}>Bảng giá dịch vụ vệ sinh</Typography.Title>
        <br />
        <br />
      </Space>
      <Table
        dataSource={serviceBeauty}
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

export default CleaningInfo
