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
  Modal,
} from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import InfoModal from './pet-modal/info_detail'
import UpdateModal from './pet-modal/info_update'
import AddPetModal from 'components/add-pet'
import usePet from 'hooks/usePet'
import pet from 'api/pet'
import { toast } from 'react-toastify'
const { Option } = Select
const { confirm } = Modal
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa'

const PetInfoOverview = () => {
  const [sortOrder, setSortOrder] = useState({})
  const [sortedData, setSortedData] = useState([])
  const [searchName, setSearchName] = useState('')
  const [visibleInfoModal, setVisibleInfoModal] = useState(false)
  const [visibleAddPetModal, setVisibleAddPetModal] = useState(false)
  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)
  
  const { allPets: pets, setAllPets } = usePet();
  
  // console.log('pets:', pets);
  // console.log('setAllPets:', setAllPets);

  const columns = [
    { title: 'ID', dataIndex: 'pet_id', key: 'pet_id' },
    { title: 'Tên thú cưng', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Chủng loại', dataIndex: 'species', key: 'species' },
    { title: 'Tuổi', dataIndex: 'age', key: 'age' },
    { title: 'Giới tính', dataIndex: 'sex', key: 'sex' },
    { title: 'Cân nặng', dataIndex: 'weight', key: 'weight' },
    { title: 'ID khách hàng', dataIndex: 'user_id', key: 'user_id' },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showDetails(record)}>Xem chi tiết</a>
        </Space>
      ),
    },
    // { title: 'x', dataIndex: 'x', key: 'x' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button
            className="ml-3 p-2 text-orange-300 hover:text-orange-400 hover:bg-orange-50 rounded border transition-colors"
            onClick={() => updateInfos(record)}
          >
            <FaPen />
          </button>
          <button
            onClick={() => showConfirm(record.pet_id)}
            className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border  transition-colors"
          >
            <FaTrashAlt />
          </button>
        </Space>
      ),
    },
  ]

  const showDetails = (record) => {
    setSelectedPet(record)
    setVisibleInfoModal(true)
  }

  const updateInfos = (record) => {
    setSelectedPet(record)
    setVisibleUpdateModal(true)
  }

  const handleCancel = () => {
    setVisibleInfoModal(false)
    setVisibleAddPetModal(false)
    setVisibleUpdateModal(false)
  }
  const handleAddPet = () => {
    setVisibleAddPetModal(true)
  }

  const handleDelete = (pet_id) => {
    pet
      .deletePet(pet_id)
      .then(() => {
        toast.success('Xóa thú cưng thành công!')
        const newPets = pets.filter((item) => item.pet_id !== pet_id)
        setAllPets(newPets)
        setSortedData(newPets)
      })
      .catch((error) => {
        console.error('xóa thú cưng thất bại:', error)
      })
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchName(value)

    const filteredData = pets.filter((pet) => {
      return pet.fullname.toLowerCase().includes(value)
    })
    setSortedData(filteredData)
  }

  useEffect(() => {
    if (!sortOrder.field || !sortOrder.order) {
      setSortedData(pets)
      return
    }

    const sorted = [...pets].sort((a, b) => {
      let fieldA = a[sortOrder.field]
      let fieldB = b[sortOrder.field]
      if (sortOrder.field === 'lastDispatch') {
        fieldA = new Date(fieldA)
        fieldB = new Date(fieldB)
      }
      if (fieldA < fieldB) return sortOrder.order === 'ascend' ? -1 : 1
      if (fieldA > fieldB) return sortOrder.order === 'ascend' ? 1 : -1
      return 0
    })
    setSortedData(sorted)
  }, [sortOrder, pets])

  const handleSortChange = (value) => {
    const [field, order] = value.split('-')
    setSortOrder({ field, order })
  }

  const showConfirm = (pet_id) => {
    confirm({
      title: 'Bạn có chắc muốn xóa thú cưng?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Bạn sẽ không thể hoàn tác và xem lại được thông tin của thú cưng.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(pet_id)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Typography.Title level={2}>Danh sách thú cưng</Typography.Title>
        <br />
        <br />
      </Space>

      <Space
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
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
          <Form.Item label="Tên thú cưng">
            <Input
              placeholder="Please enter"
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
        <Space>
          <Select
            placeholder="Sắp xếp theo"
            style={{ width: 180 }}
            onChange={handleSortChange}
          >
            <Option value="fullname-ascend">Tên (A-Z)</Option>
            <Option value="fullname-descend">Tên (Z-A)</Option>
            <Option value="pet_id-ascend">Id thú cưng</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleAddPet}
            icon={<PlusOutlined />}
            style={{ margin: '0 15px' }}
          >
            Thêm thú cưng
          </Button>
        </Space>
      </Space>
      {pets && (
        <Table columns={columns} dataSource={sortedData} pagination={30} />
      )}

      <InfoModal
        visible={visibleInfoModal}
        onCancel={handleCancel}
        selectedPet={selectedPet}
      />

      <UpdateModal
        visible={visibleUpdateModal}
        onCancel={handleCancel}
        selectedPet={selectedPet}
        key={selectedPet ? selectedPet.pet_id : '1'}
        setSelectedPet={setSelectedPet}
      />
      <AddPetModal visible={visibleAddPetModal} onCancel={handleCancel} />
    </div>
  )
}

export default PetInfoOverview
