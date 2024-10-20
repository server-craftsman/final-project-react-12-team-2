import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import EditUserProfile from "../../components/student/setting/EditUserProfile";

//import lazy
const DashboardStudent = lazy(
  () => import("../../pages/student/overview/DashboardStudent"),
);
const Setting = lazy(() => import("../../pages/student/setting/Setting"));
const SubscriptionManagement = lazy(
  () => import("../../pages/student/subscription/SubscriptionManagement"),
);
const OrderManagement = lazy(
  () => import("../../pages/student/order/OrderManagement"),
);
const StudentDashboard = lazy(
  () => import("../../layout/student/StudentDashboard"),
);
//==============================================================

const studentRoutes: RouteObject[] = [
  {
    path: "/dashboard-student",
    element: <StudentDashboard />,
    children: [
      { index: true, element: <DashboardStudent /> },
      { path: "student-setting", element: <Setting /> },
      { path: "student-orders", element: <OrderManagement /> },
      { path: "student-subscription", element: <SubscriptionManagement /> },
      { path: "student/edit-user/:id", element: <EditUserProfile /> },
    ],
  },
];

export default studentRoutes;
