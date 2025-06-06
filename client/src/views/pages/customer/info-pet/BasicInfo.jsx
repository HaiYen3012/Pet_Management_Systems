import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
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

function FormField({ label, value, name, onChange }) {
  return (
    <div className="flex flex-col pb-6 text-sm leading-5">
      <div className="text-black text-opacity-80">{label}</div>
      <div className="flex flex-col justify-center text-black mt-2 whitespace-nowrap bg-white rounded-sm border border-solid border-zinc-300 text-opacity-80">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="justify-center items-start px-3 py-1.5 bg-white rounded-sm border border-solid border-zinc-300 max-md:pr-5"
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
    <div className="flex flex-col max-md:mt-10 max-md:max-w-full">
      <h2 className="text-3xl font-medium leading-10 text-black text-opacity-80 max-md:max-w-full">
        Thông tin cơ bản
      </h2>
      <div className="mt-14 max-md:mt-10 max-md:max-w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow self-stretch text-sm leading-5 max-md:mt-10">
                {Object.entries(petInfo)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <FormField
                      key={key}
                      label={getLabel(key)} // Lấy nhãn từ hàm getLabel
                      value={value}
                      name={key}
                      onChange={handleChange}
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col self-stretch max-md:mt-10">
                {Object.entries(petInfo)
                  .slice(4)
                  .map(([key, value]) => (
                    <FormField
                      key={key}
                      label={getLabel(key)} // Lấy nhãn từ hàm getLabel
                      value={value}
                      name={key}
                      onChange={handleChange}
                    />
                  ))}
                <Button
                  htmlType="submit"
                  style={{ maxWidth: '200px' }}
                  type="primary"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
