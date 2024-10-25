import { Suspense } from "react";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import Loading from "./app/Loading";
import { useSelector } from "react-redux";
import RunRoutes from "./routes/run/run";

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);

  return (
    <>
      {isLoading && <Loading />}
      <Suspense>
        <RunRoutes />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};
