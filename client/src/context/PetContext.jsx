import { createContext, useContext, useEffect, useState } from 'react'
import pet from 'api/pet'
import useAuth from 'hooks/useAuth'
const PetContext = createContext()

export const PetProvider = ({ children }) => {
  const [customerPets, setCustomerPets] = useState([])
  const [allPets, setAllPets] = useState([])
  const { userData } = useAuth()
 

  useEffect(() => {
    if (userData && userData.roles === 'customer') {
      pet
        .getPetList()
        .then((response) => {
          setCustomerPets(response.data)
        })
        .catch((error) => {
          console.error('Error fetching customer pet list:', error)
        })
    }
  }, [userData])

  useEffect(() => {
    if (
      userData &&
      (userData.roles === 'staff' || userData.roles === 'admin' || userData.roles === 'doctor')
    ) {

      pet
        .getAllPet()
        .then((response) => {
          setAllPets(response.data)
        })
        .catch((error) => {
          console.error('Error fetching all pets:', error)
        })
    }
  }, [userData])

  return (
    <PetContext.Provider
      value={{ customerPets, setCustomerPets, allPets, setAllPets }}
    >
      {children}
    </PetContext.Provider>
  )
}

export default PetContext
