import { Tabs } from 'antd'
import CoursesManagement from '../../../components/admin/course/CoursesManagement'
import LessonManagement from '../../../components/admin/course/LessonManagement'
import SessionManagement from '../../../components/admin/course/SessionManagement'
import TabPane from 'antd/es/tabs/TabPane'

const ManageCourses = () => {
  return (
    <div className='w-full flex-col gap-4'>
  
      <Tabs defaultActiveKey="1">
        <TabPane tab="Courses" key="1">
          <CoursesManagement/>
        </TabPane>
        <TabPane tab="Sessions" key="2">
          <SessionManagement />
        </TabPane>
        <TabPane tab="Lessons" key="3">
          <LessonManagement />
        </TabPane>
      </Tabs>
   
    </div>
  )
}

export default ManageCourses
