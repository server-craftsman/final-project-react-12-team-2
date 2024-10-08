import { Outlet } from 'react-router-dom'
const StudentDashboard = () => {
  return (
    <>

      <main className='container mx-auto flex-grow pt-[80px]'>
        <Outlet />
      </main>
    </>
  )
}

export default StudentDashboard
