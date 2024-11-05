import { lazy } from "react";
import { ROUTER_URL } from "../../const/router.path";
import { RouteObject } from "react-router-dom";

//import student layout
import EditUserProfile from "../../components/student/setting/EditUserProfile";
const DashboardStudent = lazy(() => import("../../pages/student/overview/DashboardStudent"));
const Setting = lazy(() => import("../../pages/student/setting/Setting"));
const SubscriptionManagement = lazy(() => import("../../pages/student/subscription/SubscriptionManagement"));
const OrderManagement = lazy(() => import("../../pages/student/order/OrderManagement"));
const Purchase = lazy(() => import("../../pages/student/purchase/Purchase"));

export const studentSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.STUDENT.BASE]: [
    {
      index: true,
      element: <DashboardStudent />
    },
    {
      path: ROUTER_URL.STUDENT.SETTING,
      element: <Setting />
    },
    {
      path: ROUTER_URL.STUDENT.EDIT_USER,
      element: <EditUserProfile />
    },
    {
      path: ROUTER_URL.STUDENT.SUBSCRIPTION,
      element: <SubscriptionManagement />
    },
    {
      path: ROUTER_URL.STUDENT.ORDERS,
      element: <OrderManagement />
    },
    {
      path: ROUTER_URL.STUDENT.PURCHASE,
      element: <Purchase />
    }
  ]
};
