import Navbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import { Outlet, useLocation } from "react-router-dom";
import Cover from "../../components/generic/Cover";

const StudentLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
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
