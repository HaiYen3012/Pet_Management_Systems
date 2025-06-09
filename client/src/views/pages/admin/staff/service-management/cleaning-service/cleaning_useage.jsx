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

const BeautyServiceUsage = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([]) // Thêm state để lưu dữ liệu gốc cho search
  const [editingKey, setEditingKey] = useState('')
  const [mode, setMode] = useState('create')

  useEffect(() => {
    beautyService
      .getAllBeautyService()
      .then((response) => {
        setData(response.data.AllBeauty)
        setOriginalData(response.data.AllBeauty) // Lưu dữ liệu gốc
        console.log(response)
      })
      .catch((error) => {
        message.error('Lỗi khi tải danh sách dịch vụ')
      })
  }, [])

  const isEditing = (record) => record.id === editingKey

  const edit = (record) => {
    console.log('Editing record:', record)
    form.setFieldsValue({
      order_user_id: record.order_user_id,
      date: record.date ? moment(record.date) : null, // Sử dụng moment object cho DatePicker
      service_id: record.service_id,
      order_pet_id: record.order_pet_id,
      note: record.note,
      time_slot: record.time_slot,
      order_total: record.order_total,
      status: record.status,
    })
    setEditingKey(record.id)
    setMode('update')
  }

  const cancel = () => {
    setEditingKey('')
    if (mode === 'create') {
      // Xóa dòng tạm thời nếu đang ở chế độ create
      setData((prevData) => prevData.filter((item) => !item.id.toString().startsWith('temp_')))
    }
    setMode('create')
    form.resetFields()
  }

  const handleSave = async (id) => {
    try {
      const row = await form.validateFields()
      console.log('Form values:', row)
      
      const newData = [...data]
      const index = newData.findIndex((item) => id === item.id)

      if (mode === 'update') {
        const item = newData[index]
        const updatedItem = { 
          ...item, 
          ...row, 
          id: item.id,
          date: row.date ? row.date.format('YYYY-MM-DD') : item.date // Format date properly
        }
        newData.splice(index, 1, updatedItem)
        setData(newData)
        setOriginalData(newData) // Cập nhật originalData
        setEditingKey('')

        console.log('Updated item:', updatedItem)
        const updatePayload = {
          id: updatedItem.id,
          note: updatedItem.note,
          time_slot: updatedItem.time_slot,
          pet_id: updatedItem.order_pet_id,
          date: updatedItem.date,
          status: updatedItem.status,
        }
        console.log('Update payload:', updatePayload)
        await beautyService.updateBeautyService(updatePayload)
        message.success('Cập nhật dịch vụ thành công!')
      } else if (mode === 'create') {
        const payload = {
          ...row,
          date: row.date ? row.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
          pet_id: row.order_pet_id,
          user_id: row.order_user_id,
          total: row.order_total || 100
        }
        console.log('Create payload:', payload)
        
        const response = await beautyService.createBeautyService(payload)
        const newItem = {
          ...row,
          id: response.data.id || response.data.newBeautyService?.id || Date.now(),
          date: payload.date,
          status: row.status || 'created',
          order_pet_id: row.order_pet_id,
          order_user_id: row.order_user_id,
          order_total: row.order_total
        }

        // Thay thế dòng tạm thời bằng dữ liệu thực
        newData.splice(index, 1, newItem)
        setData(newData)
        setOriginalData(newData) // Cập nhật originalData
        setEditingKey('')
        message.success('Thêm dịch vụ thành công!')
      }
      setMode('create')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
      message.error('Có lỗi xảy ra khi lưu dữ liệu')
    }
  }

  const handleDelete = async (id) => {
    try {
      await beautyService.deleteBeautyService({ id })
      const newServices = data.filter((item) => item.id !== id)
      setData(newServices)
      setOriginalData(newServices) // Cập nhật originalData
      message.success('Xóa dịch vụ thành công!')
    } catch (error) {
      console.error('Error deleting record:', error)
      message.error('Lỗi khi xóa dịch vụ')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    console.log('Search value:', value)
    
    if (value === '') {
      setData(originalData) // Reset về dữ liệu gốc khi search rỗng
    } else {
      const filteredData = originalData.filter((service) => {
        return (
          service.order_pet_id &&
          service.order_pet_id.toString().toLowerCase().includes(value)
        )
      })
      setData(filteredData)
    }
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split('-')
    console.log('Sort field and order:', field, order)
    const sorted = [...data].sort((a, b) => {
      const dateA = moment(a[field])
      const dateB = moment(b[field])
      
      if (dateA.isBefore(dateB)) return order === 'ascend' ? -1 : 1
      if (dateA.isAfter(dateB)) return order === 'ascend' ? 1 : -1
      return 0
    })
    setData(sorted)
  }

  const addNewRow = () => {
    const newId = 'temp_' + Date.now()
    const newRow = {
      id: newId,
      order_pet_id: '',
      order_user_id: '',
      date: moment().format('YYYY-MM-DD'),
      note: '',
      status: 'created',
      time_slot: 1,
      order_total: 100,
    }
    console.log('Adding new row:', newRow)
    setData([newRow, ...data])
    setEditingKey(newId)
    setMode('create')
    
    // Set form values với moment object cho DatePicker
    form.setFieldsValue({
      ...newRow,
      date: moment() // DatePicker cần moment object
    })
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
    { 
      title: 'Service ID', 
      dataIndex: 'id', 
      key: 'id', 
      editable: false
    },
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
      render: (text) => {
        if (!text) return '';
        return moment(text).format('YYYY-MM-DD');
      },
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
              onClick={() => handleSave(record.id)}
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
              onClick={() => showConfirm(record.id)}
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
            Sử dụng dịch vụ vệ sinh
          </Typography.Title>
          <p style={{
            color: '#cd853f',
            fontSize: '16px',
            margin: 0,
            fontWeight: '500'
          }}>
            Quản lý và theo dõi các lịch hẹn dịch vụ vệ sinh một cách hiệu quả
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
              <Option value="date-ascend">Ngày dịch vụ (Tăng dần)</Option>
              <Option value="date-descend">Ngày dịch vụ (Giảm dần)</Option>
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
            rowKey="id"
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

export default BeautyServiceUsage