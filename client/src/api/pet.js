import API from './axios.config'
const pet = {
  getPetList: () => {
    const url = '/pets/pet-list'
    return API.get(url)
  },
  getPetInfo: (pet_id, params) => {
    const url = `/pets/${pet_id}`
    return API.get(url, params)
  },
  getAllPet: () => {
    const url = '/pets/all-pet'
    return API.get(url)
  },

  updatePetInfo: (pet_id, body) => {
    const url = `/pets/${pet_id}`
    return API.put(url, body)
  },
  createPet: (user_id, body) => {
    const url = `/pets/${user_id}/add-pet`
    return API.post(url, body)
  },
  createPetByStaff: (body) => {
    const url = '/pets/add-pet'
    return API.post(url, body)
  },
  deletePet: (pet_id) => {
    const url = `/pets/${pet_id}`
    return API.delete(url)
  },
}

export default pet
