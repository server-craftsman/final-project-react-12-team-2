import React from "react";

interface GuardPublicRouteProps {
  component: React.ReactNode;
}

const GuardPublicRoute = ({ component }: GuardPublicRouteProps) => <div>{component}</div>;

export default GuardPublicRoute;
