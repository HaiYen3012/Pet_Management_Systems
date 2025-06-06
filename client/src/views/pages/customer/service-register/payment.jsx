import React, { useState } from 'react';
import { DatePicker } from 'antd';
import {
    Button,
    Form,
    Input,
} from 'antd';
import service from 'api/service';

export const Payment = (props) => {
    const { form, stepCurrent, setStepCurrent, formItemLayout, dataRegister, serviceCurrent, idOrder, setIdOrder } = props;
    const onFinishPayment = async (values) => {
        try {
            let req = {};
            switch (serviceCurrent) {
                case 'service_01':
                    req = await service.createAppointment(dataRegister);
                    setIdOrder(req.data?.appointment_order?.id);
                    break;
                case 'service_02':
                    req = await service.createStorage(dataRegister);
                    setIdOrder(req.data?.storageOrder?.id);
                    break;
                case 'service_03':
                    req = await service.createBeauty(dataRegister);
                    setIdOrder(req.data?.beauty_order?.id);
                    break;
                default:
                    req = {};
                    break;
            }

            if (req && req.status === 201) {
                console.log(req);
                setStepCurrent(stepCurrent + 1);
                form.resetFields();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="service-register__content__form-payment">
            <Form
                {...formItemLayout}
                form={form}
                name="payment"
                onFinish={onFinishPayment}
                style={{ maxWidth: 700, margin: '0 auto' }}
                scrollToFirstError
            >
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="creditNumber"
                    label="Credit Number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="expDate"
                    label="Exp Date"
                    rules={[
                        {
                            type: 'object',
                            required: true,
                            message: 'Please select time!'
                        }
                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    name="cvv"
                    label="CVV"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="zipCode"
                    label="Zip Code"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Thanh toán
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}