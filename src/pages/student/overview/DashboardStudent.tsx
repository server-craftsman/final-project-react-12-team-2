
import { DollarOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import purchasesData from '../../../data/purchases.json'; // Adjust the path as necessary
import subscriptionData from '../../../data/subscriptions.json';

const DashboardStudent = () => {
    const navigate = useNavigate(); // Hook for navigation
  
    // Count the total purchases
    const totalPurchases = purchasesData.length;
  
    // Count the total subscriptions
    const totalSubscriptions = subscriptionData.length;

    // Function to handle clicking on the Purchased box
    const handlePurchasedClick = () => {
      navigate('/dashboard-student/student-orders'); // Navigate to Orders page
    };
    
    const handleSubscriptionClick = () => {
      navigate('/dashboard-student/student-subscription'); // Navigate to Subscription page
    };
  
    return (
      <div className="min-h-screen bg-gray-100 p-5 md:p-10">
        {/* Title Section */}
        <h1 className="font-bold text-3xl mb-4 text-left">Student Dashboard</h1>
  
        {/* Flex container for the boxes */}
        <div className="flex space-x-4">
          {/* Box for Total Purchases */}
          <div
            className="bg-white shadow-lg rounded-lg p-6 w-64 h-32 flex items-center justify-center border border-gray-400 cursor-pointer"
            onClick={handlePurchasedClick}
          >
            <div className="text-center">
              <h1 className="font-semibold text-xl mb-2"> <DollarOutlined /> Purchased Courses</h1>
              <p className="text-3xl font-bold">{totalPurchases}</p>
            </div>
          </div>
          
          {/* Box for Total Subscriptions */}
          <div
            className="bg-white shadow-lg rounded-lg p-6 w-64 h-32 flex items-center justify-center border border-gray-400 cursor-pointer"
            onClick={handleSubscriptionClick}
          >
            <div className="text-center">
              <h1 className="font-semibold text-xl mb-2"> <UserAddOutlined /> Subscribed</h1>
              <p className="text-3xl font-bold">{totalSubscriptions}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default DashboardStudent;
