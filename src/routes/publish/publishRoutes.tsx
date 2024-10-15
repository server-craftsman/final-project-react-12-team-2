import { RouteObject } from "react-router-dom";
import commonRoutes from "../subs/commonRoutes";
import authRoutes from "../subs/authRoutes";

// Define public routes
const publishRoutes: RouteObject[] = [...commonRoutes, ...authRoutes];

export default publishRoutes;