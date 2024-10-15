import React from 'react'
import reviewsData from "../../../data/reviews.json";
import coursesData from "../../../data/courses.json";
import { Review } from "../../../models/Review";
import { formatDate } from "../../../utils/helper";
import { StarFilled, StarOutlined } from '@ant-design/icons';

interface ReviewsProps {
  searchTerm: string;
}

const Reviews: React.FC<ReviewsProps> = ({ searchTerm }) => {
  const filteredReviews = reviewsData.reviews.filter((review: Review) => 
    !review.is_deleted && 
    (review.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coursesData.courses.find(course => course.id === review.course_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <StarFilled key={i} className="text-yellow-500" /> : <StarOutlined key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReviews.map((review: Review) => (
        <div key={review.id} className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">{coursesData.courses.find(course => course.id === review.course_id)?.name}</h3>
          <div className="flex items-center mb-2">{renderStars(review.rating)}</div>
          <p className="text-gray-500">Created At: {formatDate(new Date(review.created_at))}</p>
        </div>
      ))}
    </div>
  )
}

export default Reviews
