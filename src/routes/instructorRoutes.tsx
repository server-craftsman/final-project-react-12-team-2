import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Purchases from "../pages/instructor/purchase/Purchases";
import ManagePayout from "../pages/instructor/payout/ManagePayout";

//import lazy
const EditUserProfile = lazy(
  () => import("../components/instructor/setting/EditUserProfile")
);
const InstructorLayout = lazy(
  () => import("../layout/instructor/InstructorLayout")
);
const Dashboard = lazy(
  () => import("../components/instructor/overview/Dashboard")
);
const Setting = lazy(() => import("../pages/instructor/setting/Setting"));
const InstructorInfo = lazy(
  () => import("../components/instructor/setting/InstructorInfo")
);
const Review = lazy(() => import("../pages/instructor/review/Review"));
const ReviewsDetail = lazy(
  () => import("../components/instructor/review/ReviewsDetail")
);
const OrderPage = lazy(() => import("../pages/instructor/order/OrderPage"));
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
      { path: "reviews/:courseId", element: <ReviewsDetail /> },
      { path: "purchases", element: <Purchases /> },
      { path: "payout", element: <ManagePayout /> },
      { path: "orders", element: <OrderPage /> },
    ],
  },
];
export default instructorRoutes;
