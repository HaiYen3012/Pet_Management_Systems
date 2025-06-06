import React, { useState } from 'react'
import { Modal, Space, Avatar } from 'antd'
import MedicalRecordModal from './medical_record'
import DietPlanModal from './diet_plan'
import './pet-modal.scss'

const InfoModal = ({ visible, onCancel, selectedPet }) => {
  const [medicalRecordVisible, setMedicalRecordVisible] = useState(false)
  const [dietPlanVisible, setDietPlanVisible] = useState(false)

  const showMedicalRecord = () => {
    setMedicalRecordVisible(true)
  }

  const hideMedicalRecord = () => {
    setMedicalRecordVisible(false)
  }

  const showDietPlan = () => {
    setDietPlanVisible(true)
  }

  const hideDietPlan = () => {
    setDietPlanVisible(false)
  }

  return (
    <Modal
      style={{ top: 20 }}
      title={<span className="text-2xl font-bold">Thông tin chi tiết</span>}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      header={null}
    >
      {selectedPet && (
        <div>
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <hr />
              <div className="m-10 flex flex-row gap-20">
                <div
                  className="mim-w-[200px]"
                  style={{
                    flex: '0 0 150px',
                    textAlign: 'center',
                    marginRight: '20px',
                  }}
                >
                  <Avatar
                    src={selectedPet?.avatar || '/avatarpet.jpg'}
                    size={150}
                    style={{ marginRight: 24 }}
                  />
                </div>
                <div className="flex flex-row justify-around w-full">
                  <div
                    className="pet-info-detail text-xl flex flex-col gap-14"
                    style={{ flex: 1, paddingRight: 20 }}
                  >
                    <p>
                      <strong>ID thú cưng:</strong> {selectedPet.pet_id}
                    </p>
                    <p>
                      <strong>Tên thú cưng:</strong> {selectedPet.fullname}
                    </p>
                    <p>
                      <strong>Giới tính:</strong>{' '}
                      {selectedPet.sex.toLowerCase()}
                    </p>
                    <p>
                      <strong>Tuổi:</strong> {selectedPet.age}
                    </p>
                    <p>
                      <strong>Cân nặng:</strong> {selectedPet.weight}
                    </p>
                    <p>
                      <strong>Chủng loại:</strong> {selectedPet.species}
                    </p>
                  </div>
                  <div
                    className="pet-info-detail text-xl flex flex-col gap-14"
                    style={{ flex: 1 }}
                  >
                    <p>
                      <strong>ID khách hàng:</strong> {selectedPet.user_id}
                    </p>
                    <p>
                      <strong>Sức khỏe:</strong> {selectedPet.health}
                    </p>
                    <p>
                      <strong>Mô tả:</strong> {selectedPet.describe}
                    </p>
                    <Space
                      className="flex flex-col gap-14"
                      direction="vertical"
                      size="middle"
                    >
                      <a
                        className="text-blue-500 text-xl"
                        onClick={showMedicalRecord}
                      >
                        Xem hồ sơ bệnh án
                      </a>
                      <a
                        className="text-blue-500 text-xl"
                        onClick={showDietPlan}
                      >
                        Xem chế độ ăn
                      </a>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <MedicalRecordModal
        visible={medicalRecordVisible}
        onCancel={hideMedicalRecord}
        selectedPet={selectedPet}
      />
      <DietPlanModal
        visible={dietPlanVisible}
        onCancel={hideDietPlan}
        selectedPet={selectedPet}
      />
    </Modal>
  )
}
export default InfoModal
