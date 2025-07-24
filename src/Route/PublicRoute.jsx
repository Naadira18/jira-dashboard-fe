import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.js";

const PublicRoute = () => {
  const { isAuthenticated, isOtpRequired } = useAuth();

  if (isOtpRequired) {
    return <Navigate to="/otp" />;
  }

  return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoute;