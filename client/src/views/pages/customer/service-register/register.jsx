import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
} from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
const convertDate = (dateString) => {
    console.log(dateString);
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // const formattedDate = `${day}/${month}/${year}`;
    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
}


export const Register = (props) => {
    const { form, stepCurrent, setStepCurrent, formItemLayout,
        serviceCurrent, setServiceCurrent, dataRegister, setDataRegister,
        customerPets, serviceAppointment, serviceBeauty, serviceStorage } = props;

    const [price, setPrice] = useState(0);
    const [valueTimeType, setValueTimeType] = useState('');

    const onFinishRegister = (values) => {
        let formData = {};
        if (serviceCurrent === 'service_02') {
            let date_start = convertDate(values.date[0].$d);
            let date_end = convertDate(values.date[1].$d);
            formData = {
                ...values,
                valueTimeType,
                status: "created",
                date_start,
                date_end,
                total: price
            };
        } else {
            let date = convertDate(values.date.$d);
            formData = {
                ...values,
                valueTimeType,
                status: "created",
                date,
                total: price
            };
        }

        setStepCurrent(stepCurrent + 1);
        setDataRegister(formData)
        form.resetFields();
    };

    const handleSelect = (value) => {
        setPrice(0);
        setServiceCurrent(value);
    }

    const formatCurrencyVND = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value) + ' VNĐ';
    };


    const handlePrice = (value, object) => {
        setValueTimeType(object.children);
        let serviceSelected = [];

        switch (serviceCurrent) {
            case 'service_01':
                serviceSelected = serviceAppointment;
                break;
            case 'service_02':
                serviceSelected = serviceStorage;
                break;
            case 'service_03':
                serviceSelected = serviceBeauty;
                break;
            default:
                serviceSelected = [];
        }
        const selected = serviceSelected.find(item => item.id === value);
        if (selected) {
            setPrice(selected.price);
        }
    };

    return (
        <div className="service-register__content__form-register">
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinishRegister}
                style={{ maxWidth: 700, margin: '0 auto' }}
                scrollToFirstError
                initialValues={{
                    service: 'service_01',
                }}
            >
                <Form.Item
                    name="service"
                    label="Tên dịch vụ"
                    rules={[{ required: true, message: 'Please select service!' }]}
                >
                    <Select placeholder="Lựa chọn dịch vụ"
                        onChange={(e) => handleSelect(e)}
                        defaultValue={'service_01'}
                    >
                        <Option value="service_01">Dịch vụ khám chữa bệnh</Option>
                        <Option value="service_02">Dịch vụ lưu trữ</Option>
                        <Option value="service_03">Dịch vụ vệ sinh</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="pet_id"
                    label="Tên thú cưng"
                    rules={[{ required: true, message: 'Please select name pet!' }]}
                >
                    <Select placeholder="Lựa chọn tên thú cưng">
                        {
                            customerPets && customerPets.length > 0 &&
                            customerPets.map((item, index) => {
                                return (
                                    <Option key={index} value={item.pet_id}>{item.fullname}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone_numbers"
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                {
                    serviceCurrent !== 'service_02' ? null :
                        <Form.Item
                            label="Chọn loại phòng"
                            name="room_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Lựa chọn loại phòng"
                                style={{ width: 200 }}
                                onChange={handlePrice}
                            >
                                {
                                    serviceStorage && serviceStorage.length > 0 &&
                                    serviceStorage.map((item, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={item.id}
                                                disabled={(item.max_slot - item.current_slot) <= 0}>
                                                {item.type}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                }

                <Form.Item
                    name="date"
                    label="Thời gian"
                    rules={[
                        {
                            // type: 'object',
                            required: true,
                            message: 'Please select time!'
                        }
                    ]}
                >
                    {serviceCurrent === 'service_02' ? <RangePicker /> : <DatePicker />}
                </Form.Item>

                {
                    serviceCurrent === 'service_02' ? null :
                        <Form.Item
                            name="time_slot"
                            label="Ca thực hiện"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Select
                                placeholder="Lựa chọn ca"
                                style={{ width: 150 }}
                                onChange={handlePrice}
                            >
                                {
                                    serviceCurrent === 'service_01' &&
                                    serviceAppointment && serviceAppointment.length > 0 &&
                                    serviceAppointment.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.time}</Option>
                                        )
                                    })
                                }
                                ||
                                {
                                    serviceCurrent === 'service_03' &&
                                    serviceBeauty && serviceBeauty.length > 0 &&
                                    serviceBeauty.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.time}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                }

                <Form.Item
                    name="note"
                    label={serviceCurrent === 'service_01' ? "Mô tả triệu chứng" : "Lời nhắn"}
                    rules={[{ required: false, message: 'Please input description' }]}
                >
                    <Input.TextArea showCount maxLength={100} />
                </Form.Item>

                <Form.Item
                    name="total"
                    label="Thành tiền"
                >
                    {formatCurrencyVND(price)}
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
