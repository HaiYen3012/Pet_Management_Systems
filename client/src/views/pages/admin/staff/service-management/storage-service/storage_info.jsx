import React, { useState } from 'react';
import { Table, Typography, Card, Button } from 'antd';
import useService from 'hooks/useService';

const { Title } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
    fixed: 'left',
    width: 70,
    align: 'center',
  },
  {
    title: 'Loại phòng',
    dataIndex: 'type',
    align: 'center',
  },
  {
    title: 'Số lượng tối đa',
    dataIndex: 'max_slot',
    align: 'center',
  },
  {
    title: 'Số lượng hiện tại',
    dataIndex: 'current_slot',
    align: 'center',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    align: 'center',
    render: (price) => (
      <span style={{
        color: '#b8860b',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        {price?.toLocaleString?.()} VNĐ
      </span>
    ),
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    align: 'center',
  },
];

const StorageInfo = () => {
  const { serviceStorage } = useService();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff8dc 0%, #ffebcd 50%, #ffefd5 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
        border: '2px solid #ffd700'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          background: 'linear-gradient(45deg, #fff8dc, #ffebcd)',
          borderRadius: '16px',
          border: '1px solid #ffd700'
        }}>
          <Title level={2} style={{
            color: '#b8860b',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(255, 215, 0, 0.3)'
          }}>
            Bảng giá dịch vụ lưu trữ
          </Title>
          <p style={{
            color: '#cd853f',
            fontSize: '16px',
            margin: 0,
            fontWeight: '500'
          }}>
            Xem và quản lý giá của các dịch vụ lưu trữ một cách dễ dàng
          </p>
        </div>
        <div style={{ padding: '0 20px' }}>
          <Table
            dataSource={serviceStorage}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30'],
              style: {
                padding: '20px 0'
              }
            }}
            rowKey="id"
            scroll={{ x: 600 }}
            style={{
              background: '#fffacd',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #ffd700'
            }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
            }
          />
        </div>
        
        <style jsx>{`
          .ant-table-thead > tr > th {
            background: linear-gradient(45deg, #ffd700, #ffb347) !important;
            color: #8b4513 !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #daa520 !important;
            text-align: center !important;
          }
          
          .table-row-even td {
            background-color: #fffacd !important;
          }
          
          .table-row-odd td {
            background-color: #fff8dc !important;
          }
          
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #ffd700 !important;
            color: #8b4513 !important;
            font-weight: 500 !important;
          }
          
          .ant-table-tbody > tr:hover > td {
            background-color: #ffebcd !important;
          }
          
          .ant-pagination-item {
            border-color: #ffd700 !important;
            background-color: #fffacd !important;
          }
          
          .ant-pagination-item:hover {
            border-color: #daa520 !important;
            background-color: #ffebcd !important;
          }
          
          .ant-pagination-item-active {
            background-color: #ffd700 !important;
            border-color: #ffd700 !important;
          }
          
          .ant-pagination-item-active a {
            color: #8b4513 !important;
            font-weight: 600 !important;
          }
          
          .ant-select-selector {
            border-color: #ffd700 !important;
            background-color: #fffacd !important;
          }
          
          .ant-select-selector:hover {
            border-color: #daa520 !important;
          }
        `}</style>
      </Card>
    </div>
  );
};

export default StorageInfo;