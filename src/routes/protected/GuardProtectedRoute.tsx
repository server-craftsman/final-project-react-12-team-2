import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTER_URL } from "../../const/router.path";
interface GuardProtectedRouteProps {
  component: React.ReactNode;
  userRole: string;
  allowedRoles: string[];
  onAccessDenied: () => void;
}

const GuardProtectedRoute = ({ component, userRole, allowedRoles, onAccessDenied }: GuardProtectedRouteProps) => {
  if (!allowedRoles.includes(userRole)) {
    onAccessDenied();
    return <Navigate to={ROUTER_URL.UNAUTHORIZED} replace />;
  }
  return <div>{component}</div>;
};

export default GuardProtectedRoute;
