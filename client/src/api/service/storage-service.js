import API from '../axios.config'
const service = {
  getAllPrice: () => {
    const url = '/services/allPrice'
    return API.get(url)
  },

  getAllStorageService: () => {
    const url = '/services/getAllStorageService'
    return API.get(url)
  },

  createStorageService: (body) => {
    const url = '/services/CreateStorageService'
    return API.post(url, body)
  },

  updateStorageService: (body) => {
    const url = '/services/updateStorageService'
    return API.put(url, body)
  },

  deleteStorageService: (body) => {
    const url = '/services/deleteStorageService'
    return API.delete(url, { data: body })
  },
}


export default service
