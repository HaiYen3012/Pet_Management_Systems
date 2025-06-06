import axios from 'axios'
import queryString from 'query-string'

const API = axios.create({
  // baseURL: 'https://pet-manager.onrender.com/v1/api',
  baseURL: 'http://localhost:9000/v1/api',
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

API.interceptors.request.use(
  function (req) {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) req.headers['auth-token'] = token
    return req
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default API
