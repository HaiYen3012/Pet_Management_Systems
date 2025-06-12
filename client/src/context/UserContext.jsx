// File: context/UserContext.js
// COPY TẤT CẢ NỘI DUNG DƯỚI ĐÂY VÀ PASTE VÀO FILE CỦA BẠN

import WithAxios from 'helpers/WithAxios'
import { createContext, useEffect, useState } from 'react'
import user from 'api/user'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('collapsed') === 'true',
  )
  const [authData, setAuthData] = useState(
    JSON.parse(localStorage.getItem('token')),
  )

  useEffect(() => {
    // Hàm này được tách ra để có thể tái sử dụng
    const fetchInfoUser = async () => {
      try {
        const res = await user.getProfile()
        setUserData(res?.data)
      } catch (error) {
        console.error("Failed to fetch user profile, possibly logged out.", error)
        // Nếu lỗi (ví dụ token hết hạn), thì logout để dọn dẹp
        logout()
      }
    }
    
    if (isLoggedIn) {
      fetchInfoUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
      // Không cần setAuthData ở đây vì nó đã được khởi tạo từ localStorage ở useState
    }
  }, [])

  const setUserInfo = (data) => {
    const { user, token } = data
    setIsLoggedIn(true)
    setUserData(user)
    setAuthData(token)
    localStorage.setItem('token', JSON.stringify(token))
  }

  // ===================================================================
  // ===== HÀM NÀY ĐÃ ĐƯỢC SỬA LẠI ĐỂ FIX LỖI "TRANG TRẮNG" =====
  // ===================================================================
  const updateUserData = async (newUserInfo) => {
    // newInfo là một object chứa các trường đã thay đổi từ form
    
    try {
      // 1. Gửi yêu cầu cập nhật lên server trước
      // Nếu API thất bại, nó sẽ ném ra lỗi và các dòng code bên dưới sẽ không được thực thi
      await user.updateUserInfo(userData.user_id, newUserInfo)

      // 2. Nếu API thành công, cập nhật state của React một cách an toàn
      // Bằng cách này, chúng ta giữ lại các trường không thay đổi (như user_id)
      // và chỉ ghi đè những trường đã được cập nhật từ form.
      setUserData(prevUserData => ({
        ...prevUserData, // Giữ lại toàn bộ dữ liệu cũ
        ...newUserInfo,  // Ghi đè các trường mới
      }));
      
      // Không cần trả về gì cũng được, nhưng nếu component con cần, bạn có thể trả về một giá trị
      return { success: true, message: "Cập nhật thành công!" };

    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error)
      // Ném lỗi ra để component gọi hàm này (PersonalInfo) có thể bắt và xử lý
      // (ví dụ: hiển thị toast báo lỗi)
      throw error
    }
  }
  // ===================================================================
  // ===================================================================


  const logout = () => {
    setUserData(null)
    setAuthData(null)
    setIsLoggedIn(false)
    // Gọi API logout để xóa token trên server (nếu có)
    user.logout()
    // Xóa token khỏi localStorage
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData, // Giữ lại nếu bạn cần ở đâu đó khác
        setUserState: setUserInfo, // Đổi tên cho rõ ràng hơn
        logout,
        isLoggedIn,
        setIsLoggedIn,
        authData,
        setAuthData,
        collapsed,
        setCollapsed,
        updateUserData, // Cung cấp hàm đã sửa
      }}
    >
      <WithAxios>{children}</WithAxios>
    </UserContext.Provider>
  )
}

export default UserContext