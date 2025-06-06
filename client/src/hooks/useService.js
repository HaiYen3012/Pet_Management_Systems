import { useContext } from 'react'
import ServiceContext from 'context/ServiceContext'

const useService = () => {
  return useContext(ServiceContext)
}

export default useService
