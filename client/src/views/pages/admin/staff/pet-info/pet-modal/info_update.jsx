import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Divider,
  Avatar,
  ConfigProvider,
  Row,
  Col,
  Typography,
  Upload,
  Space,
  Card,
  Tag,
} from 'antd';
import { UploadOutlined, UserOutlined, EditOutlined, HeartOutlined } from '@ant-design/icons';
import pet from 'api/pet';
import usePet from 'hooks/usePet';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

// --- Enhanced Modern Theme ---
const modernGoldTheme = {
  token: {
    colorPrimary: '#C9941A', // Vàng gold đậm và sang trọng
    colorInfo: '#C9941A',
    colorBgContainer: '#FFFFFF',
    colorText: '#4A4A4A',
    colorTextHeading: '#1F1F1F',
    borderRadius: 12,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    colorBorder: '#E8E8E8',
  },
  components: {
    Modal: {
      borderRadiusLG: 16,
    },
    Button: {
      primaryColor: '#FFFFFF',
      defaultBorderColor: '#C9941A',
      defaultColor: '#C9941A',
      borderRadius: 8,
      controlHeight: 44,
      fontWeight: 500,
    },
    Input: {
      activeBorderColor: '#C9941A',
      hoverBorderColor: '#D4AF37',
      borderRadius: 8,
      controlHeight: 44,
      paddingInline: 16,
    },
    Radio: {
      dotColor: '#C9941A',
      dotColorDisabled: '#F0F0F0',
    },
    Divider: {
      colorSplit: '#F0F0F0',
      marginLG: 24,
    },
    Card: {
      borderRadiusLG: 16,
    }
  },
};

