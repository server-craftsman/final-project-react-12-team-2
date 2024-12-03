import { lazy } from "react";
import { ROUTER_URL } from "../../const/router.path";
import { RouteObject } from "react-router-dom";
//import admin layout
const ManageCourses = lazy(() => import("../../pages/admin/course/ManageCourses"));
const DashBoardAdmin = lazy(() => import("../../pages/admin/overview/DashBoardAdmin"));
const ManageCategory = lazy(() => import("../../pages/admin/category/ManageCategory"));
const DetailsCategory = lazy(() => import("../../components/admin/category/DetailsCategoty"));
const ManagePayment = lazy(() => import("../../pages/admin/payout/ManagePayment"));
const ManagePurchase = lazy(() => import("../../pages/admin/purchase/ManagePurchase"));
const ViewUserProfileDetail = lazy(() => import("../../components/admin/user/ViewUserProfileDetail"));
const ViewPurchaseDetails = lazy(() => import("../../components/admin/purchases/ViewPurchaseDetails"));
const Profile = lazy(() => import("../../pages/admin/setting/Setting"));
const ManageUser = lazy(() => import("../../pages/admin/user/ManageUser"));
const EditUserProfile = lazy(() => import("../../components/admin/setting/EditUserProfile"));
// const EditCategory = lazy(() => import("../../components/admin/category/EditCategory"));
const PurchasesLog = lazy(() => import("../../pages/admin/purchasesLog/PurchasesLogManagement"));
const AdminBlog = lazy(() => import("../../pages/admin/blog/BLogManagement"));
const SubscriptionPage = lazy(() => import("../../pages/instructor/subscription/SubscriptionPage"));
const RequestAccountManagement = lazy(() => import("../../pages/admin/request-account/RequestAccountManagement"));
const CourseLogManagement = lazy(() => import("../../pages/admin/courseLog/CourseLogManagement"));
const ReviewManagement = lazy(() => import("../../pages/admin/review/ReviewManagement"));
//======================================================

//export admin sub paths
export const adminSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.ADMIN.BASE]: [
    {
      index: true,
      element: <DashBoardAdmin />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.COURSES,
      element: <ManageCourses />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.CATEGORIES,
      element: <ManageCategory />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.PAYOUT,
      element: <ManagePayment />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.PURCHASE,
      element: <ManagePurchase />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.REQUEST_ACCOUNT,
      element: <RequestAccountManagement />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS,
      element: <DetailsCategory />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS_ID,
      element: <DetailsCategory />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.BLOG,
      element: <AdminBlog />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.PURCHASES_LOG,
      element: <PurchasesLog />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.SUBSCRIPTION,
      element: <SubscriptionPage />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.EDIT_USER,
      element: <EditUserProfile />
    },
    // {
    //   index: false,
    //   path: ROUTER_URL.ADMIN.EDIT_CATEGORY,
    //   element: <EditCategory />
    // },
    {
      index: false,
      path: ROUTER_URL.ADMIN.VIEW_PURCHASE,
      element: <ViewPurchaseDetails />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.VIEW_USER_DETAILS,
      element: <ViewUserProfileDetail />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.INFO,
      element: <Profile />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.MANAGE_USER,
      element: <ManageUser />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.COURSES_LOG,
      element: <CourseLogManagement />
    },
    {
      index: false,
      path: ROUTER_URL.ADMIN.REVIEW,
      element: <ReviewManagement />
    }
  ]
};
