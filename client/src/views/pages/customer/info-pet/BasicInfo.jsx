import React, { useState, useEffect } from 'react'
import { Button, ConfigProvider } from 'antd'
import pet from 'api/pet'
import { toast } from 'react-toastify'
import usePet from 'hooks/usePet'

function getLabel(key) {
  switch (key) {
    case 'fullname':
      return 'Tên'
    case 'sex':
      return 'Giới tính'
    case 'species':
      return 'Loài'
    case 'age':
      return 'Tuổi'
    case 'weight':
      return 'Cân nặng'
    case 'health':
      return 'Tình trạng sức khỏe'
    case 'describe':
      return 'Mô tả'
    default:
      return ''
  }
}

// Theme màu vàng nhẹ nhàng
const softYellowTheme = {
  token: {
    colorPrimary: '#F5D76E', // Vàng nhẹ nhàng
    colorPrimaryHover: '#F2C94C',
    colorPrimaryActive: '#E6B800',
  },
}

function FormField({ label, value, name, onChange }) {
  return (
    <div className="pb-6">
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: '#4A4A4A' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 text-sm border-2 rounded-lg transition-all duration-200 focus:outline-none"
          style={{
            borderColor: '#E8E8E8',
            backgroundColor: '#FEFEFE',
            color: '#4A4A4A'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#F5D76E'
            e.target.style.backgroundColor = '#FFFEF7'
            e.target.style.boxShadow = '0 0 0 3px rgba(245, 215, 110, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E8E8E8'
            e.target.style.backgroundColor = '#FEFEFE'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
    </div>
  )
}

export default function BasicInfo({selectedPet, setSelectedPet}) {
  const { customerPets, setCustomerPets } = usePet()
  const [petInfo, setPetInfo] = useState({
    fullname: '',
    sex: '',
    species: '',
    age: '',
    weight: '',
    health: '',
    describe: '',
  })

  useEffect(() => {
    if(selectedPet){
      const { fullname, sex, species, age, weight, health, describe } =
      selectedPet
    setPetInfo({ fullname, sex, species, age, weight, health, describe })
    }
  }, [selectedPet])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (
      [
        'fullname',
        'sex',
        'species',
        'age',
        'weight',
        'health',
        'describe',
      ].includes(name)
    ) {
      setPetInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setPetInfo(petInfo)
    const updateData = { ...selectedPet, ...petInfo }
    pet
      .updatePetInfo(selectedPet.pet_id, updateData)
      .then((res) => {
        toast.success('Cập nhật thành công')
        const updatedPets = customerPets.map((pet) =>
          pet.pet_id === selectedPet.pet_id
            ? { ...pet, ...updateData }
            : pet,
        )
        setSelectedPet(updateData)
        setCustomerPets(updatedPets)
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.message)
      })
    console.log(updateData)
  }

  return (
    <ConfigProvider theme={softYellowTheme}>
      <div 
        className="p-8 rounded-2xl shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF9E6 100%)',
          border: '1px solid #F5F5DC'
        }}
      >
        {/* Header với accent vàng nhẹ */}
        <div className="mb-8">
          <div 
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, #F5D76E 0%, #F2C94C 100%)',
              boxShadow: '0 2px 8px rgba(245, 215, 110, 0.3)'
            }}
          >
            <span className="text-white font-medium text-sm">🐾 Hồ sơ thú cưng</span>
          </div>
          <h2 
            className="text-3xl font-semibold leading-10"
            style={{ color: '#2D2D2D' }}
          >
            Thông tin cơ bản
          </h2>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin chi tiết cho bé yêu của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột trái */}
            <div className="space-y-2">
              {Object.entries(petInfo)
                .slice(0, 4)
                .map(([key, value]) => (
                  <FormField
                    key={key}
                    label={getLabel(key)}
                    value={value}
                    name={key}
                    onChange={handleChange}
                  />
                ))}
            </div>

            {/* Cột phải */}
            <div className="space-y-2">
              {Object.entries(petInfo)
                .slice(4)
                .map(([key, value]) => (
                  <FormField
                    key={key}
                    label={getLabel(key)}
                    value={value}
                    name={key}
                    onChange={handleChange}
                  />
                ))}
              
              {/* Button với style đẹp */}
              <div className="pt-4">
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  className="font-medium"
                  style={{
                    height: '48px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F5D76E 0%, #F2C94C 100%)',
                    borderColor: '#F5D76E',
                    boxShadow: '0 4px 12px rgba(245, 215, 110, 0.4)',
                    color: '#2D2D2D',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(245, 215, 110, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(245, 215, 110, 0.4)'
                  }}
                >
                  💾 Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ConfigProvider>
  )
}