import { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Review } from '../../../models/Review';
import reviewsData from '../../../data/reviews.json';
import coursesData from '../../../data/courses.json';
import { useNavigate } from 'react-router-dom';

interface ReviewsProps {
  searchTerm: string;
}

const Reviews: React.FC<ReviewsProps> = ({ searchTerm }) => {
  const [selectedInstructor] = useState<string>('1'); // Assume '1' is the instructor's ID
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/instructor/reviews/${id}`);
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'Course Name',
      dataIndex: 'course_id',
      key: 'course_id',
      render: (courseId: string) => {
        const course = coursesData.courses.find(course => course.id === courseId);
        return course ? course.name : 'Unknown Course';
      },
      onCell: (_, index) => {
        if (index === undefined || !searchedReviews || index >= searchedReviews.length) return { rowSpan: 0 }; // Ensure index is defined and within bounds
        const courseId = searchedReviews[index].course_id;
        const courseReviews = searchedReviews.filter(review => review.course_id === courseId);
        const rowSpan = index === 0 || searchedReviews[index - 1].course_id !== courseId ? courseReviews.length : 0;
        return { rowSpan };
      },
    },
    {
      title: 'Total User Comments',
      dataIndex: 'course_id',
      key: 'total_user_comments',
      render: (courseId: string) => {
        const courseReviews = reviewsData.reviews.filter(review => review.course_id === courseId);
        return courseReviews.length;
      },
      onCell: (_, index) => {
        if (index === undefined || !searchedReviews || !Array.isArray(searchedReviews)) return { rowSpan: 0 }; // Ensure searchedReviews is defined and an array
        const courseId = searchedReviews[index].course_id;
        const courseReviews = searchedReviews.filter(review => review.course_id === courseId);
        const rowSpan = index === 0 || searchedReviews[index - 1].course_id !== courseId ? courseReviews.length : 0;
        return { rowSpan };
      },
    },
    {
      title: 'Average Rating',
      dataIndex: 'course_id',
      key: 'average_rating',
      render: (courseId: string) => {
        const courseReviews = reviewsData.reviews.filter(review => review.course_id === courseId);
        const averageRating = courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length;
        return courseReviews.length ? averageRating.toFixed(2) : 'No Ratings';
      },
      onCell: (_, index) => {
        if (index === undefined || !searchedReviews || !Array.isArray(searchedReviews)) return { rowSpan: 0 }; // Ensure searchedReviews is defined and an array
        const courseId = searchedReviews[index].course_id;
        const courseReviews = searchedReviews.filter(review => review.course_id === courseId);
        const rowSpan = index === 0 || searchedReviews[index - 1].course_id !== courseId ? courseReviews.length : 0;
        return { rowSpan };
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Review) => (
        <a onClick={() => handleViewDetails(record.id)}>View Details</a>
      ),
      onCell: (_, index) => {
        if (index === undefined || !searchedReviews || !Array.isArray(searchedReviews)) return { rowSpan: 0 }; // Ensure searchedReviews is defined and an array
        const courseId = searchedReviews[index].course_id;
        const courseReviews = searchedReviews.filter(review => review.course_id === courseId);
        const rowSpan = index === 0 || searchedReviews[index - 1].course_id !== courseId ? courseReviews.length : 0;
        return { rowSpan };
      },
    },
  ];
  
  // Filter courses by the selected instructor
  const filteredCourses = coursesData.courses.filter(
    course => course.user_id === selectedInstructor && !course.is_deleted
  );

  // Get course IDs for the filtered courses
  const courseIds = filteredCourses.map(course => course.id);

  // Filter reviews for the instructor's courses
  const filteredReviews = reviewsData.reviews.filter(
    review => courseIds.includes(review.course_id) && !review.is_deleted
  );

  // Further filter reviews based on the search term
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