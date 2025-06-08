import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Spin,
  Popconfirm,
  Table,
  Typography,
  Card,
  Space,
  Tag,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa'
import './manage-staff.scss'
import ModalStaff from './modalStaff'
import staff from 'api/staff'
import { toast } from 'react-toastify'

const { Title } = Typography;


const StaffManage = () => {
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
    roles: 'staff', // Thêm trường roles với giá trị mặc định
    created_at: '',
  };
  const [listStaff, setListStaff] = useState([]);
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
      const data = (await staff.getAllStaff()).data;
      const modifiedData = data.map((item) => ({
        ...item,
        key: item.user_id,
        roles: item.roles || 'staff', // Đảm bảo có giá trị mặc định cho roles
        created_at: convertDate(item.created_at),
      }));
      setListStaff(modifiedData);
    } catch (error) {
      toast.error('Failed to fetch staff');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm render roles với màu sắc khác nhau
  const renderRoles = (roles) => {
    const roleConfig = {
      staff: { color: 'blue', text: 'Nhân viên' },
      doctor: { color: 'green', text: 'Bác sĩ' }
    }
    
    const config = roleConfig[roles] || { color: 'default', text: roles }
    return <Tag color={config.color}>{config.text}</Tag>
  }

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
      title: 'Tên nhân viên',
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
      title: 'Vai trò',
      dataIndex: 'roles',
      width: '100px',
      render: (roles) => renderRoles(roles),
      filters: [
        { text: 'Nhân viên', value: 'staff' },
        { text: 'Bác sĩ', value: 'doctor' },
      ],
      onFilter: (value, record) => record.roles === value,
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
        <button
          className="ml-3 p-2 text-orange-300 hover:text-orange-400 hover:bg-orange-50 rounded border transition-colors"
          onClick={() => {
            setAction('UPDATE');
            setDataModal(record);
            showModal();
          }}
        >
          <FaPen />
        </button>
      ),
      fixed: 'right',
    },
    {
      title: 'Xóa',
      key: 'delete',
      width: 90,
      render: (_, record) => (
        <Popconfirm
          title="Xóa nhân viên"
          description="Bạn có chắc chắn muốn xóa?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={async () => {
            await staff.deleteStaff(record.user_id);
            toast.success('Xóa nhân viên thành công!');
            fetchData();
          }}
        >
          <button className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border transition-colors">
            <FaTrashAlt />
          </button>
        </Popconfirm>
      ),
      fixed: 'right',
    },
  ];

  return (
    <div className="manage-page">
      <Card className="manage-card">
        <div className="manage-header">
          <Title level={2}>Quản lý nhân viên</Title>
          <p>Quản lý thông tin nhân viên một cách dễ dàng và hiệu quả.</p>
        </div>
        <div className="manage-content">
          <Button
            type="primary"
            className="add-button"
            onClick={handleCreate}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
          {listStaff && listStaff.length > 0 ? (
            <Table
              className="manage-table"
              columns={columns}
              dataSource={listStaff}
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
        <ModalStaff
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

export default StaffManage

