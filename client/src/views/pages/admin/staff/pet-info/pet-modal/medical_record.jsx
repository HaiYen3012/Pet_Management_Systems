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
} from 'antd'
import service from 'api/service'
import { PlusOutlined } from '@ant-design/icons'
import { formatDateIsoString } from 'helpers/formartdate'
import { toast } from 'react-toastify'
const { Meta } = Card
const { Title } = Typography

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
    <div onDoubleClick={onDoubleClick}>{value}</div>
  )

const MedicalRecordModal = ({ visible, onCancel, selectedPet, onSave }) => {
  const [isEditing, setIsEditing] = useState({})
  const [editableFields, setEditableFields] = useState({})
  const [initialFields, setInitialFields] = useState({})
  const [data, setData] = useState([])
  const [initialData, setInitialData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [editingColumn, setEditingColumn] = useState('')
  const [medicalRecords, setMedicalRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
    const params = { pet_id: selectedPet.pet_id }
    service
      .getMedicalRecordsbyPetId(params)
      .then((res) => {
        setMedicalRecords(res.data.medicalRecords)
        setPrescriptions(res.data.prescriptions)

        if (res.data.medicalRecords) {
          const fields = {
            date: formatDateIsoString(res.data.medicalRecords.created_at),
            symptoms: res.data.medicalRecords.symptoms,
            neutered: res.data.medicalRecords.neutered,
            diagnostic: res.data.medicalRecords.diagnostic,
            medicalHistory:
              res.data.medicalRecords.medicalHistory || 'không có',
            id: res.data.medicalRecords.id,
          }
          setEditableFields(fields)
          setInitialFields(fields)
          const petData = res.data.prescriptions.map((item, index) => ({
            ...item,
            key: index + 1,
          }))
          setData(petData)
          setInitialData(petData)
        }
      })
      .catch(() => {
        setError(true)
        setInitialData({})
        setData([])
        setEditableFields({})
      })
  }, [selectedPet])

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
          {/* <div>
            <Button icon={<PlusOutlined />} type="primary">
              Thêm hồ sơ{' '}
            </Button>
          </div> */}
          <div className="flex justify-center items-center flex-1 text-red-500 text-xl w-full">
            Thú cưng hiện không có hồ sơ bệnh án
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
      const item = newData[index]
      newData.splice(index, 1, { ...item, [column]: e.target.value })
      setData(newData)
    }
  }

  const columns = [
    { title: 'STT', dataIndex: 'id', key: 'id,', width: '10%' },
    {
      title: 'Tên thuốc',
      dataIndex: 'medicine',
      key: 'medicine',
      width: '20%',
    },
    { title: 'Mô tả', dataIndex: 'note', key: 'note' },
    { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage', width: '15%' },
  ].map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      column: col.dataIndex,
      editing: isEditingCell(record, col.dataIndex),
    }),
  }))

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => (
    <td {...restProps}>
      {editing ? (
        <Input
          value={record[dataIndex]}
          onChange={(e) => handleCellChange(e, record.key, dataIndex)}
          onBlur={saveCell}
          onKeyDown={(e) => e.key === 'Enter' && saveCell()}
          autoFocus
        />
      ) : (
        <div onDoubleClick={() => editCell(record, dataIndex)}>{children}</div>
      )}
    </td>
  )

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditingCell(record, col.dataIndex),
    }),
  }))

  const handleSave = () => {
    setInitialFields(editableFields)
    setInitialData(data)
    const medicalDataNe = {
      medical_record_id: editableFields.id,
      neutered: editableFields.neutered,
      symptoms: editableFields.symptoms,
      diagnostic: editableFields.diagnostic,
      prescriptions: data,
    }
    service.updateMedicalRecordsbyPetId(medicalDataNe).then((res) => {
      console.log(res), toast.success('Cập nhật thành công')
    })
    onSave && onSave(editableFields, data)
  }

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
      <div style={{ padding: 24, minHeight: 360 }}>
        {selectedPet && (
          <div
            className="gap-20 items-center"
            style={{ display: 'flex', marginBottom: 24 }}
          >
            <Avatar src={'/image.png'} size={150} style={{ marginRight: 24 }} />
            <Card style={{ flex: 1 }}>
              <Meta
                title={
                  <div className="flex flex-row items-center gap-2  justify-between">
                    <div className="text-xl font-bold">HỒ SƠ BỆNH ÁN</div>
                    <div className="flex flex-row items-center text-xs font-large">
                      NGÀY KHÁM:
                      <EditableField
                        value={editableFields['date']}
                        isEditing={isEditing['date']}
                        onDoubleClick={() => handleDoubleClick('date')}
                        onChange={(e) => handleChange('date', e.target.value)}
                        onBlur={() => handleBlur('date')}
                        onKeyDown={(e) => handleKeyDown('date', e)}
                      />
                    </div>
                  </div>
                }
                description={
                  <div className="flex flex-col gap-5">
                    {[
                      { label: 'triệu chứng', name: 'symptoms' },
                      { label: 'chuẩn đoán', name: 'diagnostic' },
                      { label: 'tiền sử bệnh lý', name: 'medicalHistory' },
                    ].map((field) => (
                      <p
                        className="flex flex-row h-10 items-center"
                        key={field.name}
                        onDoubleClick={() => handleDoubleClick(field.name)}
                      >
                        <strong className="min-w-[200px]">
                          {field.label.toUpperCase()}:
                        </strong>
                        <EditableField
                          value={editableFields[field.name]}
                          isEditing={isEditing[field.name]}
                          onDoubleClick={() => handleDoubleClick(field.name)}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          onBlur={() => handleBlur(field.name)}
                          onKeyDown={(e) => handleKeyDown(field.name, e)}
                        />
                      </p>
                    ))}
                  </div>
                }
              />
            </Card>
          </div>
        )}
        <Title level={4}>ĐƠN THUỐC</Title>
        <Table
          columns={mergedColumns}
          dataSource={data}
          pagination={{ pageSize: 3 }}
          style={{ marginBottom: 16 }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
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

export default MedicalRecordModal
