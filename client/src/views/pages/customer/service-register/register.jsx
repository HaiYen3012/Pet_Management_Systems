import React, { useEffect, useState } from 'react';
import { DatePicker, ConfigProvider, Form, Input, Select, Button } from 'antd';
import viVN from 'antd/locale/vi_VN';

const { Option } = Select;
const { RangePicker } = DatePicker;

// ===================================================================
// BẮT ĐẦU PHẦN GIAO DIỆN "VÀNG CUTE"
// ===================================================================

const cuteYellowTheme = {
    token: {
        colorPrimary: '#FFC700',
        borderRadius: 16,
        colorBgContainer: '#FFFBEB',
        colorTextBase: '#3A3A3A',
    },
    components: {
        Button: {
            colorPrimaryHover: '#FFD700',
        },
        Select: {
            optionSelectedBg: '#FFFBEB',
        }
    },
};

// CSS đã được bỏ đi phần .cute-title
const CuteStyle = () => (
    <style>{`
    .cute-yellow-form-container {
      background-color: #FFFBEB;
      padding: 30px; /* Giảm padding một chút cho hợp lý khi không có tiêu đề */
      border-radius: 24px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid #FFF1C1;
    }
    
    .ant-form-item-label > label {
        font-weight: 500;
        color: #555 !important;
    }

    .ant-picker-input > input::placeholder {
        color: #BFBFBF !important;
    }
  `}</style>
);


// ===================================================================
// KẾT THÚC PHẦN GIAO DIỆN
// TOÀN BỘ LOGIC BÊN DƯỚI ĐƯỢC GIỮ NGUYÊN
// ===================================================================


const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
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
        <ConfigProvider theme={cuteYellowTheme} locale={viVN}>
            <CuteStyle />
            {/* Mình đã đổi tên class để rõ nghĩa hơn và bỏ đi tiêu đề h2 */}
            <div className="cute-yellow-form-container"> 
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
                    {/* Toàn bộ các Form.Item được giữ nguyên */}
                    <Form.Item
                        name="service"
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
                    >
                        <Select placeholder="Lựa chọn dịch vụ"
                            onChange={(e) => handleSelect(e)}
                            defaultValue={'service_01'}
                        >
                            <Option value="service_01">Dịch vụ khám chữa bệnh</Option>
                            <Option value="service_02">Dịch vụ trông giữ</Option>
                            <Option value="service_03">Dịch vụ làm đẹp</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="pet_id"
                        label="Tên thú cưng"
                        rules={[{ required: true, message: 'Vui lòng chọn thú cưng!' }]}
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
                            { type: 'email', message: 'Email không hợp lệ!' },
                            { required: true, message: 'Vui lòng nhập E-mail!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone_numbers"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>

                    {serviceCurrent === 'service_02' &&
                        <Form.Item
                            label="Chọn loại phòng"
                            name="room_id"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                        >
                            <Select
                                placeholder="Lựa chọn loại phòng"
                                onChange={handlePrice}
                            >
                                {
                                    serviceStorage && serviceStorage.length > 0 &&
                                    serviceStorage.map((item, index) => (
                                        <Option
                                            key={index}
                                            value={item.id}
                                            disabled={(item.max_slot - item.current_slot) <= 0}>
                                            {item.type}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item
                        name="date"
                        label="Thời gian"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                    >
                        {serviceCurrent === 'service_02'
                            ? <RangePicker style={{ width: '100%' }} placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}/>
                            : <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày"/>
                        }
                    </Form.Item>

                    {serviceCurrent !== 'service_02' &&
                        <Form.Item
                            name="time_slot"
                            label="Ca thực hiện"
                            rules={[{ required: true, message: 'Vui lòng chọn ca thực hiện!' }]}
                        >
                            <Select
                                placeholder="Lựa chọn ca"
                                onChange={handlePrice}
                            >
                                {serviceCurrent === 'service_01' && serviceAppointment?.map((item, index) => (
                                    <Option key={index} value={item.id}>{item.time}</Option>
                                ))}
                                {serviceCurrent === 'service_03' && serviceBeauty?.map((item, index) => (
                                    <Option key={index} value={item.id}>{item.time}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item
                        name="note"
                        label={serviceCurrent === 'service_01' ? "Mô tả triệu chứng" : "Lời nhắn"}
                    >
                        <Input.TextArea showCount maxLength={100} placeholder="Nhập ghi chú của bạn..."/>
                    </Form.Item>

                    <Form.Item
                        label="Thành tiền"
                    >
                        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#D69E2E' }}>
                            {formatCurrencyVND(price)}
                        </span>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" size="large">
                            Đăng Ký Ngay
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </ConfigProvider>
    )
}