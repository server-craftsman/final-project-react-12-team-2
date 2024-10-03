import Navbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import { Outlet } from "react-router-dom";
const StudentLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">
        <Outlet />
      </main>
      <StudentFooter />
    </>
  );
};

export default StudentLayout;
