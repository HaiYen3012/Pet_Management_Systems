import API from './axios.config'
const staff = {
  updateStaffInfo: (staff_id, body) => {
    const url = `/staffs/${staff_id}`
    return API.put(url, body)
  },
  getAllStaff: () => {
    const url = '/staffs'
    return API.get(url)
  },
  deleteStaff: (staff_id) => {
    const url = `/staffs/${staff_id}`
    return API.delete(url)
  },
  createStaff: (body) => {
    const url = `/staffs`
    return API.post(url, body)
  },
}

export default staff
