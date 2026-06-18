import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleProtectedRoute({ children, requiredRole }) {
  const { current_user } = useContext(AuthContext);

  const hasRole = (roleName) => {
    return current_user?.roles?.some((r) => r.name === roleName);
  };

  if (!current_user || !current_user.id) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
