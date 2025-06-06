import React, { useEffect } from 'react'
import { Modal, Form, Input, Radio, Button, Divider, Avatar } from 'antd'
import useAuth from 'hooks/useAuth'
import usePet from 'hooks/usePet'
import pet from 'api/pet'
import { toast } from 'react-toastify'

const AddPetModal = ({ visible, onCancel }) => {
  
  const { userData } = useAuth()
  const {allPets, setAllPets, customerPets, setCustomerPets} = usePet()

  const handleSubmit = (values) => {
    if(userData && ( userData.roles === 'staff' ||  userData.roles === 'admin')) {
      pet
        .createPetByStaff(values)
        .then((res) => {
          toast.success('Thêm thú cưng thành công')
          const newPets = [...allPets, res.data.pet]
          setAllPets(newPets)
          onCancel()
        })
        .catch((error) => {
          console.error('Thêm thú cưng thất bại:', error)
          toast.error('Thêm thú cưng thất bại')
        })
    }
    if(userData && userData.roles === 'customer'){
      pet
        .createPet(userData.user_id, values)
        .then((res) => {
          toast.success('Thêm thú cưng thành công')
          const newPets = [...customerPets, res.data.pet]
          setCustomerPets(newPets)
          onCancel()
        })
      console.log(values);
    }
    
  }
  
  return (
    <Modal
      style={{top: 0}}
      title="Thêm thú cưng"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <>
        <Divider />
        <div style={{ display: 'flex' }}>
          <div
            style={{
              flex: '0 0 150px',
              textAlign: 'center',
              marginLeft: '40px',
            }}
          >
            <Avatar
              src={'/avatarpet.jpg'}
              size={150}
              style={{ marginRight: 24 }}
            />
          </div>
          <div className="flex flex-col flex-1">
            <Form
              // form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleSubmit}
              autoComplete="off"
              className="flex flex-col"
            >
              {userData && (userData.roles === 'staff' || userData.roles === 'admin') && (
                <Form.Item
                  label="ID người dùng"
                  name="user_id"
                  rules={[
                    { required: true, message: 'Give the target a name!' },
                  ]}
                >
                  <Input placeholder="Give the target a name" />
                </Form.Item>
              )}
              <Form.Item
                label="Tên thú cưng"
                name="fullname"
                rules={[{ required: true, message: 'Give the target a name!' }]}
              >
                <Input placeholder="Give the target a name" />
              </Form.Item>
              <Form.Item
                label="Link ảnh ( không bắt buộc )"
                name="avatar"
                // rules={[{ required: true, message: 'Give the target a name!' }]}
              >
                <Input placeholder="Give the target a name" />
              </Form.Item>

              <Form.Item label="Tuổi" name="age">
                <Input placeholder="Nhập tuổi" />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="sex"
                rules={[
                  { required: true, message: 'Please select the gender!' },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Đực</Radio>
                  <Radio value="female">Cái</Radio>
                  <Radio value="other">Không xác định</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Sức khỏe"
                name="health"
                rules={[
                  {
                    required: true,
                    message: "Please input status of pet's health!",
                  },
                ]}
              >
                <Input placeholder="example" />
              </Form.Item>

              <Form.Item label="Cân nặng" name="weight">
                <Input placeholder="Nhập cân nặng" />
              </Form.Item>

              <Form.Item label="Chủng loại" name="species">
                <Input placeholder="Nhập chủng loại" />
              </Form.Item>

              <Form.Item label="Mô tả" name="describe">
                <Input.TextArea placeholder="Nhập mô tả" />
              </Form.Item>

              <Form.Item className="self-end flex flex-row">
                <div className="flex flex-row gap-5">
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button onClick={onCancel}>Hủy</Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
        <Divider />
      </>
    </Modal>
  )
}

export default AddPetModal
