import React from 'react';
// GHI CHÚ: Các import được giữ nguyên, chỉ thêm ConfigProvider
import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Avatar,
  Card,
  Space,
  Typography,
  DatePicker,
  Select,
  ConfigProvider, // <-- THÊM VÀO
} from 'antd';
import { CloseOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import diet from 'api/diet';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

// GHI CHÚ: Các màu nền và chữ phụ vẫn có thể giữ lại nếu muốn
const customColors = {
  background: '#fffbeb',
  text: '#424242',
  textSecondary: '#757575',
};

const AddDietPlan = ({ visible, onCancel, selectedPet, setUpdate, addFood }) => {
  // GHI CHÚ: Logic handleSubmit được giữ nguyên, không thay đổi
  const handleSubmit = (values) => {
    if (addFood === false) {
      diet
        .creatDietPlan(selectedPet.pet_id, {
          name: values.name,
          description: values.description,
          date_start: values.date_start.format('YYYY-MM-DD'),
          date_end: values.date_end.format('YYYY-MM-DD'),
        })
        .then((res) => {
          if (values.food && values.food.length > 0) {
            values.food.forEach((food) => {
              const formattimefood = { ...food, time: food.time };
              diet.creatDietFood(selectedPet.pet_id, formattimefood);
            });
          }
          toast.success('Tạo chế độ ăn thành công!');
          setUpdate(true);
          onCancel();
        })
        .catch(() => toast.error('Tạo chế độ ăn thất bại!'));
    }
    if (addFood === true) {
      try {
        if (values.food && values.food.length > 0) {
          values.food.forEach((food) => {
            const formattimefood = { ...food, time: food.time };
            diet.creatDietFood(selectedPet.pet_id, formattimefood);
          });
          toast.success('Thêm thực phẩm thành công!');
          setUpdate(true);
          onCancel();
        } else {
            toast.info('Bạn chưa thêm món ăn nào.')
        }
      } catch (error) {
        toast.error('Thêm không thành công!');
        onCancel();
      }
    }
  };

  return (
    // BƯỚC 1: Bọc toàn bộ Modal trong ConfigProvider
    <ConfigProvider
      theme={{
        token: {
          // BƯỚC 2: Định nghĩa màu vàng là màu chính
          colorPrimary: '#ffc107',
        },
        components: {
            // Tùy chỉnh nhỏ để các Input trông mềm mại hơn
            Input: {
                activeBorderColor: '#ffca28',
                hoverBorderColor: '#ffca28',
            },
            Select: {
                optionSelectedBg: '#fffbeb'
            },
            DatePicker: {
                activeBorderColor: '#ffca28',
                hoverBorderColor: '#ffca28',
            }
        }
      }}
    >
      <Modal
        title={
          <Title level={4} style={{ color: customColors.text, margin: 0 }}>
            {addFood
              ? `Thêm Thực Phẩm cho ${selectedPet?.name}`
              : `Tạo Chế Độ Ăn Mới`}
          </Title>
        }
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        bodyStyle={{ backgroundColor: customColors.background, padding: '24px' }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* === CỘT BÊN TRÁI: THÔNG TIN THÚ CƯNG === */}
          <div style={{ flex: '0 0 250px' }}>
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Avatar
                size={80}
                src={selectedPet?.avatar}
                icon={<UserOutlined />}
                style={{
                  marginBottom: '16px',
                  // Dùng CSS variable của Ant Design để lấy màu chính
                  border: `3px solid var(--ant-color-primary)`,
                }}
              />
              <Title level={5} style={{ color: customColors.text }}>
                {selectedPet?.name}
              </Title>
              <Text type="secondary" style={{ color: customColors.textSecondary }}>
                Hãy tạo một chế độ ăn uống lành mạnh và phù hợp cho thú cưng nhé!
              </Text>
            </Card>
          </div>

          {/* === CỘT BÊN PHẢI: FORM NHẬP LIỆU === */}
          <div style={{ flex: 1 }}>
            <Card
              bordered={false}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                {!addFood && (
                  <>
                    {/* ... các Form.Item cho tên, mô tả, ngày tháng ... */}
                     <Form.Item
                      label={<Text strong style={{color: customColors.text}}>Tên chế độ ăn</Text>}
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập tên chế độ ăn!' }]}
                    >
                      <Input placeholder="Ví dụ: Chế độ tăng cân mùa đông" />
                    </Form.Item>
                    
                    <Form.Item
                      label={<Text strong style={{color: customColors.text}}>Mô tả chi tiết</Text>}
                      name="description"
                      rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                      <Input.TextArea 
                        rows={3}
                        placeholder="Nhập mô tả về mục tiêu của chế độ ăn này" 
                      />
                    </Form.Item>
                    
                    <Space style={{width: '100%'}} align="start">
                        <Form.Item
                          label={<Text strong style={{color: customColors.text}}>Ngày bắt đầu</Text>}
                          name="date_start"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                           style={{flex: 1}}
                        >
                          <DatePicker 
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>

                        <Form.Item
                           label={<Text strong style={{color: customColors.text}}>Ngày kết thúc</Text>}
                          name="date_end"
                          rules={[
                            { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const startDate = getFieldValue('date_start');
                                if (!value || !startDate) return Promise.resolve();
                                if (value.isBefore(startDate)) {
                                  return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                          style={{flex: 1}}
                        >
                          <DatePicker 
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                    </Space>
                  </>
                )}

                {/* === PHẦN THÊM THỰC PHẨM (FORM.LIST) === */}
                <Form.Item
                  label={
                    <Title level={5} style={{ color: customColors.text }}>
                      Danh sách thực phẩm
                    </Title>
                  }
                >
                  <Form.List name={'food'}>
                    {(subFields, subOpt) => (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {subFields.map((subField) => (
                           <Card 
                            key={subField.key} 
                            size="small"
                            bodyStyle={{padding: '12px'}}
                            style={{backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '6px'}}
                           >
                           {/* ... các Form.Item cho từng món ăn ... */}
                             <Space align="start" wrap>
                                <Form.Item noStyle name={[subField.name, 'time']} rules={[{ required: true, message: 'Chọn bữa!' }]}>
                                  <Select placeholder="Bữa ăn" style={{ width: 120 }}>
                                    <Option value="breakfast">Sáng</Option>
                                    <Option value="lunch">Trưa</Option>
                                    <Option value="dinner">Tối</Option>
                                  </Select>
                                </Form.Item>
                                
                                <Form.Item noStyle name={[subField.name, 'name']} rules={[{ required: true, message: 'Nhập tên!' }]}>
                                  <Input placeholder="Tên thực phẩm" style={{ width: 150 }} />
                                </Form.Item>
                                
                                <Form.Item noStyle name={[subField.name, 'description']}>
                                  <Input placeholder="Mô tả (không bắt buộc)" style={{ width: 150 }} />
                                </Form.Item>
                                
                                <Form.Item noStyle name={[subField.name, 'amount']} rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                                  <Input placeholder="Số lượng" type="number" style={{ width: 100 }} />
                                </Form.Item>
                                
                                <Form.Item noStyle name={[subField.name, 'unit']} rules={[{ required: true, message: 'Nhập đơn vị!' }]}>
                                  <Input placeholder="Đơn vị (g, ml...)" style={{ width: 100 }} />
                                </Form.Item>
                                
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<CloseOutlined />}
                                  onClick={() => subOpt.remove(subField.name)}
                                />
                             </Space>
                           </Card>
                        ))}
                        {/* BƯỚC 3: Xóa style khỏi button để nó tự kế thừa theme */}
                        <Button
                          type="dashed"
                          onClick={() => subOpt.add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm một món
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>

                <Divider />

                {/* === NÚT LƯU VÀ HỦY === */}
                <Form.Item style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button onClick={onCancel}>Hủy</Button>
                    {/* BƯỚC 3: Xóa style khỏi button để nó tự kế thừa theme */}
                    <Button type="primary" htmlType="submit">
                      Lưu lại
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddDietPlan;