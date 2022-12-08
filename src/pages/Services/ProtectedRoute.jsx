import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminRoute,
  redirect = "/login",
  redirectAdmin = "/me/profile",
}) => {
    if (!isAuthenticated) {
      console.log(isAuthenticated)
    return <Navigate to={redirect} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;