import { lazy } from "react";
import { CourseStatusEnum } from "../models/Course";

//lazy import
export const MainLayout = lazy(
  () => import("../layout/main-layout/MainLayout"),
);
export const HomePage = lazy(() => import("../pages/home/HomePage"));
export const CourseDetails = lazy(
  () => import("../components/generic/courses/main-display/CourseDetails"),
);
export const LessonDetails = lazy(
  () => import("../components/generic/lessons/LessonDetails"),
);
export const SessionDetails = lazy(
  () => import("../components/generic/sessions/SessionDetails"),
);
export const CartPage = lazy(
  () => import("../components/generic/cart/CartPage"),
);
export const About = lazy(() => import("../components/generic/home/About"));
//routes
export const homeRoute = { index: true, element: <HomePage /> };
export const aboutRoute = { path: "/about", element: <About /> };
export const courseDetailsRoute = {
  path: "/course/:id",
  element: <CourseDetails />,
};
export const courseByIdRoute = {
  path: "/course/:courseId",
  element: <CourseDetails />,
};
export const sessionDetailsRoute = {
  path: "/course/:courseId/session/:sessionId",
  element: <SessionDetails />,
};
export const lessonDetailsRoute = {
  path: "/course/:courseId/lesson/:lessonId",
  element: <LessonDetails />,
};
export const cartRoute = { path: "cart", element: <CartPage /> };

export const courseStatusName = {
  [CourseStatusEnum.new]: 'New',
  [CourseStatusEnum.waiting_approve]: 'Waiting for Approval',
  [CourseStatusEnum.approve]: 'Approved',
  [CourseStatusEnum.reject]: 'Rejected',
  [CourseStatusEnum.active]: 'Active',
  [CourseStatusEnum.inactive]: 'Inactive'
};