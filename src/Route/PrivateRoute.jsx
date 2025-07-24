import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.js";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;