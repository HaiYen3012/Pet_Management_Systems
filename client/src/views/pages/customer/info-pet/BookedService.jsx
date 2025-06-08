import { useState, useEffect } from 'react'
import { Pagination } from './MedicalRecord'
import useService from 'hooks/useService'
import { useParams } from 'react-router-dom'
import { formatDateIsoString } from 'helpers/formartdate'
import { SpinAntd } from 'components/spinner/spinAntd'
import service from 'api/service'
import { toast } from 'react-toastify'

const statusColors = {
  Huỷ: 'bg-gray-400',
  created: 'bg-blue-500',
  canceled: 'bg-red-500',
  processing: 'bg-green-500',
}

const statusColorsNew = {
  Huỷ: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-400'
  },
  created: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  canceled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500'
  },
  processing: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
}

const serviceTypeTranslations = {
  beauty: 'Làm đẹp',
  appointment: 'Khám bệnh',
  storage: 'Lưu trữ',
}

export function ServiceTable() {
  const { slug } = useParams()
  const [selectedServices, setSelectedServices] = useState([])
  const { customerServices } = useService()
  const [services, setServices] = useState([])
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' hoặc 'desc'
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

  // Hàm sắp xếp dịch vụ theo ngày
  const sortedServices = services.sort((a, b) => {
    const dateA = new Date(a.service_date)
    const dateB = new Date(b.service_date)
    
    if (sortOrder === 'desc') {
      return dateB - dateA // Mới nhất trước
    } else {
      return dateA - dateB // Cũ nhất trước
    }
  })

  // Hàm thay đổi thứ tự sắp xếp
  const handleSortChange = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc')
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 flex justify-center items-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <SpinAntd />
          <p className="text-amber-600 font-medium mt-4 text-center">Đang tải dịch vụ...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 flex justify-center items-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg">Thú cưng không sử dụng dịch vụ nào</p>
        </div>
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
    const servicesToDelete = sortedServices.filter((service, index) =>
      selectedServices.includes(index),
    )

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
    <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100">
      <div className="w-full px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-yellow-100">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white">Dịch vụ đã đăng ký</h2>
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <button
                  onClick={handleSortChange}
                  className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm hover:bg-opacity-30 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-white">
                    Sắp xếp theo: Ngày ({sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'})
                  </span>
                  <svg 
                    className={`w-3 h-3 text-white transition-transform duration-200 ${
                      sortOrder === 'desc' ? 'rotate-0' : 'rotate-180'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedServices.length === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedServices.length > 0
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Hủy dịch vụ ({selectedServices.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100">
          <div className="overflow-x-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-yellow-100">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-yellow-100 to-amber-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedServices.length === sortedServices.length && sortedServices.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices(sortedServices.map((_, index) => index))
                        } else {
                          setSelectedServices([])
                        }
                      }}
                      className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    Mã
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    Dịch vụ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase">
                    Ngày
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-100">
                {sortedServices.map((service, index) => {
                  const statusStyle = statusColorsNew[service.status] || statusColorsNew.created;
                  return (
                    <tr key={service.id} className="hover:bg-yellow-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-amber-600">#{service.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {serviceTypeTranslations[service.service_type] || service.service_type}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {service.total?.toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-2 h-2 mr-1 rounded-full ${statusStyle.dot}`}></span>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">
                          {formatDateIsoString(service.service_date)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination />
        </div>
      </div>
    </div>
  )
}