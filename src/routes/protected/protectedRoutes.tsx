import { RouteObject } from 'react-router-dom';
import adminRoutes from '../subs/adminRoutes';
import instructorRoutes from '../subs/instructorRoutes';
import studentRoutes from '../subs/studentRoutes';
import authRoutes from '../subs/authRoutes';

const protectedRoutes: RouteObject[] = [...adminRoutes, ...instructorRoutes, ...studentRoutes, ...authRoutes];

export default protectedRoutes;