import { lazy } from "react";
import { ROUTER_URL } from "../../const/router.path";
import { RouteObject } from "react-router-dom";

// Import instructor pages
const EditUserProfile = lazy(() => import("../../components/instructor/setting/EditUserProfile"));
const Dashboard = lazy(() => import("../../pages/instructor/overview/Dashboard"));
const Setting = lazy(() => import("../../pages/instructor/setting/Setting"));
const InstructorInfo = lazy(() => import("../../components/instructor/setting/InstructorInfo"));
const Review = lazy(() => import("../../pages/instructor/review/Review"));
const OrderPage = lazy(() => import("../../pages/instructor/order/OrderPage"));
const SubscriptionPage = lazy(() => import("../../pages/instructor/subscription/SubscriptionPage"));
const ManagePayout = lazy(() => import("../../pages/instructor/payout/ManagePayout"));

const Purchases = lazy(() => import("../../pages/instructor/purchase/PurchasesManagement"));
const CourseManagement = lazy(() => import("../../pages/instructor/course/CourseManagement"));

export const instructorSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.INSTRUCTOR.BASE]: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.SETTING,
      element: <Setting />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.EDIT_USER,
      element: <EditUserProfile />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.REVIEWS,
      element: <Review />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.ORDERS,
      element: <OrderPage />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.SUBSCRIPTION,
      element: <SubscriptionPage />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.PAYOUT,
      element: <ManagePayout />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.INFO,
      element: <InstructorInfo />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.PURCHASES,
      element: <Purchases />
    },
    {
      path: ROUTER_URL.INSTRUCTOR.COURSES,
      element: <CourseManagement />
    }
  ]
};
