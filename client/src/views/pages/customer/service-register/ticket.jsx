import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import usePet from 'hooks/usePet';
import styled from 'styled-components';

// Bảng màu không đổi
const themeColors = {
    background: '#fffaf0',
    cardBg: '#fffde7',
    cardBorder: '#ffecb3',
    headerBg: '#ffd54f',
    primaryText: '#5d4037',
    secondaryText: '#a1887f',
    accent: '#f57c00',
    button: '#ffb74d',
    buttonHover: '#ffa726',
    status: '#81c784',
};

// ... các styled-component khác giữ nguyên

const TicketWrapper = styled.div`
    font-family: 'Nunito', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 20px;
    background-color: ${themeColors.background};
    border-radius: 20px;
`;

const CardBody = styled.div`
    width: 100%;
    max-width: 600px;
    background-color: ${themeColors.cardBg};
    border: 2px solid ${themeColors.cardBorder};
    border-radius: 24px;
    box-shadow: 0 4px 15px rgba(224, 185, 68, 0.2);
    overflow: hidden;
    color: ${themeColors.primaryText};
`;

const CardHeader = styled.div`
    background-color: ${themeColors.headerBg};
    color: ${themeColors.primaryText};
    padding: 16px 24px;
    font-size: 1.6em;
    font-weight: 700; /* <<<<<<< THAY ĐỔI Ở ĐÂY: GIẢM TỪ 800 XUỐNG 700 */
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        background-color: rgba(255, 255, 255, 0.5);
        color: ${themeColors.secondaryText};
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: 700;
    }
`;

// ... các styled-component còn lại giữ nguyên
const CardContent = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 24px;
    gap: 20px;
`;

const InfoColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 16px;

    & > div:first-child {
        font-weight: 700;
        font-size: 1.1em;
        margin-bottom: 8px;
        color: ${themeColors.accent};
    }
`;

const StatusText = styled.span`
    color: ${themeColors.status};
    font-weight: 600;
`;

const RegisterNextSection = styled.div`
    font-size: 16px;
    color: ${themeColors.primaryText};
    display: flex;
    align-items: center;
    gap: 12px;
`;

const CuteButton = styled(Button)`
    &.ant-btn-primary {
        background-color: ${themeColors.button};
        border-color: ${themeColors.button};
        font-weight: 700;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);

        &:hover {
            background-color: ${themeColors.buttonHover};
            border-color: ${themeColors.buttonHover};
        }
    }
`;


// Component chính không thay đổi logic
const serviceTitles = {
    "service_01": "Phiếu khám bệnh",
    "service_02": "Phiếu dịch vụ lưu trú",
    "service_03": "Phiếu dịch vụ vệ sinh & làm đẹp",
};

export const Ticket = (props) => {
    // ... logic của bạn giữ nguyên
    const { setStepCurrent, serviceCurrent, setServiceCurrent, dataRegister, setDataRegister, idOrder } = props;
    const [petInfo, setPetInfo] = useState({ fullname: '', sex: '', age: '', weight: '' });
    const { customerPets } = usePet();

    useEffect(() => {
        if (dataRegister.pet_id) {
            const info = customerPets.find((item) => item.pet_id === dataRegister.pet_id);
            if (info) setPetInfo(info);
        }
    }, [customerPets, dataRegister.pet_id]);

    const handleRegister = () => {
        setDataRegister({});
        setServiceCurrent('service_01');
        setStepCurrent(0);
    }

    return (
        <TicketWrapper>
            <CardBody>
                <CardHeader>
                    {serviceTitles[serviceCurrent] || "Phiếu Dịch Vụ"}
                    <span>#{idOrder}</span>
                </CardHeader>
                <CardContent>
                    <InfoColumn>
                        <div>Thông tin thú cưng</div>
                        <div>Tên: {petInfo.fullname || '...'}</div>
                        <div>Giới tính: {petInfo.sex || '...'}</div>
                        <div>Tuổi: {petInfo.age ? `${petInfo.age} tuổi` : '...'}</div>
                        <div>Cân nặng: {petInfo.weight ? `${petInfo.weight} kg` : '...'}</div>
                    </InfoColumn>
                    <InfoColumn>
                        <div>Thông tin dịch vụ</div>
                        <div>Trạng thái: <StatusText>Khởi tạo</StatusText></div>
                        {serviceCurrent === "service_02" ? (
                            <>
                                <div>Loại phòng: {dataRegister.valueTimeType}</div>
                                <div>Ngày bắt đầu: {dataRegister.date_start}</div>
                                <div>Ngày kết thúc: {dataRegister.date_end}</div>
                            </>
                        ) : (
                            <>
                                <div>Ngày hẹn: {dataRegister.date}</div>
                                <div>Ca hẹn: {dataRegister.valueTimeType}</div>
                            </>
                        )}
                    </InfoColumn>
                </CardContent>
            </CardBody>

            <RegisterNextSection>
                <span>Bạn muốn đăng ký thêm dịch vụ khác?</span>
                <CuteButton type="primary" onClick={handleRegister}>
                    Đăng Ký Tiếp
                </CuteButton>
            </RegisterNextSection>
        </TicketWrapper>
    )
};