import { useProtectedRoutes } from "./protected/useProtectedRoutes";

const AppRoutes = () => {
  const protectedRoutes = useProtectedRoutes();

  return (
    <Routes>
      {/* Other public routes */}
      {protectedRoutes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
