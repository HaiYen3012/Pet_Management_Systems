import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Typography,
  Select,
  Input,
  Form,
  Modal,
  Card,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import InfoModal from './pet-modal/info_detail';
import UpdateModal from './pet-modal/info_update';
import AddPetModal from 'components/add-pet';
import usePet from 'hooks/usePet';
import pet from 'api/pet';
import { toast } from 'react-toastify';
import './pet-info-overview.scss';

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

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
    { title: 'ID', dataIndex: 'pet_id', key: 'pet_id', width: 80 },
    { title: 'Tên thú cưng', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Chủng loại', dataIndex: 'species', key: 'species' },
    { title: 'Tuổi', dataIndex: 'age', key: 'age', width: 80 },
    { title: 'Giới tính', dataIndex: 'sex', key: 'sex', width: 100 },
    { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', width: 100 },
    { title: 'ID khách hàng', dataIndex: 'user_id', key: 'user_id', width: 120 },
    {
      title: 'Chi tiết',
      key: 'detail',
      width: 120,
      render: (_, record) => (
        <a onClick={() => showDetails(record)} className="text-blue-500">
          Xem chi tiết
        </a>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <div className="action-buttons">
          <button
            className="ml-3 p-2 text-orange-300 hover:text-orange-400 hover:bg-orange-50 rounded border transition-colors"
            onClick={() => updateInfos(record)}
          >
            <FaPen />
          </button>
          <button
            onClick={() => showConfirm(record.pet_id)}
            className="ml-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded border transition-colors"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  const showDetails = (record) => {
    setSelectedPet(record);
    setVisibleInfoModal(true);
  };

  const updateInfos = (record) => {
    setSelectedPet(record);
    setVisibleUpdateModal(true);
  };

  const handleCancel = () => {
    setVisibleInfoModal(false);
    setVisibleAddPetModal(false);
    setVisibleUpdateModal(false);
  };

  const handleAddPet = () => {
    setVisibleAddPetModal(true);
  };

  const handleDelete = (pet_id) => {
    pet
      .deletePet(pet_id)
      .then(() => {
        toast.success('Xóa thú cưng thành công!');
        const newPets = pets.filter((item) => item.pet_id !== pet_id);
        setAllPets(newPets);
        setSortedData(newPets);
      })
      .catch((error) => {
        toast.error('Xóa thú cưng thất bại!');
        console.error('Xóa thú cưng thất bại:', error);
      });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchName(value);
    const filteredData = pets.filter((pet) =>
      pet.fullname.toLowerCase().includes(value)
    );
    setSortedData(filteredData);
  };

  useEffect(() => {
    if (!sortOrder.field || !sortOrder.order) {
      setSortedData(pets);
      return;
    }
    const sorted = [...pets].sort((a, b) => {
      let fieldA = a[sortOrder.field];
      let fieldB = b[sortOrder.field];
      if (fieldA < fieldB) return sortOrder.order === 'ascend' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder.order === 'ascend' ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  }, [sortOrder, pets]);

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    setSortOrder({ field, order });
  };

  const showConfirm = (pet_id) => {
    confirm({
      title: 'Bạn có chắc muốn xóa thú cưng?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn sẽ không thể hoàn tác và xem lại được thông tin của thú cưng.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleDelete(pet_id);
      },
    });
  };

  return (
    <div className="manage-page">
      <Card className="manage-card">
        <div className="manage-header">
          <Title level={2}>Danh sách thú cưng</Title>
          <p>Quản lý thông tin thú cưng một cách dễ dàng và hiệu quả.</p>
        </div>
        <div className="manage-content">
          <div className="search-bar">
            <Form layout="inline">
              <Form.Item label="Tên thú cưng">
                <Input
                  placeholder="Nhập tên thú cưng"
                  value={searchName}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSearchChange}
                  className="search-button"
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder="Sắp xếp theo"
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <Option value="fullname-ascend">Tên (A-Z)</Option>
                  <Option value="fullname-descend">Tên (Z-A)</Option>
                  <Option value="pet_id-ascend">ID thú cưng</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleAddPet}
                  icon={<PlusOutlined />}
                  className="add-button"
                >
                  Thêm thú cưng
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Table
            className="manage-table"
            columns={columns}
            dataSource={sortedData}
            pagination={{
              defaultPageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ['8', '15', '25'],
            }}
            rowKey="pet_id"
            scroll={{ x: 1200 }}
          />
        </div>
        <InfoModal
          visible={visibleInfoModal}
          onCancel={handleCancel}
          selectedPet={selectedPet}
        />
        <UpdateModal
          visible={visibleUpdateModal}
          onCancel={handleCancel}
          selectedPet={selectedPet}
          setAllPets={setAllPets}
          allPets={pets}
        />
        <AddPetModal visible={visibleAddPetModal} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default PetInfoOverview;