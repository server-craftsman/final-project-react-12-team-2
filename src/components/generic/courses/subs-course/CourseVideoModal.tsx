import React from "react";
import { Modal } from "antd";
import { CourseVideoModalProps } from "../../../../models/objects/course/CourseVideoModalProps";

const CourseVideoModal: React.FC<CourseVideoModalProps> = ({
  isModalVisible,
  handleCancel,
  videoId,
}) => {
  return (
    <Modal
      title="Course Video"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      {videoId ? (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Course Video"
            style={{ border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div>Video not available</div>
      )}
    </Modal>
  );
};

export default CourseVideoModal;
