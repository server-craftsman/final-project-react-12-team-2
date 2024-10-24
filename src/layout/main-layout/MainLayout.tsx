import React, { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
const Navbar = lazy(() => import("./MainNavbar"));
const StudentFooter = lazy(() => import("./MainFooter"));
const Cover = lazy(() => import("../../components/generic/home/Cover"));
const Loading = lazy(() => import("../../app/Loading"));

const StudentLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {isHomePage && <Cover />}
      <main className={`container mx-auto flex-grow pt-[80px]`}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
