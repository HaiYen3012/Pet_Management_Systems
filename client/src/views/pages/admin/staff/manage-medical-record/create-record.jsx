import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, Checkbox, Modal } from 'antd';
import React, { useEffect, useState } from 'react';


const CreateRecord = ({ isModalCreate, handleOk, handleCancel, form, onFinish }) => {

    return (
        <Modal
            title={"Tạo hồ sơ khám bệnh"}
            open={isModalCreate}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            width={630}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit}>
                    Thêm
                </Button>
            ]}
        >
            <Form
                form={form}
                name="addNewCustomer"
                onFinish={onFinish}
                style={{ maxWidth: 700, margin: '0 auto' }}
                scrollToFirstError
            >
                <Form.Item name='symptoms' label="Triệu chứng">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name='diagnostic' label="Chuẩn đoán">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Triệt sản" name="neutered" valuePropName="checked">
                    <Checkbox>Đã triệt sản</Checkbox>
                </Form.Item>

                <Form.Item label="Đơn thuốc">
                    <Form.List name="prescriptions">
                        {(fields, { add, remove }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: 16,
                                }}
                            >
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'medicine']}
                                            fieldKey={[fieldKey, 'medicine']}
                                            rules={[{ required: true, message: 'Thiếu tên thuốc' }]}
                                            noStyle
                                        >
                                            <Input placeholder="Thuốc" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'dosage']}
                                            fieldKey={[fieldKey, 'dosage']}
                                            rules={[{ required: true, message: 'Thiếu liều lượng' }]}
                                            noStyle
                                        >
                                            <Input placeholder="Liều lượng" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'note']}
                                            fieldKey={[fieldKey, 'note']}
                                            noStyle
                                        >
                                            <Input placeholder="Ghi chú" />
                                        </Form.Item>
                                        <CloseOutlined
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm loại thuốc
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Form.Item>

            </Form>
        </Modal >
    )
}

export default CreateRecord;