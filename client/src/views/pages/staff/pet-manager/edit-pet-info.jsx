import { Button, Avatar, Form, Input, Radio } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
}

export default function EditPetInfo() {

  const handleSubmit = (values) => {
    console.log(values);
    toast.success("Cập nhật thành công")
  }

  return (
    <div className="flex flex-row">
      <div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/65f34002def0f4527b83c5a4957fa03c66dec5accf8aa5825068709edd3a53ad?apiKey=f19a917c094b4f6fa8172f34eb76d09c&" className=" border-white border-solid aspect-[0.99] border-[10px] w-[280px]" />
      </div>
      <div className='flex flex-col'>
        <Form
          onFinish={handleSubmit}
          {...formItemLayout}
          style={{
            width: 700,
          }}
        >
          <Form.Item
            initialValue={'Bim'}
            label="Tên thú cưng"
            name="fullname"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={'5'}
            label="Tuổi"
            name="age"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            initialValue={'male'}
            label="Giới tính"
            name="sex"
          >
          <Radio.Group>
            <Radio value="male"> Đực </Radio>
            <Radio value="female"> Cái </Radio>
            <Radio value="other"> khác </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
            initialValue={'khỏe mạnh'}
            label="Sức khỏe"
            name="health"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={'5kg'}
            label="Cân nặng"
            name="weight"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={'chó'}
            label="Chủng loại"
            name="species"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={'husky ngu xi'}
            label="Mô tả"
            name="discribe"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>

        <div className='self-end flex flex-row gap-4 pb-5'>
          <Button type='primary'>Lưu</Button>
          <Button >Hủy</Button>
        </div>
      </div>

    </div>
  )
}

