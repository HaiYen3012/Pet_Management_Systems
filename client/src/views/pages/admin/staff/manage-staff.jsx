import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Spin,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
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

const StaffManage = () => {
  const [form] = Form.useForm()
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
  }
  const [listStaff, setListStaff] = useState(dataModalDefault)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState('')
  const [dataModal, setDataModal] = useState({})

  const handleOk = () => {
    setIsModalOpen(false)
    setAction('')
    setDataModal(dataModalDefault)
    form.resetFields()
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setDataModal(dataModalDefault)
    setAction('')
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleCreate = () => {
    setDataModal(dataModalDefault)
    setAction('CREATE')
    showModal()
  }

  const convertDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `
    return formattedDate
  }

  const fetchData = async () => {
    const data = (await staff.getAllStaff()).data
    const modifiedData = data.map((item) => {
      let newItem = {
        ...item,
        key: item.user_id,
        roles: item.roles || 'staff', // Đảm bảo có giá trị mặc định cho roles
        created_at: convertDate(item.created_at),
      }
      return newItem
    })
    setListStaff(modifiedData)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.user_id - b.user_id,
      fixed: 'left',
      width: '60px',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullname',
      fixed: 'left',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      width: '140px',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '220px',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_numbers',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'country',
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
    },
    {
      title: 'Cập nhật',
      width: 95,
      render: (text, record) => {
        const handleUpdate = () => {
          setAction('UPDATE')
          setDataModal(record)
          showModal()
        }
        return (
          <button
            className="ml-3 p-2 text-orange-300 hover:text-orange-400 hover:bg-orange-50 rounded border transition-colors"
            onClick={() => handleUpdate()}
          >
            <FaPen />
          </button>
        )
      },
      fixed: 'right',
    },
    {
      title: 'Xóa',
      width: 90,
      render: (text, record) => {
        const handleDelete = async () => {
          console.log(record)
          await staff.deleteStaff(record.user_id)
          toast.success('Xóa nhân viên thành công!')
          fetchData()
        }
        return (
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete()}
          >
            <button className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border  transition-colors">
              <FaTrashAlt />
            </button>
          </Popconfirm>
        )
      },
      fixed: 'right',
    },
  ]

  return (
    <>
      <div className="manage-customer__container">
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Typography.Title level={2}>Quản lý nhân viên</Typography.Title>
          <br />
          <br />
        </Space>

        <div className="manage-customer__content">
          <Button
            onClick={handleCreate}
            type="primary"
            style={{ marginBottom: 16, width: '100px' }}
          >
            <PlusOutlined/>
            Thêm
          </Button>
          {listStaff && listStaff.length > 0 ? (
            <Table
              columns={columns}
              dataSource={listStaff}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30'],
              }}
              bordered
              scroll={{
                x: 1500,
              }}
            />
          ) : (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
              style={{
                height: '100vh',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          )}
        </div>
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
    </>
  )
}

export default StaffManage