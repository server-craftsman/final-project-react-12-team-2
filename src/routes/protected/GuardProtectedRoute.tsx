import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTER_URL } from '../../const/router.path';
interface GuardProtectedRouteProps {
  component: React.ReactNode;
  userRole: string;
  allowedRoles: string[];
}

const GuardProtectedRoute = ({ component, userRole, allowedRoles }: GuardProtectedRouteProps) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTER_URL.UNAUTHORIZED} replace />;
  }

  return (
    <div>
      {component}
      <Outlet />
    </div>
  );
};

export default GuardProtectedRoute;
