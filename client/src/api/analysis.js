import API from './axios.config'
const analysis = {
    getData: (year, params) => {
        const url = `/analysis/${year}`
        return API.get(url, params)
    },

}

export default analysis
