import React from 'react';
import { Outlet } from 'react-router-dom';

interface GuardPublicRouteProps {
  component: React.ReactNode;
}

const GuardPublicRoute = ({ component }: GuardPublicRouteProps) => (
  <div>
    {component}
    <Outlet />
  </div>
);

export default GuardPublicRoute;
