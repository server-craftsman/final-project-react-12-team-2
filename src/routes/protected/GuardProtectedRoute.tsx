import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const GuardProtectedRoute = ({ component: Component, path, userRole, allowedRoles }: { component: React.ReactNode, path: string, userRole: string, allowedRoles: string[] }) => {
  return (
    <Route
      path={path}
      element={
        allowedRoles.includes(userRole) ? (
          Component
        ) : (
          <Navigate to="/unauthorized" />
        )
      }
    />
  );
};

export default GuardProtectedRoute;
