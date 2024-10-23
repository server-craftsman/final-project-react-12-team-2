import React from 'react';
import { Route } from 'react-router-dom';

const GuardPublicRoute = ({ component: Component, path }: { component: React.ReactNode, path: string }) => {
    return (
      <Route
        path={path}
        element={Component}
      />
    );
  };
  
  export default GuardPublicRoute;
