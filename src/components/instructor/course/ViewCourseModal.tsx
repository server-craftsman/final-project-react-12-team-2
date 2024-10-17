import React from "react";
import { Modal } from "antd";
import { Course } from "../../../models/Course";

interface ViewCourseModalProps {
  visible: boolean;
  course: Course | null;
  onClose: () => void;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({ visible, course, onClose }) => {
  return (
    <Modal title="Course Details" open={visible} onCancel={onClose} footer={null}>
      {course && (
        <div>
          <p><b>Name:</b> {course.name}</p>
          <p><b>Category:</b> {course.category_id}</p>
          <p><b>Description:</b> {course.description}</p>
          <p><b>Content:</b> {course.content}</p>
          <p><b>Price:</b> ${course.price}</p>
          <p><b>Status:</b> {course.status}</p>
          <p><b>Video URL:</b> {course.video_url}</p>
          <p><b>Created At:</b> {course.created_at}</p>
          <p><b>Updated At:</b> {course.updated_at}</p>
        </div>
      )}
    </Modal>
  );
};

export default ViewCourseModal;
