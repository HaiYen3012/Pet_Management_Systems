import { useContext } from 'react'
import UserContext from 'context/UserContext'

const useAuth = () => {
  return useContext(UserContext)
}

export default useAuth
