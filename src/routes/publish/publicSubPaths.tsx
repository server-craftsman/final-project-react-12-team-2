import { lazy } from "react";
import { ROUTER_URL } from "../../const/router.path";
import { RouteObject } from "react-router-dom";

//================= PUBLIC SUB PATHS =================
const LoginPage = lazy(() => import("../../pages/login/LoginPage"));
const RegisterPage = lazy(() => import("../../pages/register/RegisterPage"));
const MainLayout = lazy(
  () => import("../../layout/main-layout/MainLayout"),
);
const HomePage = lazy(() => import("../../pages/home/HomePage"));
const CourseDetails = lazy(
  () => import("../../components/generic/courses/main-display/CourseDetails"),
);
const LessonDetails = lazy(
  () => import("../../components/generic/lessons/LessonDetails"),
);
const SessionDetails = lazy(
  () => import("../../components/generic/sessions/SessionDetails"),
);
const CartPage = lazy(
  () => import("../../components/generic/cart/CartPage"),
);
const About = lazy(() => import("../../components/generic/home/About"));

//======================================================
//export public sub paths
export const publicSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.COMMON.HOME]: [
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTER_URL.COMMON.HOME,
          element: <HomePage />,
        },
        {
          path: ROUTER_URL.COMMON.COURSE_BY_ID,
          element: <CourseDetails />,
        },
        {
          path: ROUTER_URL.COMMON.COURSE_BY_ID_LESSON,
          element: <LessonDetails />,
        },
        {
          path: ROUTER_URL.COMMON.COURSE_BY_ID_SESSION,
          element: <SessionDetails />,
        },
        {
          path: ROUTER_URL.COMMON.ABOUT,
          element: <About />,
        },
        {
          path: ROUTER_URL.COMMON.CART,
          element: <CartPage />,
        }
      ]
    }
  ],
  [ROUTER_URL.LOGIN]: [
    {
      path: ROUTER_URL.LOGIN,
      element: <LoginPage />,
    },
    {
      path: ROUTER_URL.REGISTER,
      element: <RegisterPage />,
    }
  ]
};
