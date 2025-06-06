import useAuth from 'hooks/useAuth'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
const takePath = (roles) => {
  switch (roles) {
    case 'customer':
      return '/pet'
    case 'staff':
      return '/staff/pet-manage'
    case 'admin':
      return '/admin/statistics'
  }
}

export const GuestRoute = () => {
  const { authData, userData } = useAuth()

  if (authData) {
    userData && <Navigate to={takePath(userData.roles)} />
  }

  return <Outlet />
}

GuestRoute.defaultProps = {
  location: {},
}

export default GuestRoute
