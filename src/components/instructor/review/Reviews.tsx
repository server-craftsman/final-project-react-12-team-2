import React from "react";
import reviewsData from "../../../data/reviews.json";
import coursesData from "../../../data/courses.json";
import { Review } from "../../../models/prototype/Review";
import { formatDate } from "../../../utils/helper";
import { StarFilled, StarOutlined } from "@ant-design/icons";

interface ReviewsProps {
  searchTerm: string;
}

const Reviews: React.FC<ReviewsProps> = ({ searchTerm }) => {
  const filteredReviews = reviewsData.reviews.filter(
    (review: Review) =>
      !review.is_deleted &&
      (review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coursesData.courses
          .find((course) => course.id === review.course_id)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarFilled key={i} className="text-yellow-500" />
        ) : (
          <StarOutlined key={i} className="text-yellow-500" />
        ),
      );
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredReviews.map((review: Review) => (
        <div
          key={review.id}
          className="transform rounded-lg bg-white p-6 shadow-lg transition duration-500 hover:scale-105"
        >
          <h3 className="mb-2 text-xl font-semibold">
            {
              coursesData.courses.find(
                (course) => course.id === review.course_id,
              )?.name
            }
          </h3>
          <div className="mb-2 flex items-center">
            {renderStars(review.rating)}
          </div>
          <p className="text-gray-500">
            Created At: {formatDate(new Date(review.created_at))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
