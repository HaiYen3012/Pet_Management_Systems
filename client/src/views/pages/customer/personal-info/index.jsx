import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Avatar, 
    Form, 
    Input, 
    Upload, 
    ConfigProvider, 
    Space,
    Divider,
    Skeleton,
    Typography
} from 'antd';
import { 
    UserOutlined, 
    SaveOutlined, 
    MailOutlined,
    CameraOutlined,
    HomeOutlined,
    PhoneOutlined,
    LockOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

import useAuth from 'hooks/useAuth';
import auth from 'api/auth';
import './personal-info.scss';

const { Title } = Typography;

const PersonalInfoSkeleton = () => (
    <div className="personal-info-wrapper">
        <Skeleton.Avatar active size={160} shape="circle" />
        <div style={{ width: '100%', maxWidth: 700, marginTop: '20px' }}>
            <Skeleton.Input active block style={{ marginBottom: '24px' }} />
            <Skeleton.Input active block style={{ marginBottom: '24px' }} />
            <Skeleton.Input active block style={{ marginBottom: '24px' }} />
            <Skeleton.Button active block size="large" />
        </div>
    </div>
);

const PersonalInfo = () => {
    const [form] = Form.useForm();
    const { userData, updateUserData } = useAuth();
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userData) {
            console.log('Setting form values with userData:', userData);
            form.setFieldsValue(userData);
        }
    }, [userData, form]);

    const handleChangePassword = async () => {
        setIsSendingEmail(true);
        try {
            console.log('Attempting to send password reset email for:', userData.email);
            const { data } = await auth.forgotPassword({ email: userData.email });
            console.log('Password reset response:', data);
            
            if (data.status === 'OK') {
                toast.success('Một email hướng dẫn đổi mật khẩu đã được gửi đi!');
            } else {
                toast.error('Không thể gửi email đổi mật khẩu. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            toast.error(`Có lỗi xảy ra: ${error.message || 'Vui lòng thử lại.'}`);
        } finally {
            setIsSendingEmail(false);
        }
    };
    
    const handleSubmit = async (values) => {
        console.log('Form submitted with values:', values);
        setIsSaving(true);
        
        try {
            // Kiểm tra xem updateUserData có tồn tại không
            if (typeof updateUserData !== 'function') {
                throw new Error('updateUserData function is not available');
            }

            // Đảm bảo luôn có username từ userData ban đầu
            const submitData = {
                ...values,
                username: values.username || userData.username, // Fallback to original username
                user_id: userData.user_id // Đảm bảo có user_id
            };

            console.log('Calling updateUserData with:', submitData);
            
            // Gọi API cập nhật
            const result = await updateUserData(submitData);
            console.log('Update result:', result);
            
            toast.success('Cập nhật thông tin thành công! 🎉');
            
        } catch(error) {
            console.error('Update error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response,
                request: error.request
            });
            
            // Hiển thị lỗi chi tiết hơn
            let errorMessage = 'Cập nhật thất bại. ';
            
            if (error.response) {
                // Lỗi từ server
                errorMessage += `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
            } else if (error.request) {
                // Lỗi network
                errorMessage += 'Không thể kết nối đến server. Kiểm tra kết nối mạng.';
            } else {
                // Lỗi khác
                errorMessage += error.message || 'Lỗi không xác định.';
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Thêm function để validate form trước khi submit
    const handleFormSubmit = () => {
        console.log('Form submit triggered');
        
        form.validateFields()
            .then(values => {
                console.log('Form validation passed:', values);
                handleSubmit(values);
            })
            .catch(errorInfo => {
                console.log('Form validation failed:', errorInfo);
                toast.error('Vui lòng kiểm tra lại thông tin đã nhập!');
            });
    };

    if (!userData) {
        console.log('userData is not available, showing skeleton');
        return <PersonalInfoSkeleton />;
    }
    
    console.log('Rendering PersonalInfo with userData:', userData);

    const antdTheme = {
        token: {
            colorPrimary: '#FCD34D',
            colorInfo: '#FCD34D',
            colorText: '#A16207',
            borderRadius: 12,
        },
    };

    return (
        <ConfigProvider theme={antdTheme}>
            <div className="personal-info-wrapper">
                <div className="personal-info__avatar">
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            console.log('Avatar upload attempt:', file);
                            // Thêm logic upload avatar ở đây
                            return false; // Prevent default upload for now
                        }}
                    >
                        <Avatar 
                            src={userData.avatar_url || null}
                            icon={<UserOutlined />} 
                        />
                    </Upload>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    onFinishFailed={(errorInfo) => {
                        console.log('Form finish failed:', errorInfo);
                        toast.error('Có lỗi trong form. Vui lòng kiểm tra lại!');
                    }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: '100%', maxWidth: 700 }}
                    initialValues={userData}
                >
                    <Form.Item 
                        label="Họ và tên" 
                        name="fullname" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên!' },
                            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Nguyễn Văn A"
                            onChange={(e) => console.log('Fullname changed:', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Tên đăng nhập" 
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="customer"
                            onChange={(e) => console.log('Username changed:', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Số điện thoại" 
                        name="phone_numbers" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input 
                            prefix={<PhoneOutlined />} 
                            placeholder="09xxxxxxxx"
                            onChange={(e) => console.log('Phone changed:', e.target.value)}
                        />
                    </Form.Item>
                    
                    <Form.Item label="Mật khẩu">
                        <Button
                            icon={<LockOutlined />}
                            loading={isSendingEmail}
                            onClick={handleChangePassword}
                        >
                            Yêu cầu đổi mật khẩu
                        </Button>
                    </Form.Item>

                    <Divider orientation="left" style={{borderColor: '#FDE68A'}}>
                        <HomeOutlined /> Thông tin địa chỉ
                    </Divider>

                    <Form.Item label="Quốc gia" name="country">
                        <Input 
                            prefix={<GlobalOutlined />} 
                            placeholder="Việt Nam"
                            onChange={(e) => console.log('Country changed:', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Thành phố" name="city">
                        <Input 
                            prefix={<EnvironmentOutlined />} 
                            placeholder="TP. Hồ Chí Minh"
                            onChange={(e) => console.log('City changed:', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Địa chỉ cụ thể" 
                        name="address" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ!' },
                            { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' }
                        ]}
                    >
                        <Input 
                            placeholder="Số nhà, tên đường, phường/xã..."
                            onChange={(e) => console.log('Address changed:', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            icon={<SaveOutlined />} 
                            loading={isSaving} 
                            block
                            onClick={() => console.log('Save button clicked')}
                        >
                            Lưu Thay Đổi
                        </Button>
                    </Form.Item>
                </Form>


            </div>
        </ConfigProvider>
    );
};

export default PersonalInfo;