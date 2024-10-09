import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import EditUserProfile from '../components/instructor/EditUserProfile';
const InstructorLayout = lazy(() => import('../layout/instructor/InstructorLayout'))
const Dashboard = lazy(() => import('../components/instructor/Dashboard'))
const Setting = lazy(() => import('../pages/instructor/Setting'))
const InstructorInfo = lazy(() => import('../components/instructor/InstructorInfo'))

const instructorRoutes: RouteObject[] = [
    {
        path: '/instructor',
        element: <InstructorLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'setting', element: <Setting /> },
            { path: 'edit-user/:id', element: <EditUserProfile /> },
            { path: 'instructor-info', element: <InstructorInfo /> },


        ],
    },
]
export default instructorRoutes;