import React from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import messages from 'assets/lang/messages'
import auth from 'api/auth'
import './forgot-password.scss'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

function ForgotPassword() {
    const navigate = useNavigate();

    const handleSubmit = async (email) => {
        try {
            if (email) {
                const res = await auth.forgotPassword(email);
                if (res && res.status === 200) {
                    toast.success("Hãy kiểm tra email của bạn!");
                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const handleToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="forgotPassword-container" >
            <div className="forgotPassword-container__sub">
                <div className="forgotPassword-container__sub__content">
                    <Form
                        layout="vertical"
                        name="forgotPassword"
                        className="forgotPassword-container__sub__content__form"
                        onFinish={handleSubmit}
                    >
                        <div className='forgotPassword-container__sub__content__form__header'>
                            <h3 className='forgotPassword-container__sub__content__form__header__title'>
                                Quên mật khẩu
                            </h3>
                            <hr />
                            <div className='forgotPassword-container__sub__content__form__header__sub-title'>
                                Hãy nhập địa chỉ email của bạn, chúng tôi sẽ gửi hướng dẫn tới email của bạn
                            </div>
                        </div>

                        <Form.Item
                            label="Email"
                            className="form-item"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: messages['email_required'],
                                },
                                {
                                    type: 'email',
                                    message: messages['invalid_email'],
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Enter email"
                                autoComplete="email"
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="forgotPassword-form-button"
                            onClick={() => handleSubmit()}>
                            Gửi
                        </Button>
                    </Form>
                    <div className="login">
                        Quay lại
                        <span className='login-link' onClick={() => handleToLogin()}>Trang đăng nhập</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
