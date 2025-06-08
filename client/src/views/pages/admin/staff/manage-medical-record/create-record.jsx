import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Checkbox, Modal, ConfigProvider } from 'antd';
import React from 'react';

// === THEME NÂNG CẤP: LUXURY GOLD & DEEP BROWN ===
const luxuryGoldTheme = {
    token: {
        // --- Bảng màu ---
        colorPrimary: '#E2B646', // Vàng Gold ấm
        colorInfo: '#E2B646',
        colorText: '#61481C', // Nâu sẫm cho chữ
        colorTextSecondary: '#8c6d3f',
        colorBgContainer: '#FFFBF2', // Nền màu kem ấm áp
        colorBorder: '#EAE0C8',
        borderRadius: 8,
    },
    components: {
        // --- Tùy chỉnh riêng cho từng Component ---
        Modal: {
            // headerBg: '#FFFBF2', // <-- ĐÃ XÓA DÒNG NÀY
            titleColor: '#61481C',
            titleFontSize: 20,
        },
        Form: {
            labelColor: '#8c6d3f',
            labelFontSize: 14,
            verticalLabelPadding: '0 0 8px',
        },
        Button: {
            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
            defaultGhostColor: '#61481C',
            defaultGhostBorderColor: '#EAE0C8',
        },
        Input: {
            activeBorderColor: '#E2B646',
            hoverBorderColor: '#E2B646',
        },
        Checkbox: {
            colorPrimary: '#E2B646',
            colorPrimaryHover: '#f0c96a',
        },
    },
};

// --- Component được thiết kế lại ---
const CreateRecord = ({ isModalCreate, handleOk, handleCancel, form, onFinish }) => {

    return (
        <ConfigProvider theme={luxuryGoldTheme}>
            <Modal
                title="Tạo hồ sơ khám bệnh"
                open={isModalCreate}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={630}
                footer={[
                    <Button key="cancel" type="ghost" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={form.submit}>
                        Tạo hồ sơ
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    name="createRecordForm"
                    onFinish={onFinish}
                    style={{ maxWidth: 700, margin: '24px auto 0' }}
                    scrollToFirstError
                    layout="vertical"
                >
                    <Form.Item name='symptoms' label="Triệu chứng lâm sàng">
                        <Input.TextArea rows={3} placeholder="Mô tả các triệu chứng của thú cưng..." />
                    </Form.Item>

                    <Form.Item name='diagnostic' label="Chuẩn đoán của bác sĩ">
                        <Input.TextArea rows={3} placeholder="Dựa trên triệu chứng, đưa ra chuẩn đoán..." />
                    </Form.Item>

                    <Form.Item name="neutered" valuePropName="checked" style={{ marginBottom: 24 }}>
                        <Checkbox>Thú cưng đã được triệt sản</Checkbox>
                    </Form.Item>

                    <Form.Item label="Kê đơn thuốc">
                        <Form.List name="prescriptions">
                            {(fields, { add, remove }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                padding: '16px',
                                                border: '1px solid #EAE0C8',
                                                borderRadius: '8px',
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            <Space align="baseline" style={{ display: 'flex', flex: 1, gap: '16px' }}>
                                                <Form.Item {...restField} name={[name, 'medicine']} rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]} style={{ flex: 2, margin: 0 }}>
                                                    <Input placeholder="Tên thuốc" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'dosage']} rules={[{ required: true, message: 'Vui lòng nhập liều lượng!' }]} style={{ flex: 1.5, margin: 0 }}>
                                                    <Input placeholder="Liều lượng (VD: 1 viên/ngày)" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'note']} style={{ flex: 2, margin: 0 }}>
                                                    <Input placeholder="Ghi chú" />
                                                </Form.Item>
                                            </Space>
                                            <CloseOutlined
                                                style={{ cursor: 'pointer', color: '#B5A17E', fontSize: 16 }}
                                                onClick={() => remove(name)}
                                            />
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<CloseOutlined style={{transform: 'rotate(45deg)'}} />}>
                                        Thêm thuốc vào đơn
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    )
}

export default CreateRecord;