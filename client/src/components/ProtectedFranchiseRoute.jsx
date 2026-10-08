import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedFranchiseRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080D0A] text-emerald-400">
        Loading Portal...
      </div>
    );
  }

  if (!user || user.role !== "franchise") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
