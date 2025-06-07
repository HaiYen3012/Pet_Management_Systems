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
import service from 'api/service/storage-service'
import moment from 'moment'
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
  FaXbox,
} from 'react-icons/fa'
import { Fax } from '@mui/icons-material'
const { Option } = Select

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

const StorageServiceUsage = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [mode, setMode] = useState('create')

  useEffect(() => {
    service
      .getAllStorageService()
      .then((response) => {
        const updatedData = response.data.AllStorageService.map((item) => ({
          ...item,
          pet_id: item.order_pet_id,
          user_id: item.order_user_id,
          total: item.order_total,
        }))
        setData(updatedData)
        console.log(response.data.AllStorageService)
      })
      .catch((error) => {
        console.error('Failed to fetch storage services:', error)
        message.error('Failed to fetch storage services.')
      })
  }, [])

  const isEditing = (record) => record.id === editingKey

  const edit = (record) => {
    form.setFieldsValue({
      service_id: record.id,
      ...record,
      date_start: record.date_start
        ? moment(record.date_start.toString(), 'YYYY-MM-DD')
        : null,
      date_end: record.date_end
        ? moment(record.date_end.toString(), 'YYYY-MM-DD')
        : null,
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
      let row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => id === item.id)

      if (mode === 'update') {
        const item = newData[index]
        const updatedItem = { ...item, ...row, id: item.id }
        newData.splice(index, 1, updatedItem)
        setData(newData)
        setEditingKey('')

        const updatePayload = {
          service_id: updatedItem.id,
          room_id: updatedItem.room_id,
          date_start: moment(updatedItem.date_start.toString()).format(
            'YYYY-MM-DD',
          ),
          date_end: moment(updatedItem.date_end.toString()).format(
            'YYYY-MM-DD',
          ),
          note: updatedItem.note,
          pet_id: updatedItem.pet_id,
          status: updatedItem.status,
        }

        await service.updateStorageService(updatePayload)
        message.success('Cập nhật dịch vụ thành công!')
      } else if (mode === 'create') {
        row = {
          ...row,
          date_start: moment(row.date_start.toString()).format('YYYY-MM-DD'),
          date_end: moment(row.date_end.toString()).format('YYYY-MM-DD'),
        }
        await service.createStorageService(row)
        setData((prev) => [...prev, row])
        setEditingKey('')
        message.success('Thêm dịch vụ thành công!')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (id) => {
    try {
      await service.deleteStorageService({ service_id: id })
      const newServices = data.filter((item) => item.id !== id)
      setData(newServices)
      message.success('Xóa dịch vụ thành công!')
    } catch (error) {
      message.error('Xóa dịch vụ thất bại.')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    service
      .getAllStorageService()
      .then((response) => {
        const filteredData = response.data.AllStorageService.filter(
          (service) => {
            return (
              service.order_pet_id &&
              service.order_pet_id.toString().toLowerCase().includes(value)
            )
          },
        ).map((item) => ({
          ...item,
          pet_id: item.order_pet_id,
          user_id: item.order_user_id,
          total: item.order_total,
        }))
        setData(filteredData)
      })
      .catch((error) => {
        console.error('Failed to fetch storage services:', error)
        message.error('Failed to fetch storage services.')
      })
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split('-')
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
      room_id: '',
      pet_id: '',
      user_id: '',
      date_start: '',
      date_end: '',
      note: '',
      total: '',
      status: 'created',
    }
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
        console.log('Cancel')
      },
    })
  }

  const columns = [
    { title: 'Service ID', dataIndex: 'id', key: 'id', editable: false },
    { title: 'Room ID', dataIndex: 'room_id', key: 'room_id', editable: true },
    { title: 'Pet ID', dataIndex: 'pet_id', key: 'pet_id', editable: true },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id', editable: true },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'date_start',
      key: 'date_start',
      editable: true,
      inputType: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'date_end',
      key: 'date_end',
      editable: true,
      inputType: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', editable: true },
    { title: 'Giá dịch vụ', dataIndex: 'total', key: 'total', editable: true },
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
           <Space size="middle">
            <button
              onClick={async () => {
                await handleSave(record.id)
              }}
              className="ml-3 p-2 text-green-400 hover:text-green-500 hover:bg-green-50 rounded border transition-colors"
            >
              <FaSave />
            </button>
            <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                <button
             
              className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50  rounded border transition-colors"
            >
              <FaTimes />
            </button>
            </Popconfirm>
         </Space>
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
        Sử dụng dịch vụ
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
            <Option value="date_start-ascend">Ngày bắt đầu (Tăng dần)</Option>
            <Option value="date_start-descend">Ngày bắt đầu (Giảm dần)</Option>
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
          pagination={{ pageSize: 10 }}
        />
      </Form>
    </div>
  )
}

export default StorageServiceUsage
