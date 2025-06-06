import React from 'react';

function SidebarButton({ iconSrc, label, active, onClick }) {
  return (
    <div
      className={`flex gap-2.5 px-6 py-2 mt-2 cursor-pointer w-full items-center h-10 ${active ? 'text-sky-500 ' : 'text-black text-opacity-80'}`}
      onClick={onClick}
    >
      <div className="flex justify-center items-center my-auto w-5 h-5 bg-white bg-opacity-0">
        <img loading="lazy" src={iconSrc} alt="" className="w-5 aspect-square" />
      </div>
      <div className="text-base leading-6">
        {label}
      </div>
      {active && <div className="shrink-0 h-10 bg-sky-500 w-[3px] ml-auto" />}
    </div>
  );
}

export default function PetSider({ activeButton, onButtonClick, selectedPet }) {
  return (
    <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full border-r-2">
      <div className="flex flex-col mt-10 max-md:mt-10">
        <img
          loading="lazy"
          src={selectedPet?.avatar || '/avatarpet.jpg'}
          alt="Pet profile"
          className="ml-6 max-w-full border-white border-solid aspect-[0.99] rounded-full border-[10px] w-[156px] max-md:ml-2.5"
        />
        <div className="flex flex-col mt-8 w-full bg-white shadow-sm">
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
    </div>
  );
}
