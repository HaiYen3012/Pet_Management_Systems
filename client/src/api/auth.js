import API from './axios.config'

const auth = {
  login: (credentials) => {
    const url = '/auth/login'
    return API.post(url, credentials)
  },
  register: (credentials) => {
    const url = '/auth/signup'
    return API.post(url, credentials)
  },
  forgotPassword: (credentials) => {
    const url = '/auth/forgot-password'
    return API.post(url, credentials)
  },
  resetPassword: (credentials) => {
    const url = '/auth/reset-password'
    return API.post(url, credentials)
  },
}

export default auth
