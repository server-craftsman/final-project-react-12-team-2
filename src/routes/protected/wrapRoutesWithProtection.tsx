import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

export const wrapRoutesWithProtection = function(routes: RouteObject[], allowedRoles: string[]) {
  return routes.map(route => {
    const Component = route.element;
    if (Component) {
      return {
        ...route,
        element: (
          <ProtectedRoute element={Component} allowedRoles={allowedRoles} />
        )
      };
    }
    return route;
  });
};
