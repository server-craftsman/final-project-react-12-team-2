import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Import lazy components
const Loading = lazy(() => import("../../app/redux/Loading"));
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
const AdminLayout = lazy(() => import("../../layout/admin/AdminLayout"));
const EditUserProfile = lazy(() => import("../../components/admin/setting/EditUserProfile"));
const EditCategory = lazy(() => import("../../components/admin/category/EditCategory"));
const PurchasesLog = lazy(() => import("../../pages/admin/purchasesLog/PurchasesLogManagement"));
const CoursesLog = lazy(() => import("../../pages/admin/course-log/CoursesLogManagement"));
const SubscriptionPage = lazy(() => import("../../pages/instructor/subscription/SubscriptionPage"));
const RequestAccountManagement = lazy(() => import("../../pages/admin/request-account/RequestAccountManagement"));

// Define admin routes
const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <DashBoardAdmin /> },
      { path: "admin-info", element: <Profile /> },
      { path: "manage-user", element: <ManageUser /> },
      { path: "view-user/:id", element: <ViewUserProfileDetail /> },
      { path: "edit-user/:id", element: <EditUserProfile /> },
      { path: "payout", element: <ManagePayment /> },
      { path: "purchase", element: <ManagePurchase /> },
      { path: "view-purchase/:id", element: <ViewPurchaseDetails /> },
      { path: "categories", element: <ManageCategory /> },
      { path: "edit-category/:id", element: <EditCategory /> },
      { path: "courses", element: <ManageCourses /> },
      { path: "purchases-log", element: <PurchasesLog /> },
      { path: "categories/details-category", element: <DetailsCategory /> },
      {
        path: "categories/categories-details/:id",
        element: <DetailsCategory />
      },
      { path: "courses-log", element: <CoursesLog /> },
      { path: "subscription", element: <SubscriptionPage /> },
      { path: "request-account", element: <RequestAccountManagement /> }
    ]
  }
];

export default adminRoutes;
