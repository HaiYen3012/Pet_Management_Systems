import { Button, Avatar, Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './personal-info.scss'
import useAuth from 'hooks/useAuth'
import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import auth from 'api/auth'

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

const PersonalInfo = () => {
  const { userData, updateUserData } = useAuth()
  const [isSending, setIsSending] = useState(false)

  const handleChangePassword = async () => {
    setIsSending(true)
    const email = userData.email
    auth
      .forgotPassword({ email })
      .then((data) => {
        if (data.data.status === 'OK') {
          setIsSending(false)
          toast.success('Email has been sent successfully.')
        }
      })
      .catch((error) => {
        console.log(error)
        setIsSending(false)
        toast.error('An error occured. Please try again.')
      })
  }

  const handleSubmit = (values) => {
    updateUserData(values)
    console.log(values)
    toast.success('Cập nhật thành công')
  }

  return (
    <div className="personal-info-wrapper">
      <div className="personal-info__avatar">
        <Avatar size={70} icon={<UserOutlined />} />
      </div>
      {userData === null ? (
        <>
          <LoadingOutlined />
        </>
      ) : (
        <Form
          onFinish={handleSubmit}
          {...formItemLayout}
          style={{
            width: 700,
          }}
        >
          <Form.Item
            initialValue={userData.fullname}
            label="Họ và tên"
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
            initialValue={userData.username}
            label="Tên đăng nhập"
            name="username"
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
            initialValue={userData.email}
            label="Email"
            name="email"
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
            initialValue={userData.phone_numbers}
            label="Số điện thoại"
            name="phone_numbers"
            rules={[
              {
                required: true,
                message: 'Please input!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password">
            <Button
              disabled={isSending}
              type="primary"
              onClick={handleChangePassword}
            >
              Thay đổi mật khẩu
            </Button>
          </Form.Item>

          <Form.Item
            initialValue={userData.country}
            label="Quốc gia"
            name="country"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input!'
            //   }
            // ]}
          >
            <Input />
          </Form.Item>

          <Form.Item initialValue={userData.city} label="Thành phố" name="city">
            <Input />
          </Form.Item>

          <Form.Item
            initialValue={userData.address}
            label="Địa chỉ cụ thể"
            name="address"
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
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  )
}

export default PersonalInfo
