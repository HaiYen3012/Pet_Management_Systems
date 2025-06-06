import useAuth from "hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoutes = ({ redirectPath = "/login", children }) => {
  const { authData } = useAuth();
  const location = useLocation();

  if (!authData) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};
