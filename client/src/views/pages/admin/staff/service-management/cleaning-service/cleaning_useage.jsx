import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Typography,
  Select,
  message,
  Input,
  Form,
  Row,
  Popconfirm,
  Modal,
  DatePicker,
} from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../index.css'
import beautyService from 'api/service/beauty-service'
import moment from 'moment'

const { Option } = Select
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa'
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <Input />
    ) : inputType === 'select' ? (
      <Select>
        <Option value="created">created</Option>
        <Option value="processing">processing</Option>
        <Option value="complete">completed</Option>
        <Option value="canceled">canceled</Option>
      </Select>
    ) : inputType === 'date' ? (
      <DatePicker format="YYYY-MM-DD" />
    ) : (
      <Input />
    )
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const BeautyServiceUsage = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [mode, setMode] = useState('create')

  useEffect(() => {
    beautyService
      .getAllBeautyService()
      .then((response) => {
        setData(response.data.AllBeauty)
        console.log(response)
      })
      .catch((error) => {
        message.error('Lỗi khi tải danh sách dịch vụ')
      })
  }, [])

  const isEditing = (record) => record.id === editingKey

  const edit = (record) => {
    console.log(record)
    form.setFieldsValue({
      user_id: record.user_id,
      date: moment(record.date).format('YYYY-MM-DD'),
      service_id: record.service_id,
      pet_id: record.pet_id,
      note: record.note,
      time_slot: record.time_slot,
      total: record.total,
      status: record.status,
    })
    setEditingKey(record.id)
    setMode('update')
  }

  const cancel = () => {
    setEditingKey('')
    if (mode === 'create') {
      setData((prevData) => prevData.filter((item) => item.id !== editingKey))
    }
  }

  const handleSave = async (id) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => id === item.id)

      if (mode === 'update') {
        const item = newData[index]
        const updatedItem = { ...item, ...row, id: item.id }
        newData.splice(index, 1, updatedItem)
        setData(newData)
        setEditingKey('')

        console.log(updatedItem)
        const updatePayload = {
          id: updatedItem.id,
          note: updatedItem.note,
          time_slot: updatedItem.time_slot,
          pet_id: updatedItem.pet_id,
          date: moment(updatedItem.date).format('YYYY-MM-DD'),
          status: updatedItem.status,
        }
        console.log(updatePayload)
        await beautyService.updateBeautyService(updatePayload)
        message.success('Cập nhật dịch vụ thành công!')
      } else if (mode === 'create') {
        const payload = {
          ...row,
          date: moment(row.date).format('YYYY-MM-DD'),
        }
        console.log(row)
        const response = await beautyService.createBeautyService(payload)
        const newItem = {
          ...payload,
          id: response.data.id,
          status: 'created',
        }

        newData[index] = newItem
        setData(newData)
        setEditingKey('')
        message.success('Thêm dịch vụ thành công!')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (id) => {
    try {
      await beautyService.deleteBeautyService({ id })
      const newServices = data.filter((item) => item.id !== id)
      setData(newServices)
      message.success('Xóa dịch vụ thành công!')
    } catch (error) {
      console.error('Error deleting record:', error)
      message.error('Lỗi khi xóa dịch vụ')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    console.log('Search value:', value)
    const filteredData = data.filter((service) => {
      return (
        service.order_pet_id &&
        service.order_pet_id.toString().toLowerCase().includes(value)
      )
    })
    setData(filteredData)
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split('-')
    console.log('Sort field and order:', field, order)
    const sorted = [...data].sort((a, b) => {
      if (moment(a[field]).isBefore(moment(b[field])))
        return order === 'ascend' ? -1 : 1
      if (moment(a[field]).isAfter(moment(b[field])))
        return order === 'ascend' ? 1 : -1
      return 0
    })
    setData(sorted)
  }

  const addNewRow = () => {
    const newRow = {
      id: '',
      order_pet_id: '',
      order_user_id: '',
      date: '',
      note: '',
      status: 'created',
      time_slot: 1,
      order_total: 100,
    }
    console.log('Adding new row:', newRow)
    setData([newRow, ...data])
    setEditingKey(newRow.id)
    setMode('create')
    form.setFieldsValue(newRow)
  }

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa dịch vụ?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Bạn sẽ không thể hoàn tác và xem lại được thông tin của dịch vụ.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id)
      },
      onCancel() {
        console.log('Cancel delete')
      },
    })
  }

  const columns = [
    { title: 'Service ID', dataIndex: 'id', key: 'id', editable: false },
    {
      title: 'Pet ID',
      dataIndex: 'order_pet_id',
      key: 'order_pet_id',
      editable: true,
    },
    {
      title: 'User ID',
      dataIndex: 'order_user_id',
      key: 'order_user_id',
      editable: true,
    },
    {
      title: 'Ngày dịch vụ',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      inputType: 'date',
      render: (text) => moment(text.toString()).format('YYYY-MM-DD'),
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', editable: true },
    {
      title: 'Thời gian',
      dataIndex: 'time_slot',
      key: 'time_slot',
      editable: true,
    },
    {
      title: 'Giá dịch vụ',
      dataIndex: 'order_total',
      key: 'order_total',
      editable: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      editable: true,
      inputType: 'select',
      render: (status) => (
        <span className={'status-tag ' + status}>{status}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a
              onClick={async () => {
                await handleSave(record.id)
              }}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <button
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              className="ml-3 p-2 text-orange-300 hover:text-orange-400 hover:bg-orange-50 rounded border transition-colors"
            >
              <FaPen />
            </button>
            <button
              onClick={() => showConfirm(record.service_id)}
              className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border  transition-colors"
            >
              <FaTrashAlt />
            </button>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <div>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Sử dụng dịch vụ vệ sinh
      </Typography.Title>
      <Space
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          marginLeft: 50,
          width: '100%',
        }}
      >
        <Form
          layout="inline"
          style={{
            border: '1px solid #d9d9d9',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <Form.Item label="ID thú cưng">
            <Input
              placeholder="Nhập id"
              style={{ width: 200 }}
              onChange={handleSearchChange}
              onPressEnter={handleSearchChange}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSearchChange}
            style={{ marginLeft: 8, marginRight: 10 }}
          >
            Tìm kiếm
          </Button>
        </Form>
      </Space>
      <Row
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Search Table
        </Typography.Title>
        <Space>
          <Select
            placeholder="Sắp xếp theo"
            style={{ width: 200 }}
            onChange={handleSortChange}
          >
            <Option value="date-ascend">Ngày dịch vụ (Tăng dần)</Option>
            <Option value="date-descend">Ngày dịch vụ (Giảm dần)</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewRow}>
            Thêm mới
          </Button>
        </Space>
      </Row>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Form>
    </div>
  )
}

export default BeautyServiceUsage
