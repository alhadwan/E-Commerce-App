import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, isSigningOut } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return React.createElement(Navigate, {
      to: isSigningOut ? "/" : "", //if isSigningOut is true, redirect to home page, otherwise stay on the current page 
      replace: true,
    });
  }
  return children;
};

export default PrivateRoute;
