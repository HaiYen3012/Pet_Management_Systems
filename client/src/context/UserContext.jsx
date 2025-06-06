// import API from "api/axiosClient";
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
    if (isLoggedIn) {
      const fetchInfoUser = async () => {
        const res = await user.getProfile()
        setUserData(res?.data)
      }
      fetchInfoUser()
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
      setAuthData(JSON.parse(localStorage.getItem('token')))
    }
  }, [])

  const setUserInfo = (data) => {
    const { user, token } = data
    setIsLoggedIn(true)
    setUserData(user)
    setAuthData(token)
    localStorage.setItem('token', JSON.stringify(token))
  }
  const updateUserData = async ({
    fullname,
    email,
    username,
    phone_numbers,
    address,
    city,
    country,
  }) => {
    const res = await user.updateUserInfo(userData.user_id, {
      fullname,
      email,
      username,
      phone_numbers,
      address,
      city,
      country,
    })
    setUserData(res.data)
  }

  const logout = () => {
    setUserData(null)
    setAuthData(null)
    setIsLoggedIn(false)
    user.logout()
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        setUserState: (data) => setUserInfo(data),
        logout,
        isLoggedIn,
        setIsLoggedIn,
        authData,
        setAuthData,
        collapsed,
        setCollapsed,
        updateUserData,
      }}
    >
      <WithAxios>{children}</WithAxios>
    </UserContext.Provider>
  )
}

export default UserContext
