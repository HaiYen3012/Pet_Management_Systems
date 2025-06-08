import React from 'react';
import { Table, Typography, Card } from 'antd';
import useService from 'hooks/useService';
import './medical-info.scss';

const { Title } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
    fixed: 'left',
    width: 70,
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
];

const MedicalInfo = () => {
  const { serviceAppointment } = useService();

  return (
    <div className="manage-page">
      <Card className="manage-card">
        <div className="manage-header">
          <Title level={2}>Bảng giá dịch vụ khám chữa bệnh</Title>
          <p>Xem và quản lý giá của các dịch vụ y tế một cách dễ dàng.</p>
        </div>
        <div className="manage-content">
          <Table
            className="manage-table"
            dataSource={serviceAppointment}
            columns={columns}
            pagination={{
              defaultPageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ['8', '15', '25'],
            }}
            rowKey="id"
            scroll={{ x: 600 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MedicalInfo;