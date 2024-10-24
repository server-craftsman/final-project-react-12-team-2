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
const EditCategory = lazy(() => import("../../components/admin/category/EditCategory"));
const PurchasesLog = lazy(() => import("../../pages/admin/purchasesLog/PurchasesLogManagement"));
const CoursesLog = lazy(() => import("../../pages/admin/course-log/CoursesLogManagement"));
const SubscriptionPage = lazy(() => import("../../pages/instructor/subscription/SubscriptionPage"));
const RequestAccountManagement = lazy(() => import("../../pages/admin/request-account/RequestAccountManagement"));

export const adminSubPaths: Record<string, RouteObject[]> = {
    [ROUTER_URL.ADMIN_PATH]: [
        {
            index: true,
            element: <DashBoardAdmin />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.COURSES.replace('/', ''),
            element: <ManageCourses />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.CATEGORIES.replace('/', ''),
            element: <ManageCategory />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.PAYOUT.replace('/', ''),
            element: <ManagePayment />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.PURCHASE.replace('/', ''),
            element: <ManagePurchase />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.REQUEST_ACCOUNT.replace('/', ''),
            element: <RequestAccountManagement />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS.replace('/', ''),
            element: <DetailsCategory />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS_ID.replace('/', ''),
            element: <DetailsCategory />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.COURSES_LOG.replace('/', ''),
            element: <CoursesLog />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.PURCHASES_LOG.replace('/', ''),
            element: <PurchasesLog />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.SUBSCRIPTION.replace('/', ''),
            element: <SubscriptionPage />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.EDIT_USER.replace('/', ''),
            element: <EditUserProfile />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.EDIT_CATEGORY.replace('/', ''),
            element: <EditCategory />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.VIEW_PURCHASE.replace('/', ''),
            element: <ViewPurchaseDetails />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.VIEW_USER.replace('/', ''),
            element: <ViewUserProfileDetail />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.INFO.replace('/', ''),
            element: <Profile />,
        },
        {
            index: false,
            path: ROUTER_URL.ADMIN.MANAGE_USER.replace('/', ''),
            element: <ManageUser />,
        }
    ]
};
