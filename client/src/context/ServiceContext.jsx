import { createContext, useContext, useEffect, useState } from 'react'
import service from 'api/service'
import useAuth from 'hooks/useAuth'
const ServiceContext = createContext()

export const ServiceProvider = ({ children }) => {
  const [customerServices, setCustomerServices] = useState([])
  const [allServices, setAllServices] = useState([])
  const [serviceAppointment, setServiceAppointment] = useState([])
  const [serviceBeauty, setServiceBeauty] = useState([])
  const [serviceStorage, setServiceStorage] = useState([])

  const { userData } = useAuth()

  useEffect(() => {
    if (userData && userData.roles === 'customer') {
      service
        .getAllServiceByUserId()
        .then((response) => {
          // console.log(response.data)
          setCustomerServices(response.data)
        })
        .catch((error) => {
          console.error('Error fetching customer pet list:', error)
        })
    }

    service
      .getTimePrice()
      .then((response) => {
        setServiceAppointment(response.data.appointment)
        setServiceBeauty(response.data.beauty)
        setServiceStorage(response.data.storage)
      })
      .catch((error) => {
        console.error('Error fetching time price list:', error)
      })
  }, [userData])

  return (
    <ServiceContext.Provider
      value={{
        customerServices,
        setCustomerServices,
        serviceAppointment,
        setServiceAppointment,
        serviceBeauty,
        setServiceBeauty,
        serviceStorage,
        setServiceStorage,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export default ServiceContext
