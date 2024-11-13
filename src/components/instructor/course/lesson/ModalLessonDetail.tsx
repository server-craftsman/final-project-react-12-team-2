import React from 'react'
import { LessonDetailsResponse } from '../../../../models/api/responsive/lesson/lesson.response.model';
import { Modal, Button } from 'antd';
import { formatDate } from '../../../../utils/helper';
import parse from 'html-react-parser';
import { LessonType } from "../../../../app/enums";

interface ModalLessonDetailProps {
  visible: boolean;
  onClose: () => void;
  lessonDetail: LessonDetailsResponse | null;
}
const ModalLessonDetail: React.FC<ModalLessonDetailProps> = ({ visible, onClose, lessonDetail }) => {
  return (
    <Modal
      width={1000}
      title="Lesson Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
     {
        lessonDetail ? (
            <div>
                <p><strong>Name:</strong> {lessonDetail.name}</p>
                <p><strong>Lesson Type:</strong> {parse(lessonDetail.lesson_type)}</p>
                {lessonDetail.lesson_type === LessonType.TEXT && (
                    <p><strong>Content:</strong> {parse(lessonDetail.description)}</p>
                )}
                {lessonDetail.lesson_type === LessonType.IMAGE && (
                  <img src={lessonDetail.image_url} alt="Lesson" style={{ maxWidth: '100%', height: 'auto' }} />
                )}
                {lessonDetail.lesson_type === LessonType.VIDEO && (
                  <video src={lessonDetail.video_url} controls style={{ maxWidth: '100%', height: 'auto' }} />
                )}
                <p><strong>Full Time:</strong> {lessonDetail.full_time} minutes</p>
                <p><strong>Position Order:</strong> {lessonDetail.position_order}</p>
                <p><strong>Created At:</strong> {formatDate(lessonDetail.created_at)}</p>
            </div>
        ) : (
            <p>No lesson details available.</p>
        )}
    </Modal>
  );
};

export default ModalLessonDetail;

