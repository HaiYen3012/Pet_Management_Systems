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
  Card,
} from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../index.css'
import MedicalService from 'api/service/medical'
import moment from 'moment'
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa'

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

const MedicalServiceUsage = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [mode, setMode] = useState('create')

  useEffect(() => {
    MedicalService.getAllAppointmentbyUserSession()
      .then((response) => {
        const updatedData = response.data.allAppointment.map((item) => ({
          ...item,
        }))
        setData(updatedData)
      })
      .catch((error) => {
        console.error('Failed to fetch medical services:', error)
        message.error('Failed to fetch medical services.')
      })
  }, [])

  const isEditing = (record) => record.id === editingKey

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      date: moment(record.date.toString(), 'YYYY-MM-DD'),
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
          id: updatedItem.id,
          date: moment(updatedItem.date.toString()).format('YYYY-MM-DD'),
          note: updatedItem.note,
          pet_id: updatedItem.pet_id,
          status: updatedItem.status,
          time_slot: updatedItem.time_slot,
        }

        await MedicalService.updateAppointment(updatePayload)

        message.success('Cập nhật dịch vụ thành công!')
      } else if (mode === 'create') {
        console.log('rowww: ', row)
        row = {
          ...row,
          date: moment(row.date.toString()).format('YYYY-MM-DD'),
        }
        await MedicalService.createAppointment(row)
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
      await MedicalService.deleteAppointment({ id })
      const newServices = data.filter((item) => item.id !== id)
      setData(newServices)
      message.success('Xóa dịch vụ thành công!')
    } catch (error) {
      message.error('Xóa dịch vụ thất bại.')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    MedicalService.getAllAppointmentbyUserSession()
      .then((response) => {
        const filteredData = response.data.allAppointment
          .filter((service) => {
            return (
              service.pet_id &&
              service.pet_id.toString().toLowerCase().includes(value)
            )
          })
          .map((item) => ({
            ...item,
          }))
        setData(filteredData)
      })
      .catch((error) => {
        console.error('Failed to fetch medical services:', error)
        message.error('Failed to fetch medical services.')
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
      date: '',
      note: '',
      pet_id: '',
      user_id: '',
      service_id: '',
      time_slot: '',
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
    { title: 'Pet ID', dataIndex: 'pet_id', key: 'pet_id', editable: true },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id', editable: true },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      inputType: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', editable: true },
    {
      title: 'Thời gian khám',
      dataIndex: 'time_slot',
      key: 'time_slot',
      editable: true,
    },
    { title: 'Tổng cộng', dataIndex: 'total', key: 'total', editable: true },
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
    <div className="manage-page">
      <Card className="manage-card">
        <div className="manage-header">
          <Typography.Title level={2}>Sử dụng dịch vụ y tế</Typography.Title>
          <p>
            Quản lý và theo dõi các lịch hẹn dịch vụ y tế một cách hiệu quả.
          </p>
        </div>
        
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
              <Option value="date-ascend">Ngày khám (Tăng dần)</Option>
              <Option value="date-descend">Ngày khám (Giảm dần)</Option>
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
      </Card>
    </div>
  )
}

export default MedicalServiceUsage
