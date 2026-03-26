import React, { type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }: { children: ReactNode }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user && userProfile?.role === "admin") {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  return children;
};

export default AdminRoutes;
