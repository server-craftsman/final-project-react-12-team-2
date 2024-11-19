import { Suspense } from "react";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import RunRoutes from "./routes/run/run";

export const App = () => {
  return (
    <>
      <Suspense>
        <RunRoutes />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};
