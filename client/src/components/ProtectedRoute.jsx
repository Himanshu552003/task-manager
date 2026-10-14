import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// only logged in users can see these pages
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
