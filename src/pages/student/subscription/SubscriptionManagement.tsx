import React, { useState, useEffect } from 'react'
import StudentSubscription from '../../../components/student/subscription/StudentSubcription'
import SearchSubscribe from '../../../components/student/subscription/SearchSubscribe'
import { Subscriptions } from '../../../models/Subscriptions'
import { UserRole } from '../../../models/User'
import subscriptionData from '../../../data/subscriptions.json'
import data from '../../../data/users.json'
import { User } from '../../../models/User'
const SubscriptionManagement: React.FC = () => {
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscriptions[]>([])
  
  useEffect(() => {
    const instructorSubscriptions = subscriptionData.filter((subscription: Subscriptions) => {
      const user = data.users.find((user: any) => user.id === subscription.instructor_id)
      return user?.role === UserRole.INSTRUCTOR
    })
    setFilteredSubscriptions(instructorSubscriptions)
  }, [])

  const handleSearch = (value: string) => {
    const lowercasedValue = value.toLowerCase()
    const filtered = subscriptionData.filter((subscription: Subscriptions) => {
      const user = data.users.find((user: any) => user.id === subscription.instructor_id)
      return (
        user?.role === UserRole.INSTRUCTOR &&
        (user?.name.toLowerCase().includes(lowercasedValue) ||
          user?.email.toLowerCase().includes(lowercasedValue) ||
          user?.phone_number.toLowerCase().includes(lowercasedValue) ||
          subscription.id.toLowerCase().includes(lowercasedValue))
      )
    })
    setFilteredSubscriptions(filtered)
  }

  const subscriptionsWithUserData = filteredSubscriptions.map((subscription) => {
    const user = data.users.find((user: any) => user.id === subscription.instructor_id)
    return {
      ...subscription,
      user: {
        name: user?.name,
        email: user?.email,
        phone_number: user?.phone_number,
        avatar_url: user?.avatar_url
      }
    }
  })

  return (
    <>
      <SearchSubscribe onSearch={handleSearch} />
      <StudentSubscription subscriptions={subscriptionsWithUserData} users={data.users as unknown as User[]} />
    </>
  )
}

export default SubscriptionManagement