import React from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import messages from 'assets/lang/messages'
import auth from 'api/auth'
import './reset-password.scss'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify'

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const handleSubmit = async (dataUser) => {
        if (dataUser) {
            try {
                const token = searchParams.get("token");
                const email = searchParams.get("email");
                const { password, password2 } = dataUser;
                let data = {
                    token: token,
                    email: email,
                    password: password,
                    password2: password2,
                }
                const res = await auth.resetPassword(data);
                if (res && res.status === 200) {
                    toast.success("Mật khẩu đã đổi thành công!");
                    navigate('/login');
                }
            } catch (error) {
                console.log("error: ", error);
            }
        }
    }

    return (
        <div className="resetPassword-container" >
            <div className="resetPassword-container__sub">
                <div className="resetPassword-container__sub__content">
                    <Form
                        layout="vertical"
                        name="resetPassword"
                        className="resetPassword-container__sub__content__form"
                        onFinish={handleSubmit}
                    >
                        <div className='resetPassword-container__sub__content__form__header'>
                            <h3 className='resetPassword-container__sub__content__form__header__title'>
                                Quên mật khẩu
                            </h3>
                            <hr />
                            <div className='resetPassword-container__sub__content__form__header__sub-title'>
                                Hãy nhập mật khẩu mới
                            </div>
                        </div>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mật khẩu mới!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password autoComplete="reset-password" />
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            label="Xác nhận mật khẩu mới"
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
                            <Input.Password autoComplete="reset-password" />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="resetPassword-form-button"
                            onClick={() => handleSubmit()}>
                            Thay đổi mật khẩu
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
