import { Suspense } from "react";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import Loading from "./app/Loading";
import { useSelector } from "react-redux";
import RunRoutes from "./routes/run/run";
import { useAuth } from "./contexts/AuthContext";

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);
  const { role } = useAuth();
  console.log("User Role from AuthContext:", role);
  console.log("User Role from localStorage:", localStorage.getItem("role"));

  return (
    <>
      <Suspense fallback={isLoading ? <Loading /> : null}>
        <RunRoutes />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};
