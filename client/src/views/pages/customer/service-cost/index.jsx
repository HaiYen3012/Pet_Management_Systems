import React, { useState } from 'react'
import { Table, Space, Typography, Tabs } from 'antd'
import useService from 'hooks/useService'

const items = [
  {
    key: '1',
    label: 'Dịch vụ khám chữa bệnh',
    children: <></>,
  },
  {
    key: '2',
    label: 'Dịch vụ lưu trữ',
    children: <></>,
  },
  {
    key: '3',
    label: 'Dịch vụ vệ sinh làm đẹp',
    children: <></>,
  },
]

const columnsAppoint = [
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

const columnsStorage = [
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
    title: 'Giá',
    dataIndex: 'price',
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
  },
]

const ServiceCost = () => {
  const { serviceAppointment, serviceBeauty, serviceStorage } = useService()
  const [listData, setListData] = useState(serviceAppointment)
  const [col, setCol] = useState(columnsAppoint)

  const onChangeTabs = (key) => {
    switch (key) {
      case '1':
        setListData(serviceAppointment)
        setCol(columnsAppoint)
        break
      case '2':
        setListData(serviceStorage)
        setCol(columnsStorage)
        break
      case '3':
        setListData(serviceBeauty)
        setCol(columnsAppoint)
        break
      default:
        setListData(serviceAppointment)
        setCol(columnsAppoint)
        break
    }
  }

  return (
    <div className="service-cost">
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Typography.Title level={2}>Bảng giá dịch vụ</Typography.Title>
        <br />
        <br />
      </Space>
      <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />
      <Table
        dataSource={listData}
        columns={col}
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

export default ServiceCost
