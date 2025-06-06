import React, { useEffect } from 'react'
import { Modal, Form, Input, Radio, Button, Divider, Avatar } from 'antd'
import pet from 'api/pet'
import usePet from 'hooks/usePet'
import { toast } from 'react-toastify'
const UpdateModal = ({ visible, onCancel, selectedPet }) => {
  const [form] = Form.useForm()
  const { allPets, setAllPets } = usePet()

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
      })
    }
  }, [selectedPet])

  const handleSubmit = (values) => {
    console.log('Received values of form: ', values)

    pet
      .updatePetInfo(selectedPet.pet_id, values)
      .then(() => {
        toast.success('Cập nhật thú cưng thành công')

        const updatedPets = allPets.map((pet) =>
          pet.pet_id === selectedPet.pet_id ? { ...pet, ...values } : pet,
        )

        setAllPets(updatedPets)
        onCancel()
      })
      .catch((error) => {
        console.error('Cập nhật thú cưng thất bại:', error)
        toast.error('Cập nhật thú cưng thất bại')
      })
  }

  return (
    <Modal
      title="Cập nhật thông tin"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      {selectedPet && (
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
                src={selectedPet.imgUrl || '/image.png'}
                size={150}
                style={{ marginRight: 24 }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={handleSubmit}
                autoComplete="off"
                className="flex flex-col"
              >
                <Form.Item
                  label="Tên thú cưng"
                  name="fullname"
                  rules={[
                    { required: true, message: 'Give the target a name!' },
                  ]}
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
      )}
    </Modal>
  )
}

export default UpdateModal
