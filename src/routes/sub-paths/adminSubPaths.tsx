import { lazy, Suspense } from "react";
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
const AdminLayout = lazy(() => import("../../layout/admin/AdminLayout"));
const EditUserProfile = lazy(() => import("../../components/admin/setting/EditUserProfile"));
const EditCategory = lazy(() => import("../../components/admin/category/EditCategory"));
const PurchasesLog = lazy(() => import("../../pages/admin/purchasesLog/PurchasesLogManagement"));
const CoursesLog = lazy(() => import("../../pages/admin/course-log/CoursesLogManagement"));
const SubscriptionPage = lazy(() => import("../../pages/instructor/subscription/SubscriptionPage"));
const RequestAccountManagement = lazy(() => import("../../pages/admin/request-account/RequestAccountManagement"));

//import instructor layout
const Loading = lazy(() => import("../../app/Loading"));

export const adminSubPaths: Record<string, RouteObject[]> = {
    [ROUTER_URL.ADMIN.BASE]: [
        { 
            path: ROUTER_URL.ADMIN.BASE, 
            element: (
                <Suspense fallback={<Loading />}>
                    <AdminLayout />
                </Suspense>
            ),
            children: [
                {
                    index: true, // Use index for the default child route
                    element: <DashBoardAdmin />,
                },
                {
                    path: ROUTER_URL.ADMIN.COURSES,
                    element: <ManageCourses />,
                },
                {
                    path: ROUTER_URL.ADMIN.CATEGORIES,
                    element: <ManageCategory />,
                },
                {
                    path: ROUTER_URL.ADMIN.PAYOUT,
                    element: <ManagePayment />,
                },
                {
                    path: ROUTER_URL.ADMIN.PURCHASE,
                    element: <ManagePurchase />,
                },
                {
                    path: ROUTER_URL.ADMIN.REQUEST_ACCOUNT,
                    element: <RequestAccountManagement />,
                },
                {
                    path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS,
                    element: <DetailsCategory />,
                },
                {
                    path: ROUTER_URL.ADMIN.CATEGORIES_DETAILS_ID,
                    element: <DetailsCategory />,
                },
                {
                    path: ROUTER_URL.ADMIN.COURSES_LOG,
                    element: <CoursesLog />,
                },
                {
                    path: ROUTER_URL.ADMIN.PURCHASES_LOG,
                    element: <PurchasesLog />,
                },
                {
                    path: ROUTER_URL.ADMIN.SUBSCRIPTION,
                    element: <SubscriptionPage />,
                },
                {
                    path: ROUTER_URL.ADMIN.EDIT_USER,
                    element: <EditUserProfile />,
                },
                {
                    path: ROUTER_URL.ADMIN.EDIT_CATEGORY,
                    element: <EditCategory />,
                },
                {
                    path: ROUTER_URL.ADMIN.VIEW_PURCHASE,
                    element: <ViewPurchaseDetails />,
                },
                {
                    path: ROUTER_URL.ADMIN.VIEW_USER,
                    element: <ViewUserProfileDetail />,
                },
                {
                    path: ROUTER_URL.ADMIN.INFO,
                    element: <Profile />,
                },
                {
                    path: ROUTER_URL.ADMIN.MANAGE_USER,
                    element: <ManageUser />,
                }
            ]
        }
    ],
};
