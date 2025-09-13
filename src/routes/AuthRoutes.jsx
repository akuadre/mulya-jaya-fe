import { Navigate, Outlet } from "react-router-dom";

// Untuk route yang cuma bisa diakses kalau user **belum login**
const GuestRoute = () => {
  const token = localStorage.getItem("adminToken");
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Untuk route yang cuma bisa diakses kalau user **sudah login**
const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export { GuestRoute, ProtectedRoute };
