import React from 'react'
import { Modal, Form, Input, Radio, Button, Avatar } from 'antd'
import useAuth from 'hooks/useAuth'
import usePet from 'hooks/usePet'
import pet from 'api/pet'
import { toast } from 'react-toastify'
// Import file CSS vừa tạo
import './AddPetModal.scss' 

const AddPetModal = ({ visible, onCancel }) => {
  const { userData } = useAuth()
  const { allPets, setAllPets, customerPets, setCustomerPets } = usePet()
  const [form] = Form.useForm(); // Sử dụng form instance để có thể reset

  const handleCancel = () => {
    form.resetFields(); // Reset các trường trong form khi hủy
    onCancel();
  }

  const handleSubmit = (values) => {
    // Thay đổi link ảnh mặc định nếu người dùng không nhập
    const finalValues = {
      ...values,
      avatar: values.avatar || '/avatarpet.jpg'
    };

    if (userData && (userData.roles === 'staff' || userData.roles === 'admin')) {
      pet
        .createPetByStaff(finalValues)
        .then((res) => {
          toast.success('Thêm thú cưng thành công!')
          const newPets = [...allPets, res.data.pet]
          setAllPets(newPets)
          handleCancel(); // Gọi handleCancel để đóng và reset
        })
        .catch((error) => {
          console.error('Thêm thú cưng thất bại:', error)
          toast.error(error?.response?.data?.message || 'Thêm thú cưng thất bại!')
        })
    }
    if (userData && userData.roles === 'customer') {
      pet
        .createPet(userData.user_id, finalValues)
        .then((res) => {
          toast.success('Thêm thú cưng thành công!')
          const newPets = [...customerPets, res.data.pet]
          setCustomerPets(newPets)
          handleCancel(); // Gọi handleCancel để đóng và reset
        })
        .catch((error) => {
          console.error('Thêm thú cưng thất bại:', error)
          toast.error(error?.response?.data?.message || 'Thêm thú cưng thất bại!')
        })
    }
  }

  return (
    <Modal
      className="pet-add-modal" // Áp dụng class chính cho modal
      title="Thêm hồ sơ thú cưng mới"
      open={visible}
      onCancel={handleCancel}
      footer={null} // Tự tạo footer riêng
      width={1000}
      centered // Căn modal ra giữa màn hình
    >
      <div className="pet-modal-layout">
        {/* === CỘT BÊN TRÁI: AVATAR === */}
        <div className="pet-avatar-section">
          <Avatar
            src={'/avatarpet.jpg'}
            size={180}
          />
          <p>Ảnh đại diện sẽ giúp nhận diện bé cưng dễ dàng hơn!</p>
        </div>

        {/* === CỘT BÊN PHẢI: FORM NHẬP LIỆU === */}
        <div className="pet-form-section">
          <Form
            form={form} // Gắn form instance
            layout="vertical" // Dùng layout vertical cho gọn gàng
            onFinish={handleSubmit}
            autoComplete="off"
            className="pet-form"
          >
            {userData && (userData.roles === 'staff' || userData.roles === 'admin') && (
              <Form.Item
                label="ID Chủ nhân"
                name="user_id"
                rules={[{ required: true, message: 'Vui lòng nhập ID chủ nhân!' }]}
              >
                <Input placeholder="Nhập ID của chủ nhân thú cưng" />
              </Form.Item>
            )}
            <Form.Item
              label="Tên cún cưng"
              name="fullname"
              rules={[{ required: true, message: 'Vui lòng nhập tên cho bé!' }]}
            >
              <Input placeholder="Ví dụ: LULU, MIKU,..." />
            </Form.Item>
            
            <Form.Item
              label="Link ảnh đại diện (không bắt buộc)"
              name="avatar"
            >
              <Input placeholder="Dán đường dẫn URL hình ảnh của bé" />
            </Form.Item>
            
            <Form.Item label="Tuổi" name="age">
              <Input placeholder="Ví dụ: 2 tuổi, 6 tháng,..." />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="sex"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Radio.Group>
                <Radio value="male">Đực</Radio>
                <Radio value="female">Cái</Radio>
                <Radio value="other">Không xác định</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Tình trạng sức khỏe"
              name="health"
              rules={[{ required: true, message: "Vui lòng nhập tình trạng sức khỏe!" }]}
            >
              <Input placeholder="Ví dụ: Khỏe mạnh, đã tiêm phòng đầy đủ" />
            </Form.Item>

            <Form.Item label="Cân nặng (kg)" name="weight">
              <Input placeholder="Ví dụ: 5.5" />
            </Form.Item>

            <Form.Item label="Chủng loại/Giống" name="species">
              <Input placeholder="Ví dụ: Chó Corgi, Mèo Anh Lông Ngắn,..." />
            </Form.Item>

            <Form.Item label="Mô tả thêm" name="describe">
              <Input.TextArea rows={3} placeholder="Ghi chú thêm về tính cách, sở thích của bé..." />
            </Form.Item>
            
            {/* === KHU VỰC CÁC NÚT BẤM === */}
            <Form.Item className="pet-form-buttons">
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Thêm bé
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default AddPetModal