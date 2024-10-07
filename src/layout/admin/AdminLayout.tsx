import AdminNavbar from './AdminNavbar'
import { Outlet } from 'react-router-dom'
const Admin = () => {
  return (
    <>
    <div>
        <h1 className='text-2xl font-bold text-center'>Welcome Ủe</h1>
    </div>

    <AdminNavbar />
    <main className="container mx-auto"> 
        <Outlet />
    </main>
    </>
  )
}

export default Admin
