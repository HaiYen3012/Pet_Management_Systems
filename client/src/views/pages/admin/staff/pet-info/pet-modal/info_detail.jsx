import React, { useState } from 'react'
import { Modal, Space, Avatar } from 'antd'
import MedicalRecordModal from './medical_record'
import DietPlanModal from './diet_plan'
// import './pet-modal.scss' // Giữ hoặc bỏ đều được

const InfoModal = ({ visible, onCancel, selectedPet }) => {
  const [medicalRecordVisible, setMedicalRecordVisible] = useState(false)
  const [dietPlanVisible, setDietPlanVisible] = useState(false)

  const showMedicalRecord = () => setMedicalRecordVisible(true)
  const hideMedicalRecord = () => setMedicalRecordVisible(false)
  const showDietPlan = () => setDietPlanVisible(true)
  const hideDietPlan = () => setDietPlanVisible(false)

  // Class chung cho cả 2 nút để đảm bảo giống hệt nhau
  const buttonClasses = "block w-full text-center bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"

  return (
    <>
      <Modal
        open={visible}
        centered
        onCancel={onCancel}
        footer={null}
        width={1000}
        closable={false}
        title={null}
        bodyStyle={{ padding: '0' }}
      >
        {selectedPet && (
          // Container chính với nền kem và padding
          <div className="bg-amber-50 p-6 sm:p-8 rounded-lg">
            {/* Header tùy chỉnh */}
            <div className="pb-4 mb-6 border-b border-amber-200 text-center relative">
              <h2 className="text-2xl font-bold text-amber-900">
                Thông tin chi tiết thú cưng
              </h2>
              <button
                type="button"
                className="absolute top-0 right-0 text-amber-500 hover:text-amber-700 transition-colors"
                onClick={onCancel}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Layout chính: flex, responsive */}
            <div className="flex flex-col md:flex-row md:gap-10">
              {/* Cột Avatar */}
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center mb-6 md:mb-0">
                <Avatar
                  src={selectedPet?.avatar || '/avatarpet.jpg'}
                  size={150}
                  className="border-4 border-amber-200 shadow-lg"
                />
              </div>

              {/* Cột thông tin */}
              <div className="flex-grow flex flex-col sm:flex-row sm:gap-8 w-full">
                {/* Thông tin cột trái */}
                <div className="flex-1 space-y-3 mb-6 sm:mb-0">
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">ID thú cưng:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.pet_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">Tên thú cưng:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.fullname}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">Giới tính:</span>
                    <span className="text-stone-800 font-medium capitalize">{selectedPet.sex.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">Tuổi:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.age}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">Cân nặng:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.weight}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-amber-700">Chủng loại:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.species}</span>
                  </div>
                </div>

                {/* Thông tin cột phải */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">ID khách hàng:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.user_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="font-semibold text-amber-700">Sức khỏe:</span>
                    <span className="text-stone-800 font-medium">{selectedPet.health}</span>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-amber-700 mb-1">Mô tả:</p>
                    <p className="text-stone-700 text-sm leading-relaxed">{selectedPet.describe}</p>
                  </div>
                  
                  {/* CÁC NÚT BẤM ĐÃ ĐƯỢC ĐỒNG BỘ */}
                  <Space
                    direction="vertical"
                    size="middle"
                    className="mt-auto pt-4 w-full"
                  >
                    <a
                      onClick={showMedicalRecord}
                      className={buttonClasses} // <-- Dùng class chung
                    >
                      Xem hồ sơ bệnh án
                    </a>
                    <a
                      onClick={showDietPlan}
                      className={buttonClasses} // <-- Dùng class chung
                    >
                      Xem chế độ ăn
                    </a>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
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
    </>
  )
}
export default InfoModal