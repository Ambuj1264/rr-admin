import React from "react";
import { Outlet, Navigate } from "react-router-dom";
const PublicRoute = () => {
  const authKey = localStorage.getItem("TOKEN");
  return !authKey ? <Outlet /> : <Navigate to="/" />;
};
export default PublicRoute;
