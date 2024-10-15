import { RouteObject } from "react-router-dom";
import {
  MainLayout,
  homeRoute,
  courseDetailsRoute,
  courseByIdRoute,
  sessionDetailsRoute,
  lessonDetailsRoute,
  cartRoute,
  aboutRoute,
  unauthorizedRoute,
} from "../../const/constCommon";

const commonRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      homeRoute,
      courseDetailsRoute,
      courseByIdRoute,
      sessionDetailsRoute,
      lessonDetailsRoute,
      cartRoute,
      aboutRoute,
      unauthorizedRoute,
    ],
  },
];

export default commonRoutes;
