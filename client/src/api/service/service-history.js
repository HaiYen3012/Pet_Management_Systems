import API from "api/axios.config";

const ServiceHistoryAPI = {
    getAllPrice: () => {
        const url = '/services/allPrice'
        return API.get(url)
    },
    getDetailPet: () => {
        const url = '/services/detailPet'
        return API.get(url)
    },
    cancelAppointment: (body) => {
        const url = '/services/appointment/updateAppointment'
        return API.put(url, body)
    },
    cancelBeauty: (body) => {
        const url = '/services/updateBeauty'
        return API.put(url, body)
    },
    cancelStorageService: (body) => {
        const url = '/services/updateStorageService'
        return API.put(url, body)
    },
  
}

export default ServiceHistoryAPI