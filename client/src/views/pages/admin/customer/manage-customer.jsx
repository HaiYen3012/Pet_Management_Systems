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
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import './manage-customer.scss'
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa'
import ModalCustomer from './modal-add-edit'
import user from 'api/user'
import { toast } from 'react-toastify'

const ManageCustomer = () => {
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
    created_at: '',
  }
  const [listCustomer, setListCustomer] = useState(dataModalDefault)
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
    const data = (await user.getAllCustomer()).data
    const modifiedData = data.map((item) => {
      let newItem = {
        ...item,
        key: item.user_id,
        created_at: convertDate(item.created_at),
      }
      return newItem
    })
    setListCustomer(modifiedData)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      title: 'Tên khách hàng',
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
          // THAY ĐỔI: Chuyển từ màu cam sang màu vàng
          <button
            className="ml-3 p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded border transition-colors"
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
          await user.deleteUser(record.user_id)
          toast.success('Xóa khách hàng thành công!')
          fetchData()
        }
        return (
          <Popconfirm
            title="Xóa khách hàng"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete()}
          >
            {/* GIỮ NGUYÊN: Màu đỏ cho hành động nguy hiểm */}
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
          <Typography.Title level={2}>Quản lý khách hàng</Typography.Title>
          <br />
          <br />
        </Space>

        <div className="manage-customer__content">
          {/* THAY ĐỔI: Chuyển nút primary sang màu vàng */}
          <Button
            onClick={handleCreate}
            type="primary"
            style={{
              marginBottom: 16,
              width: '100px',
              backgroundColor: '#fadb14', // Màu vàng của antd
              borderColor: '#fadb14',
              color: '#000', // Màu chữ đen để dễ đọc trên nền vàng
            }}
          >
            <PlusOutlined />
            Thêm
          </Button>
          {listCustomer && listCustomer.length > 0 ? (
            <Table
              columns={columns}
              dataSource={listCustomer}
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
              // THAY ĐỔI: Chuyển icon loading sang màu vàng
              indicator={
                <LoadingOutlined style={{ fontSize: 30, color: '#fadb14' }} spin />
              }
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

      <ModalCustomer
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

export default ManageCustomer