import React, { useState } from 'react'
import { Tabs } from 'antd'
import DisplayReview from '../../../components/admin/review/DisplayReview'

const ReviewManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')

  const tabItems = [
    {
      label: 'All Review',
      key: 'all',
      children: <DisplayReview search={''} dateRange={null} isDelete={false} activeTab={activeTab} />,
    },
    {
      label: 'Review Delete',
      key: 'delete',
      children: <DisplayReview search={''} dateRange={null} isDelete={true} activeTab={activeTab} />,
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  )
}

export default ReviewManagement
