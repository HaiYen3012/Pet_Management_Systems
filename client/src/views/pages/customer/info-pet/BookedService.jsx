import { useState, useEffect } from 'react'
import { Pagination } from './MedicalRecord'
import useService from 'hooks/useService'
import { useParams } from 'react-router-dom'
import { formatDateIsoString } from 'helpers/formartdate'
import { SpinAntd } from 'components/spinner/spinAntd'
import service from 'api/service'
import { toast } from 'react-toastify'

const statusColors = {
  Huỷ: 'bg-zinc-300',
  created: 'bg-sky-500',
  canceled: 'bg-red-500',
  processing: 'bg-lime-600',
}

export function ServiceTable() {
  const { slug } = useParams()
  const [selectedServices, setSelectedServices] = useState([])
  const { customerServices } = useService()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const petSelected = customerServices.find(
        (pet) => pet.pet_id.toString() === slug,
      )
      console.log(petSelected.services)

      setServices(petSelected.services)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [slug, customerServices])

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <SpinAntd></SpinAntd>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-500 text-xl">
        Thú cưng không sử dụng dịch vụ nào
      </div>
    )
  }

  const handleCheckboxChange = (index) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((id) => id !== index)
        : [...prevSelected, index],
    )
  }

  const handleDelete = () => {
    const servicesToDelete = services.filter((service, index) =>
      selectedServices.includes(index),
    )
    // console.log('Services to delete:', servicesToDelete)

    servicesToDelete.map((serviceCancel) => {
      const cancelState = {
        id: serviceCancel.id,
        status: 'canceled',
      }
      try {
        if (serviceCancel.service_type === 'beauty') {
          service.cancelBeauty(cancelState)
        }
        if (serviceCancel.service_type === 'appointment') {
          service.cancelAppointment(cancelState)
        }
        if (serviceCancel.service_type === 'storage') {
          const cancelStateStorage = {
            service_id: cancelState.id,
            status: cancelState.status
          }
          service.cancelStorage(cancelStateStorage)
        }

        toast.success("Cập nhật thành công")
      } catch (error) {
        toast.error("Cập nhật thất bại")
        console.log(error);

      }
    })
    // Call the API to cancel the selected services
    // Example: api.cancelServices(servicesToDelete);

    const updatedServices = services.map((service, index) => {
      if (selectedServices.includes(index)) {
        return { ...service, status: 'canceled' }
      }
      return service
    })
    setServices(updatedServices)
    setSelectedServices([])
  }

  return (
    <div className="flex flex-col pb-4 max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-2.5 justify-between px-2 py-4 w-full bg-white bg-opacity-0 max-md:flex-wrap max-md:max-w-full">
        <h2 className="text-2xl font-medium leading-8 text-black text-opacity-80">
          Dịch vụ đã đăng ký
        </h2>
        <div className="flex gap-4 text-sm leading-5">
          <div className="flex gap-1 py-1.5 text-black text-opacity-80">
            <div>Sắp xếp theo: Ngày</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/af6868c363bd70a17601ff26c778ba2e4a1d00a347e854ccd1c916a6aae9f0cf?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
              alt=""
              className="shrink-0 my-auto w-2.5 aspect-[0.71]"
            />
          </div>
          <button
            onClick={handleDelete}
            className="justify-center px-4 py-1 text-center text-white bg-red-600 rounded-sm border border-red-600 border-solid shadow-sm"
          >
            Hủy dịch vụ
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full border-b  bg-white ">
              <th className="px-4 py-2 text-left">Chọn</th>
              <th className="px-4 py-2 text-left">Mã dịch vụ</th>
              <th className="px-4 py-2 text-left">Dịch vụ</th>
              <th className="px-4 py-2 text-left">Giá dịch vụ</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Thời gian đăng ký</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => {
              return (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="px-4 py-2 text-sky-500">{service.id}</td>
                  <td className="px-4 py-2">{service.service_type}</td>
                  <td className="px-4 py-2">{service.total}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 mr-2 rounded-full ${statusColors[service.status]}`}
                      ></span>
                      {service.status}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {formatDateIsoString(service.service_date)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  )
}
