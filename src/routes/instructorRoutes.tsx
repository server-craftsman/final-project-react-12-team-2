import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const InstructorLayout = lazy(() => import('../layout/instructor/InstructorLayout'))
const Dashboard = lazy(() => import('../components/instructor/Dashboard'))
const Setting = lazy(() => import('../components/instructor/Setting'))

const instructorRoutes: RouteObject[] = [
    {
        path: '/instructor',
        element: <InstructorLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'setting', element: <Setting /> },


        ],
    },
]
export default instructorRoutes;