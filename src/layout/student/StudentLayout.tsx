import Navbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto flex-grow pt-20">
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
