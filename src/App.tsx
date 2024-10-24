import { Suspense } from "react";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import Loading from "./app/Loading";
import { useSelector } from "react-redux";
// Import RunRoutes component instead of function
import RunRoutes from "./routes/run/run";

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);
  const role = useSelector((state: any) => state.userRole) || 'guest';
  console.log("User Role:", role);

  return (
    <>
      <Suspense fallback={isLoading ? <Loading /> : null}>
        <RunRoutes />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};