import API from "api/axios.config";
const beautyService = {
    getAllBeautyService: () => {
      const url = '/services/allBeauty'
      return API.get(url)
    },
    
    createBeautyService: (body) => {
      console.log(body)
      const url = '/services/createBeauty'
      return API.post(url, body)
    },
    
    updateBeautyService: (body) => {
      const url = '/services/updateBeauty'
      return API.put(url, body)
    },
    
    deleteBeautyService: (body) => {
      console.log(body);
      const url = '/services/deleteBeauty'
      return API.delete(url, { data: body })
    },

}
export default beautyService