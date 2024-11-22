import React, { useState, useEffect } from "react";
import { Card, Typography, Rate, Form, Input, Button, Modal, message, Progress } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
// import { CourseReviewsProps } from "../../../../models/objects/course/CourseReviewsProps";
const { Text, Paragraph } = Typography;
import { ReviewService } from "../../../../services/review/review.service";
import { GetPublicCourseDetailResponse } from "../../../../models/api/responsive/course/course.response.model";
import { useAuth } from "../../../../contexts/AuthContext";
import { helpers } from "../../../../utils";
const CourseReviews: React.FC<any & { courseId: string, course: any, averageRating: number, reviewCount: number }> = ({ reviews, courseId, course, averageRating, reviewCount }) => {
  const [fetchedReviews, setFetchedReviews] = useState(reviews);
  const [form] = Form.useForm();

  const [hasUserCommented, setHasUserCommented] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { userInfo } = useAuth();

  const [visibleReviews, setVisibleReviews] = useState(3);

  const fetchReviews = async () => {
    try {
      const response = await ReviewService.searchForReview({
        searchCondition: {
          course_id: courseId,
          rating: 0,
          is_instructor: false,
          is_rating_order: false,
          is_deleted: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      const reviewsData = response.data.data.pageData;
      setFetchedReviews(reviewsData);
      // setAverageRating(calculateAverageRating(reviewsData));
      setHasUserCommented(reviewsData.some((review) => review.reviewer_id === userInfo?._id));
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review: any) => {
    if (!review._id) {
      console.error("Review ID is undefined", review);
      return;
    }
    setEditingReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingReview(null);
  };

  const handleSubmit = async (values: { rating: number; comment: string }) => {
    try {
      if (editingReview && editingReview._id) {
        await ReviewService.updateReview(editingReview._id, {
          course_id: courseId,
          rating: values.rating,
          comment: values.comment
        });
        message.success("Review updated successfully!");
        setEditingReview(null);
      } else {
        await ReviewService.createReview({
          course_id: courseId,
          rating: values.rating,
          comment: values.comment
        });
        message.success("Review created successfully!");
      }
      setFetchedReviews([]);
      await fetchReviews();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to submit review", error);
      message.error("Failed to submit review. Please try again.");
    }
  };

  const checkUserInfo = (course: GetPublicCourseDetailResponse) => {
    return course?.is_purchased;
  };
  
  // Calculate the number of reviews for each star rating
  const starCounts = [0, 0, 0, 0, 0];
  fetchedReviews.forEach((review: any) => {
    if (review.rating >= 1 && review.rating <= 5) {
      starCounts[review.rating - 1]++;
    }
  });

  // Calculate the percentage for each star rating
  const starPercentages = starCounts.map(count => (reviewCount ? (count / reviewCount * 100).toFixed(2) : 0));

  // Function to handle loading more reviews
  const handleViewMore = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-6">
        <Typography.Title level={4}>Learner Reviews</Typography.Title>
      
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-900 mr-2">{averageRating?.toFixed(1) || '0.0'}</span>
                <Rate disabled value={averageRating || 0} className="text-amber-400" />
              </div>
              <Text className="ml-2 text-sm text-gray-500">
                {reviewCount?.toLocaleString() || 0} reviews
              </Text>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center">
              <Text className="block w-12">5 stars:</Text>
              <Progress percent={parseFloat(starPercentages[4].toString())} showInfo={false} className="w-48" strokeColor="#1a237e" />
              <Text className="ml-2">{starPercentages[4]}%</Text>
            </div>
            <div className="flex items-center">
              <Text className="block w-12">4 stars:</Text>
              <Progress percent={parseFloat(starPercentages[3].toString())} showInfo={false} className="w-48" strokeColor="#3949ab" />
              <Text className="ml-2">{starPercentages[3]}%</Text>
            </div>
            <div className="flex items-center">
              <Text className="block w-12">3 stars:</Text>
              <Progress percent={parseFloat(starPercentages[2].toString())} showInfo={false} className="w-48" strokeColor="#5c6bc0" />
              <Text className="ml-2">{starPercentages[2]}%</Text>
            </div>
            <div className="flex items-center">
              <Text className="block w-12">2 stars:</Text>
              <Progress percent={parseFloat(starPercentages[1].toString())} showInfo={false} className="w-48" strokeColor="#7986cb" />
              <Text className="ml-2">{starPercentages[1]}%</Text>
            </div>
            <div className="flex items-center">
              <Text className="block w-12">1 star:</Text>
              <Progress percent={parseFloat(starPercentages[0].toString())} showInfo={false} className="w-48" strokeColor="#9fa8da" />
              <Text className="ml-2">{starPercentages[0]}%</Text>
            </div>
          </div>
      </div>

      <Text className="mb-4">Showing {Math.min(visibleReviews, reviewCount)} of {reviewCount} reviews</Text>

      {!hasUserCommented && checkUserInfo(course) && (
        <Form form={form} onFinish={handleSubmit} layout="vertical" className="mb-4">
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please provide a rating" }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Comment" rules={[{ required: true, message: "Please provide a comment" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-btn-submit">
              {editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </Form.Item>
        </Form>
      )}

      {fetchedReviews.slice(0, visibleReviews).map((review: any, index: number) => (
        <Card key={review._id || index} className="mb-6 rounded-2xl border-none bg-gradient-to-r from-white to-gray-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="mb-4 flex items-center space-x-4">
          <img src={`https://ui-avatars.com/api/?name=${review.reviewer_name[0]}`} alt={review.reviewer_name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex flex-col">
              <Text strong className="text-lg font-semibold text-indigo-900">
                {review.reviewer_name || "Unknown User"}
              </Text>
              <Rate disabled value={review.rating} className="text-amber-400" />
              <Text className="text-sm text-gray-500">Reviewed on {helpers.formatDate(review.created_at)}</Text>
            </div>
            {review.reviewer_id === userInfo?._id && (
              <Button type="link" onClick={() => handleEdit(review)} icon={<EditOutlined className="text-xl" />} className="ml-auto" />
            )}
          </div>
          <Paragraph className="text-base leading-relaxed text-gray-700">{review.comment}</Paragraph>
        </Card>
      ))}

      {visibleReviews < reviewCount && (
        <button onClick={handleViewMore} className="mt-4">
          View More Reviews
        </button>
      )}

      <Modal 
        title={editingReview ? "Edit Review" : "Submit Review"} 
        open={isModalVisible} 
        onCancel={handleModalCancel} 
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item 
            name="rating" 
            label="Rating" 
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item 
            name="comment" 
            label="Comment" 
            rules={[{ required: true, message: "Please provide a comment" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-btn-submit rounded-lg hover:bg-[#1a237e] hover:text-white
                transition-all duration-300 block
                hover:scale-[1.02] active:scale-[0.98]
                sm:inline-block sm:w-40 sm:float-right sm:text-base sm:py-2 sm:px-6 sm:font-medium sm:tracking-wide sm:shadow-lg sm:hover:shadow-xl"
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CourseReviews;
