import { lazy } from "react";

import CoursesManagement from '../components/admin/CoursesManagement'
const Profile = lazy(() => import('../pages/admin/Profile'))
const ManageUser = lazy(() => import('../pages/admin/ManageUser'))
const AdminLayout = lazy(() => import('../layout/admin/AdminLayout'))
const EditUserProfile = lazy(() => import('../components/admin/EditUserProfile'))
import { RouteObject } from "react-router-dom";
import DashBoardAdmin from "../pages/admin/DashBoardAdmin";
import ManageCategory from "../pages/admin/ManageCategory";
import DetailsCategory from "../components/admin/DetailsCategoty";
import ManagePayment from "../pages/admin/ManagePayment";
import ManagePurchase from "../pages/admin/ManagePurchase";
const ViewUserProfileDetail = lazy(
  () => import("../components/admin/ViewUserProfileDetail")
);

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashBoardAdmin /> },
      { path: 'admin-info', element: <Profile /> },
      { path: 'manage-user', element: <ManageUser /> },
      { path: 'view-user/:id', element: <ViewUserProfileDetail /> },
      { path: 'edit-user/:id', element: <EditUserProfile /> },
      { path: '/admin/courses', element: <CoursesManagement /> },

      { path: "payout", element: <ManagePayment /> },
      { path: "purchase", element: <ManagePurchase /> },
      { path: "categories", element: <ManageCategory /> },
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
