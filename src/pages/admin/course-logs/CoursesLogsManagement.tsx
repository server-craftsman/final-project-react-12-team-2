import React from 'react'
import CustomSearch from "../../../components/generic/search/CustomSearch";
import CoursesLogs from '../../../components/admin/courses-logs/CoursesLogs';

const CoursesLogsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <div>
      <CustomSearch onSearch={setSearchQuery} />
      <CoursesLogs searchQuery={searchQuery} />
    </div>
  )
}

export default CoursesLogsManagement
