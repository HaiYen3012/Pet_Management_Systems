import API from './axios.config'

const service = {
  getMedicalRecordsbyPetId: (params) => {
    const url = '/services/getMedicalRecordsbyPetId'
    return API.get(url, { params })
  },
  updateMedicalRecordsbyPetId: (body) => {
    const url = '/services/appointment/updateMedicalRecord'
    return API.put(url, body)
  },

  getTimePrice: () => {
    const url = '/services/allPrice'
    return API.get(url)
  },
  createAppointment: (body) => {
    const url = '/services/appointment/CreateAppointment'
    return API.post(url, body)
  },
  createStorage: (body) => {
    const url = '/services/CreateStorageService'
    return API.post(url, body)
  },
  createBeauty: (body) => {
    const url = '/services/createBeauty'
    return API.post(url, body)
  },
  getAllServiceByUserId: () => {
    const url = '/services/detailPet'
    return API.get(url)
  },
  cancelAppointment: (body) => {
    const url = '/services/updateAppointment'
    return API.put(url, body)
  },
  cancelBeauty: (body) => {
    const url = '/services/updateBeauty'
    return API.put(url, body)
  },
  cancelStorage: (body) => {
    const url = '/services/updateStorageService'
    return API.put(url, body)
  },
  getAllAppointment: () => {
    const url = '/services/getAllAppointmentbyUserSession'
    return API.get(url)
  },
  createMedicalRecord: (body) => {
    const url = '/services/appointment/CreateMedicalRecord'
    return API.post(url, body)
  },
}

export default service
