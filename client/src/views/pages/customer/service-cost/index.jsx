import React from 'react'
import { Table, Typography, Tabs, Card } from 'antd'
import useService from 'hooks/useService'
// Import file CSS đã tạo
import './ServiceCost.scss'

const { Title } = Typography

// --- ĐỊNH NGHĨA CÁC CỘT CHO BẢNG ---

// Định dạng giá tiền cho đẹp
const formatPrice = (price) => (
  <span className="price-cell">{Number(price).toLocaleString('vi-VN')} ₫</span>
)

// Cột cho dịch vụ Khám & Làm đẹp
const columnsAppointmentAndBeauty = [
  {
    // THAY ĐỔI: Sửa "Mã Dịch Vụ" thành "ID"
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
    // Chức năng sort đã có sẵn ở đây
    sorter: (a, b) => a.id - b.id,
  },
  {
    // THAY ĐỔI: Sửa "Hạng Mục" thành "Thời gian"
    title: 'Thời gian',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Chi Phí',
    dataIndex: 'price',
    key: 'price',
    render: formatPrice,
  },
  {
    title: 'Đơn Vị',
    dataIndex: 'unit',
    key: 'unit',
  },
]

// Cột cho dịch vụ Trông giữ
const columnsStorage = [
  {
    // THAY ĐỔI: Sửa "Mã Dịch Vụ" thành "ID"
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
    // Chức năng sort đã có sẵn ở đây
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Loại Phòng',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Chi Phí',
    dataIndex: 'price',
    key: 'price',
    render: formatPrice,
  },
  {
    title: 'Đơn Vị',
    dataIndex: 'unit',
    key: 'unit',
  },
]

// Component Bảng con để tái sử dụng
const ServiceTable = ({ dataSource, columns }) => (
  <div className="service-cost-table-wrapper">
    <Table
      className="service-cost-table"
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      pagination={{
        defaultPageSize: 8,
        showSizeChanger: true,
        pageSizeOptions: ['8', '15', '25'],
      }}
    />
  </div>
)

const ServiceCost = () => {
  const { serviceAppointment, serviceBeauty, serviceStorage } = useService()

  // Tối ưu: Định nghĩa Bảng giá ngay trong `children` của mỗi tab
  const serviceItems = [
    {
      key: '1',
      label: 'Dịch vụ Khám & Chữa bệnh',
      children: (
        <ServiceTable
          dataSource={serviceAppointment}
          columns={columnsAppointmentAndBeauty}
        />
      ),
    },
    {
      key: '2',
      label: 'Dịch vụ Trông giữ (Hotel)',
      children: (
        <ServiceTable dataSource={serviceStorage} columns={columnsStorage} />
      ),
    },
    {
      key: '3',
      label: 'Dịch vụ Spa & Grooming',
      children: (
        <ServiceTable
          dataSource={serviceBeauty}
          columns={columnsAppointmentAndBeauty}
        />
      ),
    },
  ]

  return (
    <div className="service-cost-page">
      <Card className="service-cost-card">
        <div className="service-cost-header">
          <Title level={2}>Bảng Giá Dịch Vụ</Title>
          <p>
            Chúng tôi cung cấp các dịch vụ chăm sóc toàn diện với mức giá hợp
            lý, đảm bảo mang lại trải nghiệm tốt nhất cho các bé cưng.
          </p>
        </div>

        <Tabs
          defaultActiveKey="1"
          items={serviceItems}
          centered // Căn giữa các tab
          className="service-cost-tabs"
        />
      </Card>
    </div>
  )
}

export default ServiceCost
