import React from 'react';
import { Card, Typography, Rate } from 'antd';
import { motion } from 'framer-motion';

const { Text, Paragraph } = Typography;

interface CourseReviewsProps {
  reviews: any[];
  users: any[];
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ reviews, users }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {reviews.length > 0 ? (
        reviews.map(review => (
          <Card key={review.id} className="mb-4">
            <div className="flex items-center mb-2">
              <Text strong>{users.find(user => user.id === review.user_id)?.name}</Text>
              <Rate disabled defaultValue={review.rating} className="ml-2" />
            </div>
            <Paragraph>{review.comment}</Paragraph>
          </Card>
        ))
      ) : (
        <Paragraph>No reviews yet.</Paragraph>
      )}
    </motion.div>
  );
};

export default CourseReviews;
