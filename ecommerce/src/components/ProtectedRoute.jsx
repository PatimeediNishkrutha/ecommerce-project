import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  // Admin
  return children;
}

export default ProtectedRoute;