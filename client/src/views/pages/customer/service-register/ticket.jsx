import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import usePet from 'hooks/usePet';

export const Ticket = (props) => {
    const { setStepCurrent, serviceCurrent, setServiceCurrent, dataRegister, setDataRegister, idOrder } = props;

    const [petInfo, setPetInfo] = useState({
        fullname: '',
        sex: '',
        age: '',
        weight: '',
    });

    const { customerPets } = usePet();

    useEffect(() => {
        const infor = customerPets.find((item) => item.pet_id === dataRegister.pet_id);
        setPetInfo(infor)
    }, [])

    const handleRegister = () => {
        setDataRegister({});
        setServiceCurrent('service_01')
        setStepCurrent(0);
    }

    return (
        <div className="service-register__content__form-ticket">
            <div className='card-body'>
                <div className='card-body__header'>
                    {
                        (serviceCurrent === "service_01" && <>Phiếu khám bệnh</>)
                        ||
                        (serviceCurrent === "service_02" && <>Phiếu dịch vụ lưu trữ</>)
                        ||
                        (serviceCurrent === "service_03" && <>Phiếu dịch vụ vệ sinh làm đẹp</>)
                    }
                    <span>#{idOrder}</span>
                </div>
                <div className='card-body__content'>
                    <div className='card-body__content__left'>
                        <div>Thông tin thú cưng</div>
                        <div>Tên: {petInfo.fullname}</div>
                        <div>Giới tính: {petInfo.sex}</div>
                        <div>Tuổi: {petInfo.age} tuổi</div>
                        <div>Cân nặng: {petInfo.weight} kg</div>
                    </div>
                    <div className='card-body__content__right'>
                        <div style={{ visibility: "hidden" }}> 1</div>
                        <div>Trạng thái: <span style={{ color: "#1890ff" }}>Khởi tạo</span></div>
                        {
                            serviceCurrent === "service_02" ?
                                <>
                                    <div>Loại phòng: {dataRegister.valueTimeType}</div>
                                    <div>Ngày bắt đầu: {dataRegister.date_start}</div>
                                    <div>Ngày kết thúc: {dataRegister.date_end}</div>
                                </>
                                :
                                <>
                                    <div>Ngày khám: {dataRegister.date}</div>
                                    <div>Ca khám: {dataRegister.valueTimeType}</div>
                                    <div style={{ visibility: "hidden" }}> 1</div>
                                </>
                        }

                    </div>
                </div>
            </div>

            <div style={{ fontSize: "16px" }}>
                Bạn muốn đăng ký tiếp 1 dịch vụ khác 👉
                <Button type="primary" onClick={() => handleRegister()}>Đăng kí tiếp</Button>
            </div>

        </div>
    )
}