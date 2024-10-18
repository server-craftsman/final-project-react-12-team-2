import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Purchases from "../../pages/instructor/purchase/PurchasesManagement";
import ManagePayout from "../../pages/instructor/payout/ManagePayout";
import CourseManagement from "../../pages/instructor/course/CourseManagement";

//import lazy
const EditUserProfile = lazy(
  () => import("../../components/instructor/setting/EditUserProfile"),
);
const InstructorLayout = lazy(
  () => import("../../layout/instructor/InstructorLayout"),
);
const Dashboard = lazy(
  () => import("../../pages/instructor/overview/Dashboard"),
);
const Setting = lazy(() => import("../../pages/instructor/setting/Setting"));
const InstructorInfo = lazy(
  () => import("../../components/instructor/setting/InstructorInfo"),
);
const Review = lazy(() => import("../../pages/instructor/review/Review"));
const OrderPage = lazy(() => import("../../pages/instructor/order/OrderPage"));
const SubscriptionPage = lazy(
  () => import("../../pages/instructor/subscription/SubscriptionPage"),
);
const ViewTransactions = lazy(
  () => import("../../components/instructor/payout/ViewTransactions"),
);


//==============================================================

const instructorRoutes: RouteObject[] = [
  {
    path: "/instructor",
    element: <InstructorLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "setting", element: <Setting /> },
      { path: "edit-user/:id", element: <EditUserProfile /> },
      { path: "instructor-info", element: <InstructorInfo /> },
      { path: "reviews", element: <Review /> },
      { path: "purchases", element: <Purchases /> },
      { path: "payout", element: <ManagePayout /> },
      { path: "payout/view-transactions/:id", element: <ViewTransactions isVisible={true} onClose={() => {}} transactions={[]} /> },
      { path: "orders", element: <OrderPage /> },
      { path: "courses", element: <CourseManagement /> },
      { path: "subscription", element: <SubscriptionPage /> },
    ],
  },
];
export default instructorRoutes;
