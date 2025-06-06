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
                    petinfo?.avatar ||
                    'data:image/jpeg;base64,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'
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
