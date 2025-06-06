import React, { useEffect } from 'react'
import { formatDateToYYYYMMDD } from 'helpers/formartdate'
import { formatTimeMealToE } from 'helpers/formatMeal'
import {
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Divider,
  Avatar,
  Card,
  Space,
  Typography,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import diet from 'api/diet'
import { toast } from 'react-toastify'

const AddDietPlan = ({ visible, onCancel, selectedPet, setUpdate, addFood }) => {
  console.log(addFood);
  const handleSubmit = (values) => {
    if (addFood === false) {
      diet
        .creatDietPlan(selectedPet.pet_id, {
          name: values.name,
          description: values.description,
          date_start: formatDateToYYYYMMDD(values.date_start),
          date_end: formatDateToYYYYMMDD(values.date_end),
        })
        .then((res) => {
          // console.log(res)
          values.food.map((food) => {
            const formattimefood = {
              ...food,
              time: formatTimeMealToE(food.time)
            }
            diet.creatDietFood(selectedPet.pet_id, formattimefood).then((res) => {
              // console.log(res)
              toast.success("thêm thành công")
            })
          })
          setUpdate(true)
          onCancel()
        })
    }
    if (addFood === true) {
      try {
        values.food.map((food) => {
          const formattimefood = {
            ...food,
            time: formatTimeMealToE(food.time)
          }
          diet.creatDietFood(selectedPet.pet_id, formattimefood).then((res) => {
            console.log(res)

          })
        })
        setUpdate(true)
        onCancel()
      } catch (error) {
        toast.error("Thêm không thành công")
        onCancel()
      }



    }
    // console.log(values)

  }

  return (
    <Modal
      // style={{ top: 0 }}
      title="Thêm chế độ ăn uống"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <>
        <Divider />
        <div style={{ display: 'flex' }}>
          <div className="flex flex-col flex-1">
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleSubmit}
              autoComplete="off"
              className="flex flex-col"
            >
              {
                !addFood && (
                  <><Form.Item
                    label="Tên chế độ ăn"
                    name="name"
                    rules={[{ required: true, message: 'Give the target a name!' }]}
                  >
                    <Input placeholder="Give the target a name" />
                  </Form.Item>
                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[{ required: true, message: 'Give the target a name!' }]}
                    >
                      <Input placeholder="Give the target a name" />
                    </Form.Item>
                    <Form.Item
                      label="Ngày bắt đầu"
                      name="date_start"
                      rules={[{ required: true, message: 'Give the target a name!' }]}
                    >
                      <Input placeholder="Nhập chủng loại" />
                    </Form.Item>

                    <Form.Item
                      label="Ngày kết thúc"
                      name="date_end"
                      rules={[{ required: true, message: 'Give the target a name!' }]}
                    >
                      <Input placeholder="Nhập chủng loại" />
                    </Form.Item></>
                )
              }

              <Form.Item label="Thực phẩm">
                <Form.List name={'food'}>
                  {(subFields, subOpt) => (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 16,
                      }}
                    >
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item noStyle name={[subField.name, 'time']}>
                            <Input placeholder="time" />
                          </Form.Item>
                          <Form.Item noStyle name={[subField.name, 'name']}>
                            <Input placeholder="name" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name={[subField.name, 'description']}
                          >
                            <Input placeholder="description" />
                          </Form.Item>
                          <Form.Item noStyle name={[subField.name, 'amount']}>
                            <Input placeholder="amount" />
                          </Form.Item>
                          <Form.Item noStyle name={[subField.name, 'unit']}>
                            <Input placeholder="unit" />
                          </Form.Item>
                          <CloseOutlined
                            onClick={() => {
                              subOpt.remove(subField.name)
                            }}
                          />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Thực phẩm
                      </Button>
                    </div>
                  )}
                </Form.List>
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

export default AddDietPlan
