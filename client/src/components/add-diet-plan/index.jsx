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
  DatePicker,
  Select,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import diet from 'api/diet'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const { Option } = Select;

const AddDietPlan = ({ visible, onCancel, selectedPet, setUpdate, addFood }) => {
  console.log(addFood);
  
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
          // console.log(res)
          values.food.map((food) => {
            const formattimefood = {
              ...food,
              time: food.time // Giờ đây time đã là enum (breakfast/lunch/dinner)
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
            time: food.time // Giờ đây time đã là enum (breakfast/lunch/dinner)
          }
          diet.creatDietFood(selectedPet.pet_id, formattimefood).then((res) => {
            console.log(res)
          })
        })
        setUpdate(true)
        toast.success("Thêm thực phẩm thành công")
        onCancel()
      } catch (error) {
        toast.error("Thêm không thành công")
        onCancel()
      }
    }
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
                  <>
                    <Form.Item
                      label="Tên chế độ ăn"
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập tên chế độ ăn!' }]}
                    >
                      <Input placeholder="Nhập tên chế độ ăn" />
                    </Form.Item>
                    
                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                      <Input.TextArea 
                        rows={3}
                        placeholder="Nhập mô tả chế độ ăn" 
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="Ngày bắt đầu"
                      name="date_start"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                      <DatePicker 
                        placeholder="Chọn ngày bắt đầu"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ngày kết thúc"
                      name="date_end"
                      rules={[
                        { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startDate = getFieldValue('date_start');
                            if (!value || !startDate) {
                              return Promise.resolve();
                            }
                            if (value.isBefore(startDate)) {
                              return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <DatePicker 
                        placeholder="Chọn ngày kết thúc"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </>
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
                        <Space key={subField.key} align="start">
                          <Form.Item 
                            noStyle 
                            name={[subField.name, 'time']}
                            rules={[{ required: true, message: 'Chọn bữa ăn!' }]}
                          >
                            <Select 
                              placeholder="Chọn bữa ăn"
                              style={{ width: 120 }}
                            >
                              <Option value="breakfast">Sáng</Option>
                              <Option value="lunch">Trưa</Option>
                              <Option value="dinner">Tối</Option>
                            </Select>
                          </Form.Item>
                          
                          <Form.Item 
                            noStyle 
                            name={[subField.name, 'name']}
                            rules={[{ required: true, message: 'Nhập tên!' }]}
                          >
                            <Input 
                              placeholder="Tên thực phẩm" 
                              style={{ width: 150 }}
                            />
                          </Form.Item>
                          
                          <Form.Item
                            noStyle
                            name={[subField.name, 'description']}
                          >
                            <Input 
                              placeholder="Mô tả" 
                              style={{ width: 150 }}
                            />
                          </Form.Item>
                          
                          <Form.Item 
                            noStyle 
                            name={[subField.name, 'amount']}
                            rules={[{ required: true, message: 'Nhập số lượng!' }]}
                          >
                            <Input 
                              placeholder="Số lượng" 
                              type="number"
                              style={{ width: 100 }}
                            />
                          </Form.Item>
                          
                          <Form.Item 
                            noStyle 
                            name={[subField.name, 'unit']}
                            rules={[{ required: true, message: 'Nhập đơn vị!' }]}
                          >
                            <Input 
                              placeholder="Đơn vị" 
                              style={{ width: 80 }}
                            />
                          </Form.Item>
                          
                          <CloseOutlined
                            onClick={() => {
                              subOpt.remove(subField.name)
                            }}
                            style={{ 
                              color: '#ff4d4f', 
                              cursor: 'pointer',
                              marginTop: 8
                            }}
                          />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Thêm thực phẩm
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