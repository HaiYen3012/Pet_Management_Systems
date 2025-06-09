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
      <Input style={{ borderColor: '#ffd700', borderRadius: '12px' }} />
    ) : inputType === 'select' ? (
      <Select style={{ borderRadius: '12px' }}>
        <Option value="created">created</Option>
        <Option value="processing">processing</Option>
        <Option value="complete">completed</Option>
        <Option value="canceled">canceled</Option>
      </Select>
    ) : inputType === 'date' ? (
      <DatePicker 
        format="YYYY-MM-DD" 
        style={{ borderColor: '#ffd700', borderRadius: '12px' }}
      />
    ) : (
      <Input style={{ borderColor: '#ffd700', borderRadius: '12px' }} />
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
      render: (status) => {
        let statusColor = '';
        let bgColor = '';
        let borderColor = '';
        
        switch(status) {
          case 'created':
            statusColor = '#1890ff';
            bgColor = '#e6f7ff';
            borderColor = '#91d5ff';
            break;
          case 'processing':
            statusColor = '#fa8c16';
            bgColor = '#fff7e6';
            borderColor = '#ffd591';
            break;
          case 'complete':
            statusColor = '#52c41a';
            bgColor = '#f6ffed';
            borderColor = '#b7eb8f';
            break;
          case 'canceled':
            statusColor = '#ff4d4f';
            bgColor = '#fff2f0';
            borderColor = '#ffb3b3';
            break;
          default:
            statusColor = '#b8860b';
            bgColor = '#fff8dc';
            borderColor = '#ffd700';
        }
        
        return (
          <span style={{
            backgroundColor: bgColor,
            color: statusColor,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            border: `1px solid ${borderColor}`
          }}>{status}</span>
        );
      },
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
                color: '#ffa500',
                fontWeight: '500'
              }}
            >
              Lưu
            </a>
            <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
              <a style={{ color: '#ff8c00', fontWeight: '500' }}>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <button
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
                marginLeft: '12px',
                padding: '8px 12px',
                color: '#ff8c00',
                backgroundColor: '#fff8dc',
                border: '1px solid #ffd700',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ffebcd';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff8dc';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <FaPen />
            </button>
            <button
              onClick={() => showConfirm(record.service_id)}
              style={{
                marginLeft: '12px',
                padding: '8px 12px',
                color: '#cd853f',
                backgroundColor: '#ffefd5',
                border: '1px solid #daa520',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ffe4b5';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffefd5';
                e.target.style.transform = 'scale(1)';
              }}
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
          <Typography.Title level={2} style={{
            color: '#b8860b',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(255, 215, 0, 0.3)'
          }}>
            Sử dụng dịch vụ lưu trữ
          </Typography.Title>
          <p style={{
            color: '#cd853f',
            fontSize: '16px',
            margin: 0,
            fontWeight: '500'
          }}>
            Quản lý và theo dõi các dịch vụ lưu trữ thú cưng một cách hiệu quả
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
              background: 'linear-gradient(45deg, #fff8dc, #ffebcd)',
              border: '2px solid #ffd700',
              padding: '15px',
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2)'
            }}
          >
            <Form.Item label={<span style={{ color: '#b8860b', fontWeight: '600' }}>ID thú cưng</span>}>
              <Input
                placeholder="Nhập id"
                style={{ 
                  width: 200,
                  borderColor: '#ffd700',
                  borderRadius: '12px',
                  backgroundColor: '#fffacd'
                }}
                onChange={handleSearchChange}
                onPressEnter={handleSearchChange}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleSearchChange}
              style={{ 
                marginLeft: 8, 
                marginRight: 10,
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                borderColor: '#ffd700',
                borderRadius: '12px',
                fontWeight: '600',
                height: '38px'
              }}
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
            padding: '0 20px'
          }}
        >
          <Typography.Title level={3} style={{ 
            marginBottom: 0,
            color: '#b8860b',
            textShadow: '1px 1px 2px rgba(255, 215, 0, 0.3)'
          }}>
            Search Table
          </Typography.Title>
          <Space>
            <Select
              placeholder="Sắp xếp theo"
              style={{ 
                width: 200,
                borderRadius: '12px'
              }}
              onChange={handleSortChange}
            >
              <Option value="date_start-ascend">Ngày bắt đầu (Tăng dần)</Option>
              <Option value="date_start-descend">Ngày bắt đầu (Giảm dần)</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addNewRow}
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                borderColor: '#ffd700',
                borderRadius: '12px',
                fontWeight: '600',
                height: '38px',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
              }}
            >
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
            pagination={{ 
              pageSize: 10,
              style: {
                padding: '20px'
              }
            }}
            style={{
              background: '#fffacd',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #ffd700'
            }}
          />
        </Form>
      </Card>
    </div>
  )
}

export default StorageServiceUsage