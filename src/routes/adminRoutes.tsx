import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ManageCourses from "../pages/admin/course/ManageCourses";
import LessonManagement from "../components/admin/course/LessonManagement";

//import lazy
const DashBoardAdmin = lazy(() => import("../pages/admin/overview/DashBoardAdmin"));
const ManageCategory = lazy(() => import("../pages/admin/category/ManageCategory"));
const DetailsCategory = lazy(() => import("../components/admin/category/DetailsCategoty"));
const ManagePayment = lazy(() => import("../pages/admin/payout/ManagePayment"));
const ManagePurchase = lazy(() => import("../pages/admin/purchase/ManagePurchase"));
const ViewUserProfileDetail = lazy(() => import("../components/admin/user/ViewUserProfileDetail"));
const Profile = lazy(() => import("../pages/admin/setting/Setting"));
const ManageUser = lazy(() => import("../pages/admin/user/ManageUser"));
const AdminLayout = lazy(() => import("../layout/admin/AdminLayout"));
const EditUserProfile = lazy(() => import("../components/admin/setting/EditUserProfile"));
const EditCategory = lazy(() => import("../components/admin/category/EditCategory"));
//==============================================================

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashBoardAdmin /> },
      { path: "admin-info", element: <Profile /> },
      { path: "manage-user", element: <ManageUser /> },
      { path: "view-user/:id", element: <ViewUserProfileDetail /> },
      { path: "edit-user/:id", element: <EditUserProfile /> },
      { path: "payout", element: <ManagePayment /> },
      { path: "purchase", element: <ManagePurchase /> },
      { path: "categories", element: <ManageCategory /> },
      { path: "edit-category/:id", element: <EditCategory /> },
      { path: "/admin/courses",element: <ManageCourses/>},
      { path: "/admin/courses/lessons",element: <LessonManagement/>},
      {
        path: "categories/details-category",
        element: <DetailsCategory />,
      },
      {
        path: "categories/categories-details/:id",
        element: <DetailsCategory />,
      },
    ],
  },
];

export default adminRoutes;