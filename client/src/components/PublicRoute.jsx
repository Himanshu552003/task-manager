import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// if user is already logged in dont show login/register page
const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
