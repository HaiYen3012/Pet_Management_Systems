import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Space, message, Input, Modal } from 'antd'
import {
  ExclamationCircleOutlined,
  CaretLeftOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import Highlighter from 'react-highlight-words'

const { Search } = Input
const { confirm } = Modal
import EditPetInfo from './edit-pet-info'
import MedicalPet from './medical-table'
import DietPet from './diet-table'

const data = [
  {
    pet_id: 'TC123',
    name: 'TradeCode 99',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'TC123',
    name: 'TradeCode 98',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'TC123',
    name: 'TradeCode 97',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'TC123',
    name: 'TradeCode 96',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'TC123',
    name: 'TradeCode 95',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'TC123',
    name: 'TradeCode 94',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'Nguyễn Văn A',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'KH123',
    name: 'TradeCode 93',
    species: 'Chó',
    age: 3,
    sex: 'John Browr',
    weight: 'KH123',
    user_id: 'text',
    x: 'text',
  },
  {
    pet_id: 'KH123',
    name: 'TradeCode 92',
    species: 'Hà Nội',
    age: 3,
    sex: 'John Browr',
    weight: 'KH123',
    user_id: 'text',
    x: 'text',
  },
]
const PetManager = () => {
  const [popupView, setPopupView] = useState(false)
  const [petInfo, setPetInfo] = useState(data)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })
  const petDetails = {
    id: '12345',
    name: 'Buddy',
    gender: 'Male',
    age: '3 years',
    weight: '15kg',
    type: 'Dog',
  }

  const [popupData, setPopupData] = useState(petDetails)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'pet_id',
      key: 'pet_id',

    },
    {
      title: 'Tên thú cưng',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Chủng loại',
      dataIndex: 'species',
      key: 'species',
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Giới tính',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'ID khách hàng',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <p onClick={() => handleViewDetail(record.pet_id)}>Xem chi tiết</p>
          <p>Cập nhật</p>
          <p onClick={() => showConfirm(record.pet_id)}>Xóa</p>
        </Space>
      ),
    },
  ]

  const handleViewDetail = (pet_id) => {
    setPopupView('detail')
    setPopupData(petDetails)

    //call api
  }

  const handleViewMedicalRecord = () => {
    //call api
    const data = {
      name: 'phong',
    }
    setPopupData()
    setPopupView('medicalRecord')
  }

  const handleViewDietPlan = () => {
    setPopupView('dietPlan')
  }
  const handleEditInfo = () => {
    setPopupView('edit')
  }

  const handleClosePopup = () => {
    setPopupView(false)
  }

  const PopupView = (props) => {
    return (
      <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
        <div className="flex flex-col px-11 pt-9 text-lg font-medium #1D2D35 bg-white rounded-2xl shadow-sm w-[936px] max-md:px-5">
          <div className="flex flex-row items-center justify-between">
            <div className="font-bold text-2xl">
              {popupView === 'detail' && 'Thông tin chi tiết'}
              {popupView === 'medicalRecord' && (
                <>
                  <a className="mr-5" onClick={handleViewDetail}>
                    <CaretLeftOutlined />
                  </a>
                  Hồ sơ bệnh án
                </>
              )}
              {popupView === 'dietPlan' && (
                <>
                  <a className="mr-5" onClick={handleViewDetail}>
                    <CaretLeftOutlined />
                  </a>
                  Chế độ ăn
                </>
              )}
              {popupView === 'edit' && (
                <>
                  <a className="mr-5" onClick={handleViewDetail}>
                    <CaretLeftOutlined />
                  </a>
                  Cập nhật thông tin
                </>
              )}
            </div>
            <img
              loading="lazy"
              onClick={handleClosePopup}
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f3cdb4f738951056cd82ceb92f181ffc7a691831fe00aab54da939ee58d9d52?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              alt="Account Selection Icon"
              className="shrink-0 mr-2.5 -ml-0.5 aspect-[1.11] w-[20px] cursor-pointer"
            />
          </div>
          <hr />
          <div className="flex flex-col max-md:ml-0 max-md:w-full mt-10 ">
            {popupView === 'detail' ? (
              <div className="flex flex-row grow gap-5 items-start text-xl font-medium text-black max-md:mt-10">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/65f34002def0f4527b83c5a4957fa03c66dec5accf8aa5825068709edd3a53ad?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
                  className="shrink-0 max-w-full border-white border-solid aspect-[0.99] border-[10px] w-[185px]"
                />
                <div className="flex flex-row justify-around w-full">
                  <div className="flex flex-col gap-14 ">
                    <div className=" flex flex-row font-semibold ">
                      ID thú cưng:{' '}
                      <p className="ml-1 font-normal">{props.id}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Tên thú cưng:{' '}
                      <p className="ml-1 font-normal">{props.name}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Giới tính:{' '}
                      <p className="ml-1 font-normal">{props.gender}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Tuổi: <p className="ml-1 font-normal">{props.age}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Cân nặng:{' '}
                      <p className="ml-1 font-normal">{props.weight}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Chủng loại:{' '}
                      <p className="ml-1 font-normal">{props.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-14 ">
                    <div className=" flex flex-row font-semibold ">
                      ID khách hàng:{' '}
                      <p className="ml-1 font-normal">{props.id}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Sức khỏe: <p className="ml-1 font-normal">{props.name}</p>
                    </div>
                    <div className=" flex flex-row font-semibold ">
                      Mô tả: <p className="ml-1 font-normal">{props.gender}</p>
                    </div>
                    <a
                      className=" flex flex-row font-semibold mt-20 text-blue-600"
                      onClick={handleViewMedicalRecord}
                    >
                      Xem hồ sơ bệnh án
                    </a>
                    <a
                      className=" flex flex-row font-semibold text-blue-600 "
                      onClick={handleViewDietPlan}
                    >
                      Xem chế độ ăn{' '}
                    </a>
                    <div className="self-end mb-10">
                      <Button
                        onClick={handleEditInfo}
                        icon={<EditOutlined />}
                        type="primary"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : popupView === 'medicalRecord' ? (
              <MedicalPet />
            ) : popupView === 'dietPlan' ? (
              <DietPet />
            ) : (
              popupView === 'edit' && (
                <div>
                  <EditPetInfo />
                </div>
              )
            )}
          </div>
        </div>
      </section>
    )
  }

  const onSearch = (value, _e, info) => console.log(info?.source, value)

  const handleDelete = (key) => {
    console.log(key)
    const newPetInfo = petInfo.filter((item) => item.pet_id !== key)
    setPetInfo(newPetInfo)
    message.success('Xóa khách hàng thành công!')
  }

  const showConfirm = (key) => {
    confirm({
      title: 'Bạn có chắc muốn xóa thú cưng ?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Bạn sẽ không thể hoàn tác và xem lại được thông tin của khách hàng.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(key)
      },
      onCancel() {},
    })
  }

  return (
    <div className="bg-white">
      <Space className="flex justify-center p-5">
        <div className="text-[30px] font-semibold">Danh sách Thú Cưng</div>
      </Space>

      <div className="flex flex-row w-2/5 items-center m-10">
        <p className="w-[100px]">Tìm kiếm</p>
        <Search
          className=""
          placeholder="nhập tên thú cưng, chủ,v.v..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={onSearch}
        />
      </div>
      {petInfo ? (
        <Table
          className=""
          columns={columns}
          dataSource={petInfo}
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <div>Không có thú cưng nào</div>
      )}
      {popupView && <PopupView {...popupData} />}
    </div>
  )
}

export default PetManager
