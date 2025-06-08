import React, { useState, useEffect } from 'react'
import { Modal, Avatar, Table, Button, Typography, Input } from 'antd'
import service from 'api/service'
import { formatDateIsoString } from 'helpers/formartdate'
import { toast } from 'react-toastify'
const { Title } = Typography

// --- COMPONENT CON: EditableField - KHÔNG ĐỔI ---
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
      className="border-amber-500 focus:border-amber-600 focus:ring-amber-500"
    />
  ) : (
    <div
      onDoubleClick={onDoubleClick}
      className="w-full px-2 py-1 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
    >
      {value || <span className="text-stone-400 italic">Chưa có thông tin</span>}
    </div>
  )

// --- COMPONENT CHÍNH: MedicalRecordModal ---
const MedicalRecordModal = ({ visible, onCancel, selectedPet }) => {
  const [isEditing, setIsEditing] = useState({})
  const [editableFields, setEditableFields] = useState({})
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [editingColumn, setEditingColumn] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (visible && selectedPet?.pet_id) {
      setError(false)
      const params = { pet_id: selectedPet.pet_id }
      service
        .getMedicalRecordsbyPetId(params)
        .then((res) => {
          if (res.data && res.data.medicalRecords) {
            const { medicalRecords, prescriptions } = res.data
            const fields = {
              date: formatDateIsoString(medicalRecords.created_at),
              symptoms: medicalRecords.symptoms,
              neutered: medicalRecords.neutered,
              diagnostic: medicalRecords.diagnostic,
              medicalHistory: medicalRecords.medicalHistory || 'Không có',
              id: medicalRecords.id,
            }
            setEditableFields(fields)
            const petData = (prescriptions || []).map((item, index) => ({
              ...item,
              key: item.id || index + 1,
            }))
            setData(petData)
          } else {
            setError(true)
          }
        })
        .catch(() => {
          setError(true)
          setData([])
          setEditableFields({})
        })
    }
  }, [selectedPet, visible])

  const EditableCell = ({
    editing,
    dataIndex,
    record,
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
          className="border-amber-500 focus:border-amber-600 focus:ring-amber-500"
        />
      ) : (
        <div className="py-2 px-1 cursor-pointer" onDoubleClick={() => editCell(record, dataIndex)}>
          {children}
        </div>
      )}
    </td>
  )
  
  const handleDoubleClick = (field) => setIsEditing({ [field]: true })
  const handleChange = (field, value) => setEditableFields({ ...editableFields, [field]: value })
  const handleBlur = (field) => setIsEditing({ [field]: false })
  const handleKeyDown = (field, e) => e.key === 'Enter' && handleBlur(field)

  const isEditingCell = (record, column) => record.key === editingKey && column === editingColumn
  const editCell = (record, column) => { setEditingKey(record.key); setEditingColumn(column) }
  const saveCell = () => { setEditingKey(''); setEditingColumn('') }

  const handleCellChange = (e, key, column) => {
    const newData = [...data]
    const index = newData.findIndex((item) => key === item.key)
    if (index > -1) {
      const item = newData[index]
      newData.splice(index, 1, { ...item, [column]: e.target.value })
      setData(newData)
    }
  }

  const handleSave = () => {
    const medicalDataNe = {
      medical_record_id: editableFields.id,
      neutered: editableFields.neutered,
      symptoms: editableFields.symptoms,
      diagnostic: editableFields.diagnostic,
      prescriptions: data,
    }
    service.updateMedicalRecordsbyPetId(medicalDataNe).then(() => {
      toast.success('Cập nhật thành công')
      onCancel()
    }).catch(err => {
      toast.error('Cập nhật thất bại: ' + (err.response?.data?.message || err.message))
    })
  }
  
  const columns = [
    { title: 'STT', dataIndex: 'key', key: 'key', width: '10%' },
    { title: 'Tên thuốc', dataIndex: 'medicine', key: 'medicine', width: '30%' },
    { title: 'Mô tả', dataIndex: 'note', key: 'note' },
    { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage', width: '20%' },
  ]

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditingCell(record, col.dataIndex),
    }),
  }))

  // *** GIAO DIỆN KHI TRỐNG (ĐÃ CẬP NHẬT ẢNH MỚI) ***
  if (error) {
    return (
      <Modal
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        centered
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-amber-50 p-6 sm:p-8 rounded-lg flex flex-col items-center justify-center min-h-[70vh]">
            {/* SVG ảnh chó mèo dễ thương cho trường hợp không có dữ liệu */}
            <div className="w-48 h-48 mb-6">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Nền tròn */}
                <circle cx="200" cy="200" r="180" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="4"/>
                
                {/* Chó */}
                <g transform="translate(120, 120)">
                  {/* Thân chó */}
                  <ellipse cx="40" cy="80" rx="35" ry="45" fill="#D2691E"/>
                  {/* Đầu chó */}
                  <circle cx="40" cy="40" r="30" fill="#DEB887"/>
                  {/* Tai chó */}
                  <ellipse cx="25" cy="25" rx="12" ry="20" fill="#CD853F"/>
                  <ellipse cx="55" cy="25" rx="12" ry="20" fill="#CD853F"/>
                  {/* Mắt chó */}
                  <circle cx="32" cy="35" r="4" fill="#000"/>
                  <circle cx="48" cy="35" r="4" fill="#000"/>
                  <circle cx="33" cy="33" r="1.5" fill="#FFF"/>
                  <circle cx="49" cy="33" r="1.5" fill="#FFF"/>
                  {/* Mũi chó */}
                  <ellipse cx="40" cy="45" rx="3" ry="2" fill="#000"/>
                  {/* Miệng chó */}
                  <path d="M 35 50 Q 40 55 45 50" stroke="#000" strokeWidth="2" fill="none"/>
                  {/* Chân chó */}
                  <rect x="25" y="115" width="8" height="20" rx="4" fill="#8B4513"/>
                  <rect x="47" y="115" width="8" height="20" rx="4" fill="#8B4513"/>
                  {/* Đuôi chó */}
                  <ellipse cx="75" cy="75" rx="8" ry="15" fill="#D2691E" transform="rotate(30 75 75)"/>
                </g>

                {/* Mèo */}
                <g transform="translate(220, 120)">
                  {/* Thân mèo */}
                  <ellipse cx="40" cy="80" rx="30" ry="40" fill="#FF6B35"/>
                  {/* Đầu mèo */}
                  <circle cx="40" cy="45" r="25" fill="#FF8C69"/>
                  {/* Tai mèo (nhọn) */}
                  <polygon points="25,25 20,5 35,15" fill="#FF6B35"/>
                  <polygon points="55,25 60,5 45,15" fill="#FF6B35"/>
                  <polygon points="25,20 22,8 32,15" fill="#FFB6C1"/>
                  <polygon points="55,20 58,8 48,15" fill="#FFB6C1"/>
                  {/* Mắt mèo */}
                  <ellipse cx="32" cy="40" rx="3" ry="5" fill="#32CD32"/>
                  <ellipse cx="48" cy="40" rx="3" ry="5" fill="#32CD32"/>
                  <ellipse cx="32" cy="40" rx="1" ry="3" fill="#000"/>
                  <ellipse cx="48" cy="40" rx="1" ry="3" fill="#000"/>
                  {/* Mũi mèo */}
                  <polygon points="40,48 37,52 43,52" fill="#FF1493"/>
                  {/* Miệng mèo */}
                  <path d="M 35 55 Q 40 58 45 55" stroke="#000" strokeWidth="1.5" fill="none"/>
                  <line x1="40" y1="52" x2="40" y2="58" stroke="#000" strokeWidth="1"/>
                  {/* Râu mèo */}
                  <line x1="15" y1="45" x2="28" y2="47" stroke="#000" strokeWidth="1"/>
                  <line x1="15" y1="50" x2="28" y2="50" stroke="#000" strokeWidth="1"/>
                  <line x1="52" y1="47" x2="65" y2="45" stroke="#000" strokeWidth="1"/>
                  <line x1="52" y1="50" x2="65" y2="50" stroke="#000" strokeWidth="1"/>
                  {/* Chân mèo */}
                  <rect x="28" y="115" width="6" height="18" rx="3" fill="#696969"/>
                  <rect x="46" y="115" width="6" height="18" rx="3" fill="#696969"/>
                  {/* Đuôi mèo */}
                  <path d="M 70 85 Q 85 70 80 50" stroke="#FF6B35" strokeWidth="12" fill="none" strokeLinecap="round"/>
                </g>

                {/* Trái tim nhỏ */}
                <g transform="translate(200, 320)">
                  <path d="M 0,-8 C -8,-16 -20,-16 -20,-4 C -20,8 0,20 0,20 C 0,20 20,8 20,-4 C 20,-16 8,-16 0,-8 Z" fill="#FF69B4"/>
                </g>
                
                {/* Stethoscope */}
                <g transform="translate(160, 280)">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="#4169E1" strokeWidth="3"/>
                  <path d="M 20 8 Q 15 -5 25 -5 Q 35 -5 30 8" stroke="#4169E1" strokeWidth="3" fill="none"/>
                  <circle cx="18" cy="-5" r="2" fill="#4169E1"/>
                  <circle cx="32" cy="-5" r="2" fill="#4169E1"/>
                </g>
              </svg>
            </div>
            <Title level={3} className="mt-2 !text-amber-800">Chưa có hồ sơ bệnh án</Title>
            <p className="text-amber-600 text-center max-w-sm mb-6">Thú cưng này hiện chưa có dữ liệu bệnh án trong hệ thống. Hãy tạo mới nếu cần thiết.</p>
            <Button 
              type="primary" 
              size="large"
              className="bg-amber-500 hover:!bg-amber-600 border-amber-500 hover:!border-amber-600" 
              onClick={onCancel}
            >
              Đóng
            </Button>
        </div>
      </Modal>
    )
  }
  
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
      closable={false}
      bodyStyle={{ padding: 0 }}
    >
      <div className="bg-amber-50 p-6 sm:p-8 rounded-lg">
        {/* Header */}
        <div className="pb-4 mb-6 text-center relative">
            <Title level={2} className="!text-amber-900 !font-bold">Hồ Sơ Bệnh Án</Title>
            <button type="button" className="absolute -top-2 -right-2 text-amber-500 hover:text-amber-700 transition-colors" onClick={onCancel}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Phần thông tin chính */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="mx-auto md:mx-0">
            {selectedPet?.avatar ? (
              <Avatar 
                src={selectedPet.avatar}
                size={150} 
                className="border-4 border-amber-200 shadow-lg"
              />
            ) : (
              // SVG avatar mặc định khi không có ảnh
              <div className="w-[150px] h-[150px] border-4 border-amber-200 shadow-lg rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                <svg viewBox="0 0 150 150" className="w-full h-full">
                  {/* Nền */}
                  <rect width="150" height="150" fill="url(#petGradient)"/>
                  <defs>
                    <linearGradient id="petGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FEF3C7"/>
                      <stop offset="100%" stopColor="#F59E0B"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Chó nhỏ */}
                  <g transform="translate(35, 35)">
                    <ellipse cx="20" cy="35" rx="15" ry="20" fill="#D2691E"/>
                    <circle cx="20" cy="20" r="12" fill="#DEB887"/>
                    <ellipse cx="12" cy="15" rx="4" ry="8" fill="#CD853F"/>
                    <ellipse cx="28" cy="15" rx="4" ry="8" fill="#CD853F"/>
                    <circle cx="16" cy="18" r="2" fill="#000"/>
                    <circle cx="24" cy="18" r="2" fill="#000"/>
                    <ellipse cx="20" cy="23" rx="1.5" ry="1" fill="#000"/>
                    <path d="M 17 26 Q 20 28 23 26" stroke="#000" strokeWidth="1" fill="none"/>
                  </g>

                  {/* Mèo nhỏ */}
                  <g transform="translate(85, 35)">
                    <ellipse cx="20" cy="35" rx="12" ry="18" fill="#FF6B35"/>
                    <circle cx="20" cy="22" r="10" fill="#FF8C69"/>
                    <polygon points="12,15 10,5 18,10" fill="#FF6B35"/>
                    <polygon points="28,15 30,5 22,10" fill="#FF6B35"/>
                    <ellipse cx="16" cy="20" rx="1.5" ry="2.5" fill="#32CD32"/>
                    <ellipse cx="24" cy="20" rx="1.5" ry="2.5" fill="#32CD32"/>
                    <polygon points="20,24 18,26 22,26" fill="#FF1493"/>
                  </g>

                  {/* Trái tim ở giữa */}
                  <g transform="translate(75, 95)">
                    <path d="M 0,-4 C -4,-8 -10,-8 -10,-2 C -10,4 0,10 0,10 C 0,10 10,4 10,-2 C 10,-8 4,-8 0,-4 Z" fill="#FF69B4"/>
                  </g>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 bg-white p-6 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-amber-800">Thông tin khám bệnh</h3>
              <div className="text-sm font-medium text-stone-500 flex items-center gap-2">
                <span>NGÀY KHÁM:</span>
                <span className="font-semibold text-stone-700">{editableFields['date']}</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Triệu chứng', name: 'symptoms' },
                { label: 'Chuẩn đoán', name: 'diagnostic' },
                { label: 'Tiền sử bệnh lý', name: 'medicalHistory' },
              ].map((field) => (
                <div className="flex flex-col sm:flex-row sm:items-center" key={field.name}>
                  <strong className="sm:w-1/3 font-semibold text-amber-700 mb-1 sm:mb-0">
                    {field.label.toUpperCase()}:
                  </strong>
                  <div className="sm:w-2/3">
                    <EditableField
                      value={editableFields[field.name]}
                      isEditing={isEditing[field.name]}
                      onDoubleClick={() => handleDoubleClick(field.name)}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      onBlur={() => handleBlur(field.name)}
                      onKeyDown={(e) => handleKeyDown(field.name, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bảng Đơn thuốc */}
        <div className="mt-8">
            <Title level={4} className="!font-bold !text-amber-800 mb-4">Đơn Thuốc Kê Toa</Title>
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <Table
                    components={{ body: { cell: EditableCell } }}
                    columns={mergedColumns}
                    dataSource={data}
                    pagination={{ pageSize: 3, className: 'custom-pagination px-4' }}
                    className="custom-table-header"
                />
            </div>
        </div>

        {/* Nút bấm Lưu / Hủy */}
        <div className="flex justify-end gap-3 mt-8">
            <Button onClick={onCancel} className="font-semibold">Hủy</Button>
            <Button type="primary" onClick={handleSave} className="bg-amber-500 hover:!bg-amber-600 font-semibold">
                Lưu Thay Đổi
            </Button>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-table-header .ant-table-thead > tr > th {
          background-color: #f59e0b !important;
          color: white !important;
          font-weight: 600 !important;
          border-bottom: none !important;
        }
        .custom-table-header .ant-table-thead > tr > th:hover {
            background-color: #d97706 !important;
        }
        .custom-pagination {
            background-color: transparent !important;
            padding-top: 12px;
            padding-bottom: 12px;
            margin-bottom: 0 !important;
        }
        .custom-pagination .ant-pagination-item {
            border-radius: 6px !important;
        }
        .custom-pagination .ant-pagination-item-active {
            background-color: #f59e0b !important;
            border-color: #f59e0b !important;
        }
        .custom-pagination .ant-pagination-item-active a {
            color: white !important;
        }
        .custom-pagination .ant-pagination-item-active:hover a {
            color: white !important;
        }
        .custom-pagination .ant-pagination-item:hover {
            border-color: #fcd34d !important;
        }
        .custom-pagination .ant-pagination-item:hover a {
            color: #b45309 !important;
        }
        .custom-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
        .custom-pagination .ant-pagination-next:hover .ant-pagination-item-link {
            border-color: #fcd34d !important;
            color: #b45309 !important;
        }
      `}</style>
    </Modal>
  )
}

export default MedicalRecordModal