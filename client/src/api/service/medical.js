import API from "api/axios.config";
const MedicalService = {
    getAllPrice: () => {
      const url = '/services/allPrice'
      return API.get(url)
    },

    getAllAppointmentbyUserSession: () => {
      const url = '/services/appointment/getAllAppointmentbyUserSession'
      return API.get(url)
    },

    createAppointment: (body) => {
      const url = '/services/appointment/CreateAppointment'
      return API.post(url, body)
    },

    updateAppointment: (body) => {
      const url = '/services/appointment/updateAppointment'
      return API.put(url, body)
    },

    deleteAppointment: (body) => {
      const url = '/services/appointment/deleteAppointment'
      return API.delete(url, {data: body})
    },
}
export default MedicalService