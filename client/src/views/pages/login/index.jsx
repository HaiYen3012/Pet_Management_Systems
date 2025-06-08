import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Modal, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import messages from 'assets/lang/messages'
import auth from 'api/auth'
import './login.scss' // Giữ nguyên file scss đã làm đẹp ở bước trước
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAuth from 'hooks/useAuth'

const takePath = (roles) => {
  switch (roles) {
    case 'customer':
      return '/pet'
    case 'staff':
      return '/staff/pet-manage'
    case 'admin':
      return '/admin/statistics'
    case 'doctor':
      return '/staff/pet-manage'
    default:
      return '/' // Thêm một đường dẫn mặc định
  }
}

function Login() {
  const navigate = useNavigate()
  const { isLoggedIn, setUserState, userData } = useAuth()
  const [redirectToReferrer, setRedirectToReferrer] = useState(false)
  const { state } = useLocation() // Dùng để lấy đường dẫn trước đó nếu có

  // TỐI ƯU: Sử dụng useEffect để xử lý chuyển hướng SAU KHI đăng nhập thành công
  useEffect(() => {
    // Nếu isLoggedIn là true, chuyển hướng người dùng
    if (isLoggedIn) {
      // Ưu tiên chuyển hướng về trang người dùng muốn vào trước khi bị đá ra login
      // Nếu không có, chuyển về trang mặc định theo role
      navigate(state?.from || takePath(userData.roles), { replace: true })
    }
  }, [isLoggedIn, navigate, userData, state]) // Phụ thuộc vào các giá trị này

  const handleSubmit = async (dataUser) => {
    try {
      const response = await auth.login(dataUser)
      if (response.status === 200) {
        toast.success('Đăng nhập thành công')
        // Chỉ cần cập nhật state, useEffect ở trên sẽ lo việc chuyển hướng
        setUserState(response.data)
      }
    } catch (error) {
      console.log('error: ', error)
      // Bạn có thể lấy thông báo lỗi chi tiết hơn từ server nếu có
      // Ví dụ: toast.error(error.response.data.message || 'Đăng nhập thất bại');
      toast.error('Tài khoản hoặc mật khẩu không chính xác')
    }
  }

  const handleToRegister = () => {
    navigate('/register')
  }
  
  const handleToForgotPassword = () => {
    navigate('/forgot-password')
  }

  // Nếu người dùng đã đăng nhập từ trước, chuyển hướng họ ngay lập tức
  if (isLoggedIn) {
    return <Navigate to={state?.from || takePath(userData.roles)} replace />
  }

  return (
    <div className="login-container">
      <div className="login-container__sub">
        <div className="login-container__sub__content">
          {/* THÊM MỚI: Tích hợp logo vào giao diện */}
          <div className="login-container__logo">
            <UserOutlined />
          </div>

          <Form
            layout="vertical"
            name="login"
            className="login-container__sub__content__form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit} // Antd Form sẽ tự động truyền dữ liệu vào đây
          >
            <div className="login-container__sub__content__form__header">
              <h3 className="login-container__sub__content__form__header__title">
                Sign in
              </h3>
              {/* <hr /> Đã xóa thẻ hr không cần thiết */}
              <div className="login-container__sub__content__form__header__sub-title">
                Chào mừng bạn trở lại!
              </div>
            </div>

            <Form.Item
              label="Địa chỉ email"
              className="form-item"
              name="email"
              rules={[
                { required: true, message: messages['email_required'] },
                { type: 'email', message: messages['invalid_email'] },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              className="form-item"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
                className="input-password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="remember-forgot">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>

                <div
                  className="login-form-forgot"
                  onClick={handleToForgotPassword}
                >
                  Quên mật khẩu?
                </div>
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              // ĐÃ XÓA: onClick thừa, onFinish đã xử lý tất cả
            >
              Đăng nhập
            </Button>
          </Form>

          <div className="register">
            Chưa có tài khoản?{' '}
            <span className="register-link" onClick={handleToRegister}>
              Đăng ký tại đây
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login