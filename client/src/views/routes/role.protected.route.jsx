import useAuth from 'hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

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

export const RoleProtectedRoute = ({
  redirectPath = '/login',
  children,
  roles,
}) => {
  const { authData, userData } = useAuth()
  const { state } = useLocation()

  const location = useLocation()

  if (!authData) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  if (roles.includes(userData && userData.roles)) {
    return children ? children : <Outlet />
  }

  return <Navigate to={state?.from || takePath(userData && userData.roles)} />
}
