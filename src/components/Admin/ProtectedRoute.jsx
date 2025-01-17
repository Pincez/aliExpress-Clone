import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show a loading state while user info is being fetched

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
