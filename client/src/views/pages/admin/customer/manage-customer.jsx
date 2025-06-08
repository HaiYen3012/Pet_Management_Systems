import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Spin,
  Popconfirm,
  Table,
  Typography,
  Card,
} from 'antd';
import {
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import ModalCustomer from './modal-add-edit';
import user from 'api/user';
import { toast } from 'react-toastify';
import './manage-customer.scss';

const { Title } = Typography;

const ManageCustomer = () => {
  const [form] = Form.useForm();
  const dataModalDefault = {
    key: '',
    user_id: '',
    fullname: '',
    username: '',
    email: '',
    phone_numbers: '',
    address: '',
    city: '',
    country: '',
    created_at: '',
  };
  const [listCustomer, setListCustomer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState('');
  const [dataModal, setDataModal] = useState(dataModalDefault);

  const handleOk = () => {
    setIsModalOpen(false);
    setAction('');
    setDataModal(dataModalDefault);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setDataModal(dataModalDefault);
    setAction('');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCreate = () => {
    setDataModal(dataModalDefault);
    setAction('CREATE');
    showModal();
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    try {
      const data = (await user.getAllCustomer()).data;
      const modifiedData = data.map((item) => ({
        ...item,
        key: item.user_id,
        created_at: convertDate(item.created_at),
      }));
      setListCustomer(modifiedData);
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
      sorter: (a, b) => a.user_id - b.user_id,
      fixed: 'left',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullname',
      key: 'fullname',
      fixed: 'left',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 140,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_numbers',
      key: 'phone_numbers',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Cập nhật',
      key: 'update',
      width: 95,
      render: (_, record) => (
        <Button
          className="action-button update-button"
          onClick={() => {
            setAction('UPDATE');
            setDataModal(record);
            showModal();
          }}
          icon={<FaPen />}
        />
      ),
      fixed: 'right',
    },
    {
      title: 'Xóa',
      key: 'delete',
      width: 90,
      render: (_, record) => (
        <Popconfirm
          title="Xóa khách hàng"
          description="Bạn có chắc chắn muốn xóa?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={async () => {
            await user.deleteUser(record.user_id);
            toast.success('Xóa khách hàng thành công!');
            fetchData();
          }}
        >
          <Button
            className="action-button delete-button"
            icon={<FaTrashAlt />}
            danger
          />
        </Popconfirm>
      ),
      fixed: 'right',
    },
  ];

  return (
    <div className="manage-customer-page">
      <Card className="manage-customer-card">
        <div className="manage-customer-header">
          <Title level={2}>Quản lý khách hàng</Title>
          <p>Quản lý thông tin khách hàng một cách dễ dàng và hiệu quả.</p>
        </div>
        <div className="manage-customer-content">
          <Button
            type="primary"
            className="add-button"
            onClick={handleCreate}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
          {listCustomer && listCustomer.length > 0 ? (
            <Table
              className="manage-customer-table"
              columns={columns}
              dataSource={listCustomer}
              pagination={{
                defaultPageSize: 8,
                showSizeChanger: true,
                pageSizeOptions: ['8', '15', '25'],
              }}
              rowKey="user_id"
              scroll={{ x: 1500 }}
            />
          ) : (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
        </div>
        <ModalCustomer
          form={form}
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          action={action}
          dataModal={dataModal}
          fetchData={fetchData}
        />
      </Card>
    </div>
  );
};

export default ManageCustomer;