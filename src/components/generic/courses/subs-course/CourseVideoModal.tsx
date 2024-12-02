import React from "react";
import { Modal } from "antd";
import { CourseVideoModalProps } from "../../../../models/objects/course/CourseVideoModalProps";

const CourseVideoModal: React.FC<CourseVideoModalProps> = ({ isModalVisible, handleCancel, videoId }) => {
  return (
    <Modal title="Course Video" open={isModalVisible} onCancel={handleCancel} footer={null} width={600} height={300}>
      {videoId ? (
        <div className="aspect-video">
          <video width="100%" height="100%" controls style={{ border: "none" }}>
            <source src={videoId} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div>Video not available</div>
      )}
    </Modal>
  );
};

export default CourseVideoModal;
