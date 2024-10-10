import { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Review } from '../../../models/Review';
import reviewsData from '../../../data/reviews.json';
import coursesData from '../../../data/courses.json';
import usersData from '../../../data/users.json';

interface ReviewsProps {
  searchTerm: string;
}

const Reviews: React.FC<ReviewsProps> = ({ searchTerm }) => {
  const [selectedInstructor] = useState<string>('1');

  const columns: ColumnsType<Review> = [
    {
      title: 'Course Name',
      dataIndex: 'course_id',
      key: 'course_id',
      render: (courseId: string) => {
        const course = coursesData.courses.find(course => course.id === courseId);
        return course ? course.name : 'Unknown Course';
      },
    },
    {
      title: 'Reviewer Name',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId: string) => {
        const user = usersData.users.find(user => user.id === userId);
        return user ? user.name : 'Unknown User';
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
  ];

  const filteredCourses = coursesData.courses.filter(
    course => course.user_id === selectedInstructor && !course.is_deleted
  );

  const courseIds = filteredCourses.map(course => course.id);

  const filteredReviews = reviewsData.reviews.filter(
    review => courseIds.includes(review.course_id) && !review.is_deleted
  );

  // Filter reviews based on search term
  const searchedReviews = filteredReviews.filter(review => {
    const course = coursesData.courses.find(course => course.id === review.course_id);
    return course && course.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Table columns={columns} dataSource={searchedReviews} rowKey="id" />
    </div>
  );
};

export default Reviews;