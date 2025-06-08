import React, { useState, useEffect } from 'react'
import {
  Modal,
  Card,
  Avatar,
  Table,
  Button,
  Typography,
  Divider,
  Input,
  Select,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AddDietPlan from 'components/add-diet-plan'
import { formatTimeMealToVN, formatTimeMealToE } from 'helpers/formatMeal'

import pet from 'api/pet'
import diet from 'api/diet'
import { formatDateIsoString, formatDateToYYYYMMDD } from 'helpers/formartdate'
import { toast } from 'react-toastify'
const { Meta } = Card
const { Option } = Select

const EditableField = ({
  value,
  isEditing,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyDown,
}) =>
  isEditing ? (
    <Input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus
      style={{ 
        borderColor: '#fadb14',
        boxShadow: '0 0 0 2px rgba(250, 219, 20, 0.2)',
        color: '#8b5a00'
      }}
    />
  ) : (
    <div
      onDoubleClick={onDoubleClick}
      style={{ 
        display: 'inline-block', 
        marginLeft: 8,
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: '#8b5a00',
        fontWeight: '500'
      }}
      className="hover:bg-yellow-50"
    >
      {value}
    </div>
  )

const DietPlanModal = ({ visible, onCancel, selectedPet, onSave }) => {
  const [isEditing, setIsEditing] = useState({})
  const [editableFields, setEditableFields] = useState({})
  const [initialFields, setInitialFields] = useState({})
  const [data, setData] = useState([])
  const [initialData, setInitialData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [editingColumn, setEditingColumn] = useState('')
  const [plan, setPlan] = useState({})
  const [food, setFood] = useState([])
  const [error, setError] = useState(false)
  const [visibleAddPlan, setVisibleAddPlan] = useState(false);
  const [addFood, setAddFood] = useState(false)
  const [update, setUpdate] = useState(false)

  const handleAddFood = () => {
    setVisibleAddPlan(true)
    setAddFood(true)
    setUpdate(false)
  }
  const handleCancel = () => {
    setAddFood(false)
    setVisibleAddPlan(false)
  }
  const handleShowAddModal = () => {
    setVisibleAddPlan(true)
  }

  useEffect(() => {
    setUpdate(false)
    setError(false)
    if (selectedPet && selectedPet.pet_id) {
      diet
        .getDietFood(selectedPet.pet_id)
        .then((res) => {
          console.log('API Response:', res.data)
          setFood(res.data)
          if (res.data && res.data.length > 0) {
            const petData = res.data.map((item, index) => ({
              ...item,
              time: formatTimeMealToVN(item.time),
              key: index + 1,
              food_id: item.food_id || item.id,
            }))
            console.log('Mapped petData:', petData)
            setData(petData)
            setInitialData(petData)
          } else {
            setData([])
          }
        })
        .catch((error) => {
          console.error('Error fetching diet food:', error)
          setData([])
          setInitialData([])
          setInitialFields({})
          setEditableFields({})
          setInitialData({})
        })

      diet
        .getDietPlan(selectedPet.pet_id)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPlan(res.data[0])
            const fields = {
              dietName: res.data[0]?.name,
              dietDescription: res.data[0]?.description,
              date_start: `${formatDateIsoString(res.data[0]?.date_start)}`,
              date_end: `${formatDateIsoString(res.data[0]?.date_end)}`,
              applicationTime: `${formatDateIsoString(res.data[0]?.date_start)} - ${formatDateIsoString(res.data[0]?.date_end)}`,
            }
            setEditableFields(fields)
            setInitialFields(fields)
          } else {
            setError(true)
            setPlan({})
            const fields = {
              dietName: 'không có dữ liệu',
              applicationTime: 'không có dữ liệu',
            }
            setEditableFields(fields)
            setInitialFields(fields)
          }
        })
        .catch((error) => {
          console.error('Error fetching diet plan:', error)
          setError(true)
          setInitialFields({})
          setEditableFields({})
          setInitialData({})
        })
    }
  }, [selectedPet, update])

  if (error) {
    return (
      <Modal
        style={{ top: 20 }}
        title={
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            color: '#8b5a00',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fff9c4 0%, #fef3c7 100%)',
            margin: '-24px -24px 0 -24px',
            padding: '20px 24px',
            borderRadius: '8px 8px 0 0'
          }}>
            HỒ SƠ CHẾ ĐỘ ĂN
          </div>
        }
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        bodyStyle={{ 
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          minHeight: '60vh'
        }}
      >
        <Divider style={{ borderColor: '#fadb14', margin: '16px 0' }} />
        <div className="flex flex-col justify-between min-h-[60vh]" style={{ padding: '20px' }}>
          <div>
            <Button 
              icon={<PlusOutlined />} 
              onClick={handleShowAddModal} 
              type="primary"
              size="large"
              style={{ 
                background: 'linear-gradient(135deg, #fadb14 0%, #f59e0b 100%)',
                borderColor: '#fadb14',
                color: '#8b5a00',
                fontWeight: 'bold',
                height: '48px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(250, 219, 20, 0.3)'
              }}
              className="hover:shadow-lg transition-all duration-300"
            >
              Thêm kế hoạch ăn uống
            </Button>
            <AddDietPlan
              addFood={addFood}
              visible={visibleAddPlan}
              onCancel={handleCancel}
              selectedPet={selectedPet}
              setUpdate={setUpdate}
            />
          </div>
          <div className="flex justify-center items-center flex-1 text-xl w-full">
            <div style={{ 
              textAlign: 'center',
              color: '#dc2626',
              background: 'rgba(254, 202, 202, 0.8)',
              padding: '40px',
              borderRadius: '12px',
              border: '2px dashed #f87171'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Thú cưng hiện không có chế độ ăn nào
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  const handleDoubleClick = (field) => setIsEditing({ [field]: true })
  const handleChange = (field, value) =>
    setEditableFields({ ...editableFields, [field]: value })
  const handleBlur = (field) => setIsEditing({ [field]: false })
  const handleKeyDown = (field, e) => e.key === 'Enter' && handleBlur(field)

  const isEditingCell = (record, column) =>
    record.key === editingKey && column === editingColumn
  const editCell = (record, column) => {
    setEditingKey(record.key)
    setEditingColumn(column)
  }
  const saveCell = () => {
    setEditingKey('')
    setEditingColumn('')
  }

  const handleCellChange = (e, key, column) => {
    const newData = [...data]
    const index = newData.findIndex((item) => key === item.key)
    if (index > -1) {
      newData[index][column] = e.target.value
      setData(newData)
    }
  }

  const columns = [
    { title: 'STT', dataIndex: 'key', key: 'key', width: '10%' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time', width: '20%' },
    { title: 'Tên thực phẩm', dataIndex: 'name', key: 'name', width: '20%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Số lượng', dataIndex: 'amount', key: 'amount', width: '15%' },
    { title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit', width: '15%' },
  ].map((col) => ({
    ...col,
    render: (text, record) =>
      isEditingCell(record, col.dataIndex) ? (
        <Input
          value={text}
          onChange={(e) => handleCellChange(e, record.key, col.dataIndex)}
          onBlur={saveCell}
          onKeyDown={(e) => e.key === 'Enter' && saveCell()}
          autoFocus
          style={{ 
            borderColor: '#fadb14',
            boxShadow: '0 0 0 2px rgba(250, 219, 20, 0.2)',
            color: '#8b5a00'
          }}
        />
      ) : (
        <div 
          onDoubleClick={() => editCell(record, col.dataIndex)}
          style={{ 
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            color: '#8b5a00',
            fontWeight: '500'
          }}
          className="hover:bg-yellow-50"
        >
          {text}
        </div>
      ),
  }))

  const handleSave = () => {
    const dietPlanNe = {
      name: editableFields.dietName,
      description: editableFields.dietDescription,
      date_start: formatDateToYYYYMMDD(editableFields.date_start),
      date_end: formatDateToYYYYMMDD(editableFields.date_end),
    }

    diet.updateDietPlan(selectedPet.pet_id, dietPlanNe).then((res) => {
      console.log(res)
      toast.success('Cập nhật thành công! 🎉')
    })
    
    data.forEach((row) => {
      if (!row.food_id) {
        console.error('Food ID is missing for row:', row)
        toast.error(`Không thể cập nhật thực phẩm ${row.name}: thiếu ID`)
        return
      }

      const foodNe = {
        name: row.name,
        amount: row.amount,
        unit: row.unit,
        description: row.description,
        time: formatTimeMealToE(row.time),
      }
      
      console.log('Updating food item:', row.food_id, foodNe)
      
      diet
        .updateDietFood(selectedPet.pet_id, row.food_id, foodNe)
        .then((res) => {
          console.log('Food update success:', res)
        })
        .catch((error) => {
          console.error('Food update error:', error)
          toast.error(`Lỗi cập nhật thực phẩm ${row.name}`)
        })
    })

    setInitialFields(editableFields)
    setInitialData(data)
    onSave && onSave(editableFields, data)
  }

  return (
    <Modal
      style={{ top: 20 }}
      title={
        <div style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          color: '#8b5a00',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fff9c4 0%, #fef3c7 100%)',
          margin: '-24px -24px 0 -24px',
          padding: '20px 24px',
          borderRadius: '8px 8px 0 0'
        }}>
          CHỈNH SỬA CHẾ ĐỘ ĂN
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      bodyStyle={{ 
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        padding: 0
      }}
    >
      <Divider style={{ borderColor: '#fadb14', margin: '16px 0' }} />
      <div style={{ padding: 24, minHeight: 360 }}>
        {selectedPet && (
          <div
            className="items-center"
            style={{ 
              display: 'flex', 
              marginBottom: 24,
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #fadb14',
              boxShadow: '0 4px 12px rgba(250, 219, 20, 0.2)'
            }}
          >
            <Avatar
              src={selectedPet.imgUrl || '/avatarpet1.png'}
              size={150}
              style={{ 
                marginRight: 24,
                border: '4px solid #fadb14',
                boxShadow: '0 4px 12px rgba(250, 219, 20, 0.3)'
              }}
            />
            <Card 
              style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #fff9c4 0%, #ffffff 100%)',
                border: '1px solid #fadb14',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(250, 219, 20, 0.1)'
              }}
            >
              <Meta
                title={
                  <p className="uppercase text-xl" style={{ color: '#8b5a00', fontWeight: 'bold' }}>
                    <EditableField
                      value={editableFields['dietName']}
                      isEditing={isEditing['dietName']}
                      onDoubleClick={() => handleDoubleClick('dietName')}
                      onChange={(e) => handleChange('dietName', e.target.value)}
                      onBlur={() => handleBlur('dietName')}
                      onKeyDown={(e) => handleKeyDown('dietName', e)}
                    />
                  </p>
                }
                description={
                  <div className="Diet-title" style={{ color: '#8b5a00' }}>
                    <p style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#f59e0b', fontSize: '16px' }}>
                        Chế độ ăn:
                      </strong>
                      <EditableField
                        value={editableFields['dietDescription']}
                        isEditing={isEditing['dietDescription']}
                        onDoubleClick={() => handleDoubleClick('dietDescription')}
                        onChange={(e) => handleChange('dietDescription', e.target.value)}
                        onBlur={() => handleBlur('dietDescription')}
                        onKeyDown={(e) => handleKeyDown('dietDescription', e)}
                      />
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#f59e0b', fontSize: '16px' }}>
                        Thời gian áp dụng:
                      </strong>
                      <EditableField
                        value={editableFields.date_start}
                        isEditing={isEditing['date_start']}
                        onDoubleClick={() => handleDoubleClick('date_start')}
                        onChange={(e) => handleChange('date_start', e.target.value)}
                        onBlur={() => handleBlur('date_start')}
                        onKeyDown={(e) => handleKeyDown('date_start', e)}
                      />
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>→</span>
                      <EditableField
                        value={editableFields.date_end}
                        isEditing={isEditing['date_end']}
                        onDoubleClick={() => handleDoubleClick('date_end')}
                        onChange={(e) => handleChange('date_end', e.target.value)}
                        onBlur={() => handleBlur('date_end')}
                        onKeyDown={(e) => handleKeyDown('date_end', e)}
                      />
                    </p>
                  </div>
                }
              />
            </Card>
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <Button 
            icon={<PlusOutlined />} 
            onClick={handleAddFood} 
            type='primary'
            size="large"
            style={{ 
              background: 'linear-gradient(135deg, #fadb14 0%, #f59e0b 100%)',
              borderColor: '#fadb14',
              color: '#8b5a00',
              fontWeight: 'bold',
              height: '48px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(250, 219, 20, 0.3)'
            }}
            className="hover:shadow-lg transition-all duration-300"
          >
            Thêm thực phẩm
          </Button>
          <AddDietPlan
            addFood={addFood}
            visible={visibleAddPlan}
            onCancel={handleCancel}
            selectedPet={selectedPet}
            setUpdate={setUpdate}
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ 
            pageSize: 3,
            style: { 
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '8px'
            }
          }}
          style={{ 
            marginBottom: 16,
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #fadb14',
            boxShadow: '0 2px 8px rgba(250, 219, 20, 0.1)'
          }}
          className="custom-table"
        />
        
        <div style={{ 
          textAlign: 'right',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #fadb14'
        }}>
          <Button
            type="primary"
            style={{ 
              marginRight: 8,
              background: 'linear-gradient(135deg, #fadb14 0%, #f59e0b 100%)',
              borderColor: '#fadb14',
              color: '#8b5a00',
              fontWeight: 'bold',
              height: '40px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(250, 219, 20, 0.3)'
            }}
            onClick={handleSave}
            className="hover:shadow-lg transition-all duration-300"
          >
            Lưu thay đổi
          </Button>
          <Button 
            onClick={onCancel}
            style={{ 
              color: '#8b5a00',
              borderColor: '#fadb14',
              height: '40px',
              borderRadius: '6px'
            }}
            className="hover:bg-yellow-50 transition-all duration-300"
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DietPlanModal