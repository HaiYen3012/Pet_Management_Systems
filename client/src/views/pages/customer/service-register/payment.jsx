import React, { useState } from 'react';
import { DatePicker, Form, Input, Button, ConfigProvider, Flex } from 'antd';
import viVN from 'antd/locale/vi_VN';
import service from 'api/service'; // Giả sử import này đúng

// ===================================================================
// BẮT ĐẦU PHẦN GIAO DIỆN "THIỆT ĐẸP"
// ===================================================================

// 1. Tái sử dụng theme "vàng cute" để đảm bảo tính nhất quán
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
    },
};

// 2. CSS để tạo hình ảnh thẻ tín dụng và bố cục mới
const PaymentStyle = () => (
    <style>{`
    .payment-container {
      background-color: #FFFBEB;
      padding: 40px;
      border-radius: 24px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid #FFF1C1;
      max-width: 550px; /* Thu hẹp lại để tập trung hơn */
      margin: 40px auto;
    }

    .credit-card {
      background: linear-gradient(45deg, #d3a22f, #ffc700);
      border-radius: 15px;
      padding: 25px;
      color: white;
      position: relative;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      font-family: 'Courier New', Courier, monospace; /* Font chữ giống thẻ thật */
      margin-bottom: 30px;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .credit-card__chip {
      width: 50px;
      height: 40px;
      background: linear-gradient(135deg, #ffe9a9, #d1a84f);
      border-radius: 5px;
    }

    .credit-card__number {
      font-size: 24px;
      letter-spacing: 3px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    
    .credit-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 14px;
        text-transform: uppercase;
    }

    .credit-card__holder-label, .credit-card__expiry-label {
        font-size: 10px;
        opacity: 0.7;
        margin-bottom: 5px;
    }

    .ant-form-item {
        margin-bottom: 18px; /* Giảm khoảng cách giữa các field */
    }

    .ant-form-item-label > label {
        font-weight: 500;
        color: #555 !important;
    }

    .payment-form .ant-btn-primary {
        width: 100%;
        height: 45px;
        font-size: 16px;
    }
  `}</style>
);


// ===================================================================
// KẾT THÚC PHẦN GIAO DIỆN
// LOGIC BÊN DƯỚI ĐƯỢC GIỮ NGUYÊN HOÀN TOÀN
// ===================================================================


export const Payment = (props) => {
    // Logic props và state gốc được giữ nguyên
    const { form, stepCurrent, setStepCurrent, dataRegister, serviceCurrent, idOrder, setIdOrder } = props;
    
    // Thêm state để cập nhật giao diện thẻ tín dụng
    const [cardInfo, setCardInfo] = useState({
        number: '•••• •••• •••• ••••',
        holder: 'HỌ VÀ TÊN',
        expiry: 'MM/YY'
    });

    // Hàm xử lý khi người dùng nhập thông tin vào form
    const handleFormChange = (changedValues, allValues) => {
        const { creditNumber, fullName, expDate } = allValues;

        // Cập nhật số thẻ
        let formattedNumber = creditNumber ? creditNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '' : '';
        formattedNumber += '•••• •••• •••• ••••'.substring(formattedNumber.length);
        
        // Cập nhật ngày hết hạn
        const formattedDate = expDate ? expDate.format('MM/YY') : 'MM/YY';

        setCardInfo({
            number: formattedNumber,
            holder: fullName || 'HỌ VÀ TÊN',
            expiry: formattedDate
        });
    }

    // Logic submit form gốc được giữ nguyên
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
    
    // Bỏ formItemLayout từ props để tự định nghĩa layout mới đẹp hơn
    const formLayout = {
        labelCol: { span: 24 }, // Label nằm trên input
        wrapperCol: { span: 24 },
    };

    return (
        <ConfigProvider theme={cuteYellowTheme} locale={viVN}>
            <PaymentStyle />
            <div className="payment-container">
                {/* Visual Credit Card */}
                <div className="credit-card">
                    <div className="credit-card__chip"></div>
                    <div className="credit-card__number">{cardInfo.number}</div>
                    <div className="credit-card__footer">
                        <div>
                            <div className="credit-card__holder-label">Chủ thẻ</div>
                            <div className="credit-card__holder">{cardInfo.holder}</div>
                        </div>
                        <div>
                            <div className="credit-card__expiry-label">Ngày hết hạn</div>
                            <div className="credit-card__expiry">{cardInfo.expiry}</div>
                        </div>
                    </div>
                </div>

                {/* Form thanh toán */}
                <Form
                    {...formLayout}
                    form={form}
                    name="payment"
                    onFinish={onFinishPayment}
                    onValuesChange={handleFormChange} // Hook để cập nhật thẻ trực quan
                    className="payment-form"
                    scrollToFirstError
                >
                    <Form.Item
                        name="creditNumber"
                        label="Số thẻ"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số thẻ!' },
                            { pattern: /^[0-9\s]{16,19}$/, message: 'Số thẻ không hợp lệ!'},
                        ]}
                    >
                        <Input placeholder="0000 0000 0000 0000" maxLength={19}/>
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Họ và tên chủ thẻ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ!' }]}
                    >
                        <Input placeholder="NGUYEN VAN A" />
                    </Form.Item>

                    <Flex gutter={16} justify="space-between">
                        <Form.Item
                            name="expDate"
                            label="Ngày hết hạn"
                            style={{ flex: 1, marginRight: '8px' }}
                            rules={[{ type: 'object', required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker picker="month" format="MM/YYYY" style={{ width: '100%' }} placeholder="MM/YYYY"/>
                        </Form.Item>

                        <Form.Item
                            name="cvv"
                            label="CVV"
                            style={{ flex: 1, marginLeft: '8px' }}
                            rules={[{ required: true, message: 'Vui lòng nhập CVV!' }, {pattern: /^[0-9]{3,4}$/, message: "CVV không hợp lệ!"}]}
                        >
                            <Input.Password placeholder="•••" maxLength={4}/>
                        </Form.Item>
                    </Flex>
                    
                    {/* Zip Code thường không bắt buộc ở VN, nhưng vẫn giữ lại theo code gốc */}
                    <Form.Item
                        name="zipCode"
                        label="Zip Code (Nếu có)"
                        rules={[{ required: false, message: 'Vui lòng nhập Zip Code!' }]}
                    >
                        <Input placeholder="Mã bưu chính"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="primary" htmlType="submit">
                            Thanh Toán
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </ConfigProvider>
    )
}