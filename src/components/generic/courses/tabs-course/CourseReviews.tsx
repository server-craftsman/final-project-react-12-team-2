import React, { useState, useEffect } from "react";
import { Card, Typography, Rate, Form, Input, Button, Modal, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { CourseReviewsProps } from "../../../../models/objects/course/CourseReviewsProps";
const { Text, Paragraph } = Typography;
import { ReviewService } from "../../../../services/review/review.service";

const CourseReviews: React.FC<CourseReviewsProps & { courseId: string }> = ({ reviews, courseId }) => {
  const [fetchedReviews, setFetchedReviews] = useState(reviews);
  const [form] = Form.useForm();

  const [hasUserCommented, setHasUserCommented] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
      setHasUserCommented(reviewsData.some(review => review.reviewer_id === userInfo._id));
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
      comment: review.comment,
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
        //debug
        // console.log("Updating review with ID:", editingReview._id);
        // console.log("Submitted values:", values);
        await ReviewService.updateReview(editingReview._id, {
          course_id: courseId,
          rating: values.rating,
          comment: values.comment,
        });
        message.success("Review updated successfully!");
        setEditingReview(null);
      } else {
        //debug
        // console.log("Creating new review with values:", values);
        await ReviewService.createReview({
          course_id: courseId,
          rating: values.rating,
          comment: values.comment,
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {!hasUserCommented && (
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
      {fetchedReviews.length > 0 ? (
        fetchedReviews.map((review, index) => (
          <Card key={review._id || index} className="mb-4">
            <div className="mb-2 flex items-center">
              <Text strong>{review.reviewer_name || "Unknown User"}</Text>
              <Rate disabled value={review.rating} className="ml-2" />
              {review.reviewer_id === JSON.parse(localStorage.getItem("userInfo") || '{}')._id && (
                <Button
                  type="link"
                  onClick={() => handleEdit(review)}
                  icon={<EditOutlined className="text-xl" />}
                  className="ml-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3949ab] px-4 py-2 text-white shadow-md transition-all duration-300 hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl hover:scale-105 active:scale-95"
                />
              )}
            </div>
            <Paragraph>{review.comment}</Paragraph>
          </Card>
        ))
      ) : null}

      <Modal
        title={editingReview ? "Edit Review" : "Submit Review"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
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
