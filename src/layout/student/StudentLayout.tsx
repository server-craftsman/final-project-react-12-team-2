import Navbar from "./StudentNavbar";
import { Outlet } from "react-router-dom";
const StudentLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">
        <Outlet />
      </main>
    </>
  );
};

export default StudentLayout;
