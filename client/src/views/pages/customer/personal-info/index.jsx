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
    Skeleton, // Dùng để tạo loading state siêu mượt
    Typography
} from 'antd';
import { 
    UserOutlined, 
    SaveOutlined, 
    MailOutlined,
    CameraOutlined, // Icon cho nút upload
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

// --- SKELETON COMPONENT: Giao diện "xương" khi đang tải dữ liệu ---
// Trải nghiệm người dùng sẽ tốt hơn rất nhiều so với icon loading đơn điệu
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

// --- MAIN COMPONENT: Giao diện thông tin cá nhân đã được "lột xác" ---
const PersonalInfo = () => {
    const [form] = Form.useForm(); // Sử dụng hook của Form để kiểm soát
    const { userData, updateUserData } = useAuth();
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Sử dụng useEffect để điền dữ liệu vào form một cách an toàn khi userData có sẵn
    useEffect(() => {
        if (userData) {
            form.setFieldsValue(userData);
        }
    }, [userData, form]);

    // Hiện đại hóa hàm bằng async/await cho dễ đọc và bảo trì
    const handleChangePassword = async () => {
        setIsSendingEmail(true);
        try {
            const { data } = await auth.forgotPassword({ email: userData.email });
            if (data.status === 'OK') {
                toast.success('Một email hướng dẫn đổi mật khẩu đã được gửi đi!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsSendingEmail(false); // Luôn tắt loading dù thành công hay thất bại
        }
    };
    
    // Hiện đại hóa hàm bằng async/await
    const handleSubmit = async (values) => {
        setIsSaving(true);
        try {
            // Giả lập một chút độ trễ để thấy hiệu ứng loading
            await new Promise(resolve => setTimeout(resolve, 500));
            await updateUserData(values); // Giả sử hàm này là async
            toast.success('Cập nhật thông tin thành công! 🎉');
        } catch(error) {
            console.error(error);
            toast.error('Cập nhật thất bại, vui lòng kiểm tra lại.');
        } finally {
            setIsSaving(false);
        }
    };

    // Nếu chưa có dữ liệu, hiển thị skeleton siêu xịn
    if (!userData) {
        return <PersonalInfoSkeleton />;
    }
    
    // Tùy chỉnh theme vàng cho các component Antd
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
                {/* Avatar có thể upload, khớp với style SCSS */}
                <div className="personal-info__avatar">
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        // action="/your-upload-api" // Thay bằng API upload của bạn
                        // beforeUpload={...}
                        // onChange={...}
                    >
                        <Avatar 
                            src={userData.avatar_url || null} // Hiển thị avatar thật nếu có
                            icon={<UserOutlined />} 
                        />
                    </Upload>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: '100%', maxWidth: 700 }}
                    initialValues={userData} // Set giá trị ban đầu
                >
                    <Form.Item label="Họ và tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>
                    
                    <Form.Item label="Số điện thoại" name="phone_numbers" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
                    </Form.Item>
                    
                    <Form.Item label="Mật khẩu" name="password">
                        <Button
                            icon={<LockOutlined />}
                            loading={isSendingEmail}
                            onClick={handleChangePassword}
                        >
                            Yêu cầu đổi mật khẩu
                        </Button>
                    </Form.Item>

                    {/* Phân nhóm các trường địa chỉ cho gọn gàng */}
                    <Divider orientation="left" style={{borderColor: '#FDE68A'}}>
                        <HomeOutlined /> Thông tin địa chỉ
                    </Divider>

                    <Form.Item label="Quốc gia" name="country">
                        <Input prefix={<GlobalOutlined />} placeholder="Việt Nam" />
                    </Form.Item>

                    <Form.Item label="Thành phố" name="city">
                        <Input prefix={<EnvironmentOutlined />} placeholder="TP. Hồ Chí Minh" />
                    </Form.Item>

                    <Form.Item label="Địa chỉ cụ thể" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <Input placeholder="Số nhà, tên đường, phường/xã..." />
                    </Form.Item>

                    {/* Khu vực nút bấm cuối form, được căn chỉnh đẹp hơn */}
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSaving} block>
                            Lưu Thay Đổi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </ConfigProvider>
    );
};

export default PersonalInfo;