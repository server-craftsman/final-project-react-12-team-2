import { DollarOutlined, UserAddOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import purchasesData from "../../../data/purchases.json"; // Adjust the path as necessary
import subscriptionData from "../../../data/subscriptions.json";
import coursesData from "../../../data/courses.json"; // Import courses data

const DashboardNumber = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Count the total purchases
  const totalPurchases = purchasesData.purchases.length;

  // Count the total subscriptions
  const totalSubscriptions = subscriptionData.length;

  // Count the total courses
  const totalCourses = coursesData.courses.length;

  // Function to handle clicking on the Purchased box
  const handlePurchasedClick = () => {
    navigate("/dashboard-student/student-orders");
  };

  const handleSubscriptionClick = () => {
    navigate("/dashboard-student/student-subscription");
  };

  const handleCoursesClick = () => {
    navigate("/dashboard-student/student-courses");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      {/* Title Section */}
      <h1 className="mb-4 text-left text-3xl font-bold">Student Dashboard</h1>

      {/* Flex container for the boxes */}
      <div className="flex space-x-4">
        {/* Box for Total Purchases */}
        <div
          className="flex h-32 w-64 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-white p-6 shadow-lg"
          onClick={handlePurchasedClick}
        >
          <div className="text-center">
            <h1 className="mb-2 text-xl font-semibold">
              {" "}
              <DollarOutlined /> Purchased Courses
            </h1>
            <p className="text-3xl font-bold">{totalPurchases}</p>
           
          </div>
        </div>

        {/* Box for Total Subscriptions */}
        <div
          className="flex h-32 w-64 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-white p-6 shadow-lg"
          onClick={handleSubscriptionClick}
        >
          <div className="text-center">
            <h1 className="mb-2 text-xl font-semibold">
              {" "}
              <UserAddOutlined /> Subscribed
            </h1>
            <p className="text-3xl font-bold">{totalSubscriptions}</p>
          </div>
        </div>

        {/* Box for Total Courses */}
        <div
          className="flex h-32 w-64 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-white p-6 shadow-lg"
          onClick={handleCoursesClick}
        >
          <div className="text-center">
            <h1 className="mb-2 text-xl font-semibold">
              {" "}
              <BookOutlined /> Courses
            </h1>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNumber;
