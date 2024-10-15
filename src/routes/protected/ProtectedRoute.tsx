import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const ProtectedRoute = ({ element: Component, allowedRoles }: { element: React.ReactNode; allowedRoles: string[] }) => {
  const { user } = useContext(AuthContext);
  
  if (user && allowedRoles.includes(user.role.toUpperCase())) {
    return <>{Component}</>; // Ensure the component is rendered correctly
  } else {
    return <Navigate to="/login" replace />;
  }
};
