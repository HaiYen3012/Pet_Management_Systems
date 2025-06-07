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
    />
  ) : (
    <div
      onDoubleClick={onDoubleClick}
      style={{ display: 'inline-block', marginLeft: 8 }}
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
          console.log('API Response:', res.data) // Debug log
          setFood(res.data)
          if (res.data && res.data.length > 0) {
            const petData = res.data.map((item, index) => ({
              ...item, // Giữ lại tất cả properties từ API, bao gồm food_id
              time: formatTimeMealToVN(item.time),
              key: index + 1,
              // Đảm bảo food_id được preserve
              food_id: item.food_id || item.id, // Fallback nếu API trả về 'id' thay vì 'food_id'
            }))
            console.log('Mapped petData:', petData) // Debug log
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
        style={{ top: 0 }}
        title={
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
            HỒ SƠ BỆNH ÁN
          </span>
        }
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
      >
        <Divider />
        <div className="flex flex-col justify-between min-h-[60vh]">
          <div>
            <Button icon={<PlusOutlined />} onClick={handleShowAddModal} type="primary">
              Thêm kế hoạch ăn uống{' '}
            </Button>
            <AddDietPlan
              addFood = {addFood}
              visible={visibleAddPlan}
              onCancel={handleCancel}
              selectedPet={selectedPet}
              setUpdate={setUpdate}
            />
          </div>
          <div className="flex justify-center items-center flex-1 text-red-500 text-xl w-full">
            Thú cưng hiện không có chế độ ăn nào
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
        />
      ) : (
        <div onDoubleClick={() => editCell(record, col.dataIndex)}>{text}</div>
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
      toast.success('cập nhật thành công')
    })
    
    // Validate và update từng food item
    data.forEach((row) => {
      // Kiểm tra food_id có tồn tại và hợp lệ
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
      
      console.log('Updating food item:', row.food_id, foodNe) // Debug log
      
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
    // onCancel()
  }

  return (
    <Modal
      style={{ top: 0 }}
      title={
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Chế độ ăn</span>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Divider />
      <div style={{ padding: 24, minHeight: 360 }}>
        {selectedPet && (
          <div
            className="items-center"
            style={{ display: 'flex', marginBottom: 24 }}
          >
            <Avatar
              src={selectedPet.imgUrl || '/image.png'}
              size={150}
              style={{ marginRight: 24 }}
            />
            <Card style={{ flex: 1 }}>
              <Meta
                title={
                  <p className="uppercase text-xl font-bold">
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
                  <div className="Diet-title">
                    <p>
                      <strong className="w-[250px] ">Chế độ ăn:</strong>
                      <EditableField
                        value={editableFields['dietDescription']}
                        isEditing={isEditing['dietDescription']}
                        onDoubleClick={() =>
                          handleDoubleClick('dietDescription')
                        }
                        onChange={(e) =>
                          handleChange('dietDescription', e.target.value)
                        }
                        onBlur={() => handleBlur('dietDescription')}
                        onKeyDown={(e) => handleKeyDown('dietDescription', e)}
                      />
                    </p>
                    <p className="">
                      <strong className="w-[250px] flex flex-row gap-3">
                        Thời gian áp dụng:
                      </strong>
                      <EditableField
                        value={editableFields.date_start}
                        isEditing={isEditing['date_start']}
                        onDoubleClick={() => handleDoubleClick('date_start')}
                        onChange={(e) =>
                          handleChange('date_start', e.target.value)
                        }
                        onBlur={() => handleBlur('date_start')}
                        onKeyDown={(e) => handleKeyDown('date_start', e)}
                      />
                      <span>-</span>
                      <EditableField
                        value={editableFields.date_end}
                        isEditing={isEditing['date_end']}
                        onDoubleClick={() => handleDoubleClick('date_end')}
                        onChange={(e) =>
                          handleChange('date_end', e.target.value)
                        }
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
        <div>
          <Button icon={<PlusOutlined />} onClick={handleAddFood} type='primary'> Thêm thực phẩm</Button>
          <AddDietPlan
              addFood = {addFood}
              visible={visibleAddPlan}
              onCancel={handleCancel}
              selectedPet={selectedPet}
              setUpdate={setUpdate}
            />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 3 }}
          style={{ marginBottom: 16 }}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handleSave}
          >
            Lưu
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </div>
      </div>
    </Modal>
  )
}

export default DietPlanModal