// --- Component chính ---
const UpdateModal = ({ visible, onCancel, selectedPet }) => {
  const [form] = Form.useForm();
  const { allPets, setAllPets } = usePet();

  useEffect(() => {
    if (selectedPet) {
      form.setFieldsValue({
        fullname: selectedPet.fullname,
        age: selectedPet.age,
        sex: selectedPet.sex.toLowerCase(),
        health: selectedPet.health,
        weight: selectedPet.weight,
        species: selectedPet.species,
        describe: selectedPet.describe,
      });
    }
  }, [selectedPet, form]);

  const handleSubmit = (values) => {
    console.log('Received values of form: ', values);
    pet
      .updatePetInfo(selectedPet.pet_id, values)
      .then(() => {
        toast.success('Cập nhật thú cưng thành công');
        const updatedPets = allPets.map((p) =>
          p.pet_id === selectedPet.pet_id ? { ...p, ...values } : p
        );
        setAllPets(updatedPets);
        onCancel();
      })
      .catch((error) => {
        console.error('Cập nhật thú cưng thất bại:', error);
        toast.error('Cập nhật thú cưng thất bại');
      });
  };
  
  const handleBeforeUpload = () => {
    toast.info("Chức năng đang được phát triển!");
    return false; 
  };

  return (
    <ConfigProvider theme={modernGoldTheme}>
      <Modal
        title={null}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' }
        }}
      >
        {selectedPet && (
          <div style={{ 
            background: 'white',
            minHeight: '70vh',
            borderRadius: '16px'
          }}>
            {/* Header */}
            <div style={{
              padding: '32px 40px 24px 40px',
              borderBottom: '1px solid #F0F0F0'
            }}>
              <Title level={2} style={{ color: '#1F1F1F', margin: 0, fontWeight: 700 }}>
                Cập Nhật Hồ Sơ Thú Cưng
              </Title>
              <Text style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>
                Chỉnh sửa thông tin chi tiết của bé yêu
              </Text>
            </div>

            <div style={{ padding: '40px' }}>
              <Row gutter={40}>
                {/* Cột Trái: Profile Card */}
                <Col span={8}>
                  <Card
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 12px 40px rgba(201, 148, 26, 0.15)',
                      overflow: 'hidden'
                    }}
                    bodyStyle={{ padding: '32px', textAlign: 'center' }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px'
                    }}>
                      <Avatar
                        src={selectedPet.imgUrl || '/avatarpet1.png'}
                        size={140}
                        icon={<UserOutlined />}
                        style={{ 
                          border: '6px solid #C9941A', 
                          marginBottom: '20px',
                          boxShadow: '0 8px 24px rgba(201, 148, 26, 0.3)'
                        }}
                      />
                      <Title level={3} style={{ margin: '0 0 8px 0', color: '#1F1F1F' }}>
                        {selectedPet.fullname}
                      </Title>
                      <Tag 
                        color="gold" 
                        style={{ 
                          fontSize: '14px', 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          border: 'none'
                        }}
                      >
                        <HeartOutlined /> {selectedPet.species}
                      </Tag>
                    </div>
                    
                    <Upload 
                      showUploadList={false}
                      beforeUpload={handleBeforeUpload}
                    >
                      <Button 
                        icon={<UploadOutlined />} 
                        size="large"
                        style={{ 
                          width: '100%',
                          height: '48px',
                          borderRadius: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Đổi ảnh đại diện
                      </Button>
                    </Upload>
                  </Card>
                </Col>

                {/* Cột Phải: Form Chỉnh Sửa */}
                <Col span={16}>
                  <Card
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    }}
                    bodyStyle={{ padding: '32px' }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      autoComplete="off"
                    >
                      <Divider 
                        orientation="left" 
                        style={{
                          borderColor: '#C9941A', 
                          color: '#C9941A',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}
                      >
                        🐾 Thông tin cơ bản
                      </Divider>
                      
                      <Form.Item 
                        label={<Text strong style={{ fontSize: '15px' }}>Tên gọi</Text>} 
                        name="fullname" 
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                      >
                        <Input 
                          placeholder="Tên thân thương của bé" 
                          style={{ fontSize: '15px' }}
                        />
                      </Form.Item>

                      <Row gutter={20}>
                        <Col span={12}>
                          <Form.Item label={<Text strong style={{ fontSize: '15px' }}>Tuổi</Text>} name="age">
                            <Input 
                              placeholder="VD: 2" 
                              suffix={<Text type="secondary">tuổi</Text>}
                              style={{ fontSize: '15px' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<Text strong style={{ fontSize: '15px' }}>Cân nặng</Text>} name="weight">
                            <Input 
                              placeholder="VD: 5.5" 
                              suffix={<Text type="secondary">kg</Text>}
                              style={{ fontSize: '15px' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={20}>
                        <Col span={12}>
                          <Form.Item label={<Text strong style={{ fontSize: '15px' }}>Chủng loại</Text>} name="species">
                            <Input 
                              placeholder="VD: Mèo Anh Lông Ngắn" 
                              style={{ fontSize: '15px' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item 
                            label={<Text strong style={{ fontSize: '15px' }}>Giới tính</Text>} 
                            name="sex" 
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                          >
                            <Radio.Group style={{ fontSize: '15px' }}>
                              <Radio value="male" style={{ fontSize: '15px' }}>🐕 Đực</Radio>
                              <Radio value="female" style={{ fontSize: '15px' }}>🐱 Cái</Radio>
                              <Radio value="other" style={{ fontSize: '15px' }}>🐾 Khác</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Divider 
                        orientation="left" 
                        style={{
                          borderColor: '#C9941A', 
                          color: '#C9941A',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}
                      >
                        💝 Chi tiết khác
                      </Divider>

                      <Form.Item 
                        label={<Text strong style={{ fontSize: '15px' }}>Tình trạng sức khỏe</Text>} 
                        name="health" 
                        rules={[{ required: true, message: 'Vui lòng nhập tình trạng sức khỏe!' }]}
                      >
                        <Input 
                          placeholder="VD: Khỏe mạnh, đã tiêm đủ 2 mũi" 
                          style={{ fontSize: '15px' }}
                        />
                      </Form.Item>

                      <Form.Item label={<Text strong style={{ fontSize: '15px' }}>Mô tả thêm</Text>} name="describe">
                        <Input.TextArea 
                          rows={4} 
                          placeholder="Tính cách, sở thích đặc biệt của bé..."
                          style={{ 
                            fontSize: '15px',
                            borderRadius: '8px'
                          }}
                        />
                      </Form.Item>

                      {/* Nút bấm */}
                      <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
                          <Button 
                            onClick={onCancel} 
                            size="large"
                            style={{
                              height: '48px',
                              paddingInline: '24px',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Hủy bỏ
                          </Button>
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            size="large"
                            style={{
                              height: '48px',
                              paddingInline: '32px',
                              borderRadius: '12px',
                              fontWeight: '500',
                              boxShadow: '0 4px 16px rgba(201, 148, 26, 0.3)'
                            }}
                          >
                            💾 Lưu Thay Đổi
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default UpdateModal;