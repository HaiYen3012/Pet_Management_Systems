import { useContext } from 'react'
import PetContext from 'context/PetContext'

const usePet = () => {
  return useContext(PetContext)
}

export default usePet
