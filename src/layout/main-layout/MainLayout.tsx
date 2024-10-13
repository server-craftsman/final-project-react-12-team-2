import Navbar from "./MainNavbar";
import StudentFooter from "./MainFooter";
import { Outlet, useLocation } from "react-router-dom";
import Cover from "../../components/generic/home/Cover";

const StudentLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {isHomePage && <Cover />}
      <main className={`container mx-auto flex-grow pt-[80px]`}>
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
