import React, { useEffect, useState } from 'react';
import { Steps, Space, Typography } from 'antd';
import './index.scss';
import {
    Form,
} from 'antd';
import { Payment } from './payment';
import { Register } from './register';
import { Ticket } from './ticket';
import usePet from 'hooks/usePet';
import useService from 'hooks/useService';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
}

const ServiceRegisterPet = () => {
    const [formRegister, formPayment] = Form.useForm();
    const { allPets, setAllPets, customerPets, setCustomerPets } = usePet()
    const { serviceAppointment, serviceBeauty, serviceStorage, } = useService()
    const [stepCurrent, setStepCurrent] = useState(0);
    const [serviceCurrent, setServiceCurrent] = useState('service_01');
    const [dataRegister, setDataRegister] = useState({});
    const [idOrder, setIdOrder] = useState('');

    return (
        <div className="service-register__container">
            <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Typography.Title level={2}>Đăng ký dịch vụ</Typography.Title>
                <br /><br />
            </Space>

            <div className="service-register__content">
                <div className="service-register__content__step">
                    <Steps
                        current={stepCurrent}
                        items={[
                            {
                                title: 'Đăng ký dịch vụ',
                            },
                            {
                                title: 'Thanh toán',
                            },
                            {
                                title: 'Phiếu dịch vụ',
                            },
                        ]}
                    />
                </div>
                {
                    (
                        stepCurrent === 0 &&
                        <Register
                            form={formRegister}
                            stepCurrent={stepCurrent}
                            setStepCurrent={setStepCurrent}
                            formItemLayout={formItemLayout}
                            serviceCurrent={serviceCurrent}
                            setServiceCurrent={setServiceCurrent}
                            dataRegister={dataRegister}
                            setDataRegister={setDataRegister}
                            customerPets={customerPets}
                            serviceAppointment={serviceAppointment}
                            serviceBeauty={serviceBeauty}
                            serviceStorage={serviceStorage}
                        />
                    )
                    ||
                    (
                        stepCurrent === 1 &&
                        <Payment
                            form={formPayment}
                            stepCurrent={stepCurrent}
                            setStepCurrent={setStepCurrent}
                            formItemLayout={formItemLayout}
                            dataRegister={dataRegister}
                            serviceCurrent={serviceCurrent}
                            idOrder={idOrder}
                            setIdOrder={setIdOrder}
                        />
                    )
                    ||
                    (
                        stepCurrent === 2 &&
                        <Ticket
                            stepCurrent={stepCurrent}
                            setStepCurrent={setStepCurrent}
                            formItemLayout={formItemLayout}
                            serviceCurrent={serviceCurrent}
                            setServiceCurrent={setServiceCurrent}
                            dataRegister={dataRegister}
                            setDataRegister={setDataRegister}
                            idOrder={idOrder}
                        />
                    )
                }
            </div>
        </div >
    )
}

export default ServiceRegisterPet;