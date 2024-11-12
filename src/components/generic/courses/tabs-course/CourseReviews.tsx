import React, { useState, useEffect } from "react";
import { Card, Typography, Rate, Form, Input, Button, Modal, message, Avatar } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { CourseReviewsProps } from "../../../../models/objects/course/CourseReviewsProps";
const { Text, Paragraph } = Typography;
import { ReviewService } from "../../../../services/review/review.service";
import { GetPublicCourseDetailResponse } from "../../../../models/api/responsive/course/course.response.model";
import { useAuth } from "../../../../contexts/AuthContext";

const CourseReviews: React.FC<CourseReviewsProps & { courseId: string, course: any }> = ({ reviews, courseId, course }) => {
  const [fetchedReviews, setFetchedReviews] = useState(reviews);
  const [form] = Form.useForm();

  const [hasUserCommented, setHasUserCommented] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { userInfo } = useAuth();

  const fetchReviews = async () => {
    try {
      const response = await ReviewService.searchForReview({
        searchCondition: {
          course_id: courseId,
          rating: 0,
          is_instructor: false,
          is_rating_order: false,
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      const reviewsData = response.data.data.pageData;
      setFetchedReviews(reviewsData);
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
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
      {fetchedReviews.length > 0
        ? fetchedReviews.map((review, index) => (
            <Card key={review._id || index} className="mb-6 rounded-2xl border-none bg-gradient-to-r from-white to-gray-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="mb-4 flex items-center space-x-4">
                <Avatar src={userInfo?.avatar_url} size={48} className="border-2 border-indigo-100 shadow-md" />
                <div className="flex flex-col">
                  <Text strong className="text-lg font-semibold text-indigo-900">
                    {review.reviewer_name || "Unknown User"}
                  </Text>
                  <Rate disabled value={review.rating} className="text-amber-400" />
                </div>
                {review.reviewer_id === userInfo?._id && <Button type="link" onClick={() => handleEdit(review)} icon={<EditOutlined className="text-xl" />} className="bg-gradient-tone ml-auto flex items-center gap-2 rounded-xl px-6 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-700 hover:to-indigo-900 hover:shadow-xl active:scale-95" />}
              </div>
              <Paragraph className="text-base leading-relaxed text-gray-700">{review.comment}</Paragraph>
            </Card>
          ))
        : null}

      <Modal title={editingReview ? "Edit Review" : "Submit Review"} open={isModalVisible} onCancel={handleModalCancel} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
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
      </Modal>
    </motion.div>
  );
};

export default CourseReviews;
