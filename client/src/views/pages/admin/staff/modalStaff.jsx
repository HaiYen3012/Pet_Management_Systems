import React, { useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import staff from 'api/staff';
import { toast } from 'react-toastify';
import './modal-staff.scss';

const ModalStaff = (props) => {
  const { form, isModalOpen, handleOk, handleCancel, action, dataModal, fetchData } = props;

  const onFinish = async (values) => {
    try {
      if (action === 'CREATE') {
        const res = await staff.createStaff(values);
        if (res && res.status === 201) {
          toast.success('Thêm nhân viên thành công!');
          fetchData();
          handleOk();
        }
      } else if (action === 'UPDATE') {
        const res = await staff.updateStaffInfo(values.user_id, {
          fullname: values.fullname,
          email: values.email,
          username: values.username,
          phone_numbers: values.phone_numbers,
          address: values.address,
          city: values.city,
          country: values.country,
        });
        if (res && res.status === 201) {
          toast.success(`Chỉnh sửa thông tin nhân viên ${values.user_id} thành công!`);
          fetchData();
          handleOk();
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
  };

  useEffect(() => {
    form.setFieldsValue({
      user_id: dataModal.user_id,
      fullname: dataModal.fullname,
      username: dataModal.username,
      email: dataModal.email,
      phone_numbers: dataModal.phone_numbers,
      address: dataModal.address,
      city: dataModal.city,
      country: dataModal.country,
    });
  }, [dataModal, form]);

  return (
    <Modal
      title={action === 'CREATE' ? 'Thêm mới nhân viên' : 'Cập nhật thông tin nhân viên'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width={630}
      footer={null}
      className="pet-add-modal"
    >
      <div className="pet-form-section">
        <Form
          {...formItemLayout}
          form={form}
          name="addNewStaff"
          onFinish={onFinish}
          className="pet-form"
          scrollToFirstError
          initialValues={{
            user_id: dataModal.user_id,
            fullname: dataModal.fullname,
            username: dataModal.username,
            email: dataModal.email,
            phone_numbers: dataModal.phone_numbers,
            address: dataModal.address,
            city: dataModal.city,
            country: dataModal.country,
          }}
        >
          {action === 'CREATE' ? null : (
            <Form.Item name="user_id" label="ID">
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: 'Hãy nhập họ và tên nhân viên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Hãy nhập tên đăng nhập!' }]}
          >
            <Input disabled={action === 'UPDATE'} />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { type: 'email', message: 'The input is not valid E-mail!' },
              { required: true, message: 'Please input your E-mail!' },
            ]}
          >
            <Input disabled={action === 'UPDATE'} />
          </Form.Item>

          <Form.Item
            name="phone_numbers"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city"
            label="Thành phố"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label="Quốc tịch"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          {action === 'UPDATE' ? null : (
            <>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="password2"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Hãy xác nhận lại mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu của bạn không trùng khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <div className="pet-form-buttons">
            <Button type="primary" htmlType="submit">
              {action === 'CREATE' ? 'Thêm' : 'Lưu'}
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalStaff;