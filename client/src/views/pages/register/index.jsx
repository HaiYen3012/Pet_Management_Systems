import React, { useState } from 'react'
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd'
import './register.scss'
import { useNavigate } from 'react-router-dom'
import auth from 'api/auth'
import { toast } from 'react-toastify'
const { Option } = Select

function Register() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // const { setToken } = useAuth()
  const handleSubmit = async (dataUser) => {
    try {
      const response = await auth.register(dataUser)
      if (response.status === 200) {
        // setToken(response.data.token)
        toast.success(response.statusText)
        handleToLogin()
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="register-container">
      <div className="register-container__sub">
        <div className="register-container__sub__content">
          <Form
            layout="vertical"
            // {...formItemLayout}
            form={form}
            name="register"
            onFinish={handleSubmit}
            initialValues={{
              prefix: '84',
            }}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
            <div className="register-container__sub__content__form__header">
              <h3 className="register-container__sub__content__form__header__title">
                Tạo tài khoản
              </h3>
              <hr />
              <div className="register-container__sub__content__form__header__sub-title">
                Tạo một tài khoản để tận hưởng các dịch vụ của chúng tôi
              </div>
            </div>
            <Form.Item
              name="fullname"
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập họ và tên của bạn!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập tên đăng nhập!',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'Địa chỉ E-mail không hợp lệ!',
                },
                {
                  required: true,
                  message: 'Hãy nhập E-mail của bạn',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone_numbers"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập số điện thoại!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mật khẩu!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Hãy xác nhận lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('Mật khẩu của bạn không trùng khớp!'),
                    )
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Hãy chấp nhận điều khoản!')),
                },
              ]}
            >
              <Checkbox className="checkbox-agreement">
                Tôi đồng ý với <a href="">các điều khoản</a>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-register">
                Tạo tài khoản
              </Button>
            </Form.Item>
          </Form>
          <div className="to-login">
            Bạn đã có tài khoản?{' '}
            <span className="login-link" onClick={() => handleToLogin()}>
              Đăng nhập
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
