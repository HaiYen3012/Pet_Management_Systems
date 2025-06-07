import React, { useEffect, useState } from 'react'
import { Card, Button, Breadcrumb, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import usePet from 'hooks/usePet'
import { Link } from 'react-router-dom'
import pet from 'api/pet'
import AddPetModal from 'components/add-pet'
import { toast } from 'react-toastify'
const { Meta } = Card
import './info-pet.scss'


const PetList = () => {
  const [visibleAddPetModal, setVisibleAddPetModal] = useState(false)
  const { customerPets, setCustomerPets } = usePet()
  const [petList, setPetList] = useState([])
  // console.log(customerPets);

  const onCancel = () => {
    setVisibleAddPetModal(false)
  }
  const handleAddPet = () => {
    setVisibleAddPetModal(true)
  }

  const handleCancel = () => {
    setVisibleAddPetModal(false)
  }


  const handleDelete = (pet_id) => {
    pet
      .deletePet(pet_id)
      .then(() => {
        toast.success('Xóa thú cưng thành công!')
        const newPets = petList.filter((item) => item.pet_id !== pet_id)
        setCustomerPets(newPets)
      })
      .catch((error) => {
        console.error('xóa thú cưng thất bại:', error)
      })
  }
  const confirm = (e) => {
    handleDelete(e.pet_id)
    message.success('Click on Yes');
  };         
  const cancel = (e) => {
    console.log(e);
    message.error('Hủy thành công');
  };

  return (
    <div className="pet-info__wrapper">
      <div className="pet-info__header">
        <Breadcrumb
          items={[
            {
              title: <Link to={'/pet'}>Home</Link>,
            },
          ]}
        />
        <div className="pet-info__header__title">
          Danh sách thú cưng
          <div className="pet-info__header__button-add-pet">
            <Button
              onClick={handleAddPet}
              type="primary"
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
            <AddPetModal
              visible={visibleAddPetModal}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>

      <div className="pet-info__card-list">
        {customerPets.length === 0 ? (
          <div className="pet-info__card-list__none">
            Bạn không có thú cưng nào!!!!
          </div>
        ) : (
          customerPets &&
          customerPets.map((petinfo) => (
            <Card
              hoverable
              className="pet-info__card-list__card"
              cover={
                <img
                  alt="example"
                  src={
                    petinfo?.avatar || '/avatarpet.png'
                  }
                />
              }
            >
              <Meta title={petinfo.fullname} />
              <div className="pet-info__card-list__card__description">
                <div lassName="pet-info__card-list__card__description__species">
                  {'Loài: ' + petinfo.species}
                </div>
                <div lassName="pet-info__card-list__card__description__sex">
                  {'Giới tính: ' + petinfo.sex}
                </div>
                <div lassName="pet-info__card-list__card__description__health">
                  {'Trạng thái: ' + petinfo.health}
                </div>
              </div>
              <div className="pet-info__card-list__card__button flex flex-row gap-3">
                <Link to={`basic-info/${petinfo.pet_id}`}>
                  {' '}
                  <Button block type="primary">
                    Thông tin chi tiết
                  </Button>{' '}
                </Link>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => confirm(petinfo)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
export default PetList
