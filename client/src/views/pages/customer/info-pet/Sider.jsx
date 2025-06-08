import React from 'react';

function SidebarButton({ iconSrc, label, active, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 mx-3 my-1 cursor-pointer rounded-xl transition-all duration-300 ease-out ${
        active 
          ? 'text-white font-medium transform scale-105' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
      }`}
      style={{
        background: active 
          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
          : 'transparent',
        boxShadow: active ? '0 6px 20px rgba(251, 191, 36, 0.25)' : 'none'
      }}
      onClick={onClick}
    >
      <div 
        className={`flex justify-center items-center w-10 h-10 rounded-lg transition-all duration-300 ${
          active ? 'bg-white/20' : 'bg-gray-100'
        }`}
      >
        <img 
          loading="lazy" 
          src={iconSrc} 
          alt="" 
          className="w-5 h-5"
          style={{
            filter: active ? 'brightness(0) invert(1)' : 'brightness(0.7)'
          }}
        />
      </div>
      <div className="text-sm font-medium flex-1">
        {label}
      </div>
      {active && (
        <div className="w-2 h-2 rounded-full bg-white opacity-80" />
      )}
    </div>
  );
}

export default function PetSider({ activeButton, onButtonClick, selectedPet }) {
  return (
    <div className="flex flex-col w-80 bg-gradient-to-b from-slate-50 to-white border-r border-gray-200/60 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Header with Pet Info */}
        <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                loading="lazy"
                src={selectedPet?.avatar || '/avatarpet.png'}
                alt="Pet profile"
                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                style={{
                  border: '3px solid #fef3c7'
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {selectedPet ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {selectedPet.fullname || 'Thú cưng'}
                </h3>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <span className="text-sm">🐾</span>
                  {selectedPet.species || 'Pet'}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-500">Chọn thú cưng</h3>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-6">
          <div className="px-6 mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quản lý hồ sơ
            </h4>
          </div>
          
          <div className="space-y-1">
            <SidebarButton
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/2d0df30ff6677bb6477486b0dc238678c208e4ebfa8bb8da213d5177a2c5e937?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              label="Thông tin cơ bản"
              active={activeButton === 'basicInfo'}
              onClick={() => onButtonClick('basicInfo')}
            />
            <SidebarButton
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/83ab051bcc662d7bdf9440809001bc8f9e1eef9351fde89e565254630bfce6a3?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              label="Hồ sơ bệnh án"
              active={activeButton === 'medicalRecord'}
              onClick={() => onButtonClick('medicalRecord')}
            />
            <SidebarButton
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4944e005e92f3393c715c293e4a37a6460cbbaf2fbf12adeee5d2f9948155b55?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              label="Chế độ ăn"
              active={activeButton === 'diet'}
              onClick={() => onButtonClick('diet')}
            />
            <SidebarButton
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/8a215e78e3f56a894a5625fce9c64258bc3482bffa9ed8566153d18e14a03bcf?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              label="Dịch vụ sử dụng"
              active={activeButton === 'services'}
              onClick={() => onButtonClick('services')}
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border border-amber-200">
            <div className="text-center">
              <div className="text-2xl mb-2">💝</div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Chăm sóc tốt nhất
              </p>
              <p className="text-xs text-gray-500">
                cho bé yêu của bạn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}