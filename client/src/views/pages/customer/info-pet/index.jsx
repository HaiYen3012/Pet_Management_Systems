import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import usePet from 'hooks/usePet';
import { Link } from 'react-router-dom';
import pet from 'api/pet';
import AddPetModal from 'components/add-pet';
import { toast } from 'react-toastify';
import './pet-list.scss';

const { Meta } = Card;
const { Title } = Typography;

const PetList = () => {
  const [visibleAddPetModal, setVisibleAddPetModal] = useState(false);
  const { customerPets, setCustomerPets } = usePet();

  useEffect(() => {
    setCustomerPets(customerPets);
  }, [customerPets, setCustomerPets]);

  const handleAddPet = () => {
    setVisibleAddPetModal(true);
  };

  const handleCancel = () => {
    setVisibleAddPetModal(false);
  };

  const handleDelete = (pet_id) => {
    pet
      .deletePet(pet_id)
      .then(() => {
        toast.success('Xóa thú cưng thành công!');
        const newPets = customerPets.filter((item) => item.pet_id !== pet_id);
        setCustomerPets(newPets);
      })
      .catch((error) => {
        console.error('Xóa thú cưng thất bại:', error);
        toast.error('Xóa thú cưng thất bại.');
      });
  };

  const confirm = (pet) => {
    handleDelete(pet.pet_id);
  };

  const cancel = () => {
    toast.info('Hủy xóa thú cưng.');
  };

  return (
    <div className="manage-page">
      <Card className="manage-card">
        <div className="manage-header">
          <Title level={2}>Danh sách thú cưng</Title>
          <p>Xem và quản lý thông tin thú cưng của bạn một cách dễ dàng.</p>
        </div>
        <div className="manage-content">
          <div className="action-bar">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPet}
              className="add-button"
            >
              Thêm thú cưng
            </Button>
          </div>
          {customerPets.length === 0 ? (
            <div className="no-pets-message">
              Bạn chưa có thú cưng nào! Hãy thêm thú cưng để bắt đầu.
            </div>
          ) : (
            <div className="pet-card-list">
              {customerPets.map((petinfo) => (
                <Card
                  key={petinfo.pet_id}
                  hoverable
                  className="pet-card"
                  cover={
                    <img
                      alt={petinfo.fullname}
                      src={petinfo?.avatar || '/avatarpet.png'}
                      className="pet-card-image"
                    />
                  }
                >
                  <Meta title={petinfo.fullname} />
                  <div className="pet-card-description">
                    <div className="pet-card-description-item">
                      <strong>Loài:</strong> {petinfo.species}
                    </div>
                    <div className="pet-card-description-item">
                      <strong>Giới tính:</strong> {petinfo.sex}
                    </div>
                    <div className="pet-card-description-item">
                      <strong>Trạng thái:</strong> {petinfo.health}
                    </div>
                  </div>
                  <div className="pet-card-buttons">
                    <Link to={`basic-info/${petinfo.pet_id}`}>
                      <Button type="primary" block className="detail-button">
                        Thông tin chi tiết
                      </Button>
                    </Link>
                    <Popconfirm
                      title="Xóa thú cưng"
                      description="Bạn có chắc muốn xóa thú cưng này?"
                      onConfirm={() => confirm(petinfo)}
                      onCancel={cancel}
                      okText="Xóa"
                      cancelText="Hủy"
                      overlayClassName="pet-popconfirm"
                    >
                      <Button className="delete-button">
                        <span className="text-red-500 hover:text-red-600">Xóa</span>
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <AddPetModal visible={visibleAddPetModal} onCancel={handleCancel} />
        </div>
      </Card>
    </div>
  );
};

export default PetList;