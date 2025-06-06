import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Table } from 'antd'
const EditableContext = React.createContext(null)


const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values,
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

const medicalData = [
  {
    stt: 1,
    key: 1,
    name: 'Paracetamol',
    describe: 'Thuốc giảm đau, hạ sốt',
    unit: 'Viên',
    amount: 100,
  },
  {
    stt: 2,
    key: 2,
    name: 'Ibuprofen',
    describe: 'Thuốc chống viêm, giảm đau',
    unit: 'Viên',
    amount: 50,
  },
  {
    stt: 3,
    key: 3,
    name: 'Amoxicillin',
    describe: 'Kháng sinh điều trị nhiễm khuẩn',
    unit: 'Viên',
    amount: 75,
  },
  {
    stt: 4,
    key: 4,
    name: 'Cetirizine',
    describe: 'Thuốc chống dị ứng',
    unit: 'Viên',
    amount: 30,
  },
  {
    stt: 5,
    key: 5,
    name: 'Loperamide',
    describe: 'Thuốc điều trị tiêu chảy',
    unit: 'Viên',
    amount: 40,
  },
]
const MedicalTable = () => {
  const [dataSource, setDataSource] = useState(medicalData)
  // const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
  }

  const columnsMedical = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: '5%',
    },
    {
      title: 'Tên Thuốc',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Mô tả',
      width: '35%',
      dataIndex: 'describe',
      editable: true,
    },
    {
      width: '15%',
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      editable: true,
    },
    {
      width: '15%',
      title: 'số lượng',
      dataIndex: 'amount',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ]
  const handleAdd = () => {
    const newData = {
      stt: 4,
      key: 4,
      name: 'Cetirizine',
      describe: 'Thuốc chống dị ứng',
      unit: 'Viên',
      amount: 30,
    }
    setDataSource([...dataSource, newData])
  }
  const handleSave = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = columnsMedical.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })
  return (
    <div className="flex flex-col">
      <Button
        className="self-end"
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Thêm thuốc mới
      </Button>
      <div className="overflow-y-scroll max-h-[35vh]">
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
      <div className="self-end p-5 flex flex-row gap-5">
        <Button type="primary">Lưu</Button>
        <Button>Hủy</Button>
      </div>
    </div>
  )
}

export default function MedicalPet() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-28 w-full">
        <div className="">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/65f34002def0f4527b83c5a4957fa03c66dec5accf8aa5825068709edd3a53ad?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
            className=" border-white border-solid aspect-[0.99] border-[10px] w-[280px]"
          />
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-row items-center w-full gap-2">
            <p className="text-2xl font-bold">Hồ sơ bệnh án</p>
            <p className="text-gray-500 text-xs">Ngày khám: 25/02/2024</p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-row ">
              <div className="text-xl font-medium w-[300px]">Triệu chứng</div>
              
              <p className="text-xl font-normal "><Input value={'Chán ăn'} /></p>
            </div>
            <div className="flex flex-row ">
              <p className="text-xl font-medium w-[300px]">Chuẩn đoán</p>
              <p className="text-xl font-normal"><Input value={'Viêm đường ruột'} /></p>
            </div>
            <div className="flex flex-row ">
              <p className="text-xl font-medium w-[300px]">Tiền sử bệnh lý</p>
              <p className="text-xl font-normal"><Input value={'Tiêu chảy'} /></p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="font-semibold ">Đơn thuốc</div>
        <div>
          <MedicalTable />
        </div>
      </div>
    </div>
  )
}
