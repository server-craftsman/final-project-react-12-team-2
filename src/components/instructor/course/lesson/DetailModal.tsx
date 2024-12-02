import React from 'react'
import { LessonDetailsResponse } from '../../../../models/api/responsive/lesson/lesson.response.model';
import { Modal } from 'antd';
import { formatDate } from '../../../../utils/helper';
// import parse from 'html-react-parser';
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
      title={<span className="text-xl font-semibold text-gray-700">Lesson Details</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg overflow-hidden shadow-md transition-transform transform-gpu duration-300 ease-in-out"
    >
      {lessonDetail ? (
        <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 hover:border-blue-400">
              <div className="space-y-3">
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Name:</span>
                  <span className="text-gray-800">{lessonDetail.name}</span>
                </p>
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Lesson Type:</span>
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: lessonDetail.lesson_type }}></span>
                </p>
                {lessonDetail.lesson_type === LessonType.TEXT && (
                  <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                    <span className="text-blue-600 font-semibold mr-2">Description:</span>
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: lessonDetail.description }}></span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              {lessonDetail.lesson_type === LessonType.IMAGE && (
                <img 
                  src={lessonDetail.image_url} 
                  alt="Lesson" 
                  className="w-full h-40 object-cover rounded-lg mb-4 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
                />
              )}
              {lessonDetail.lesson_type === LessonType.VIDEO && (
                <video 
                  src={lessonDetail.video_url} 
                  controls 
                  className="w-full h-40 object-cover rounded-lg mb-2 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
                />
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase border-b-2 border-blue-500 pb-2">Additional Details</h3>
            <div className="space-y-3">
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Full Time:</span>
                <span className="text-gray-800">{lessonDetail.full_time} minutes</span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Position Order:</span>
                <span className="text-gray-800">{lessonDetail.position_order}</span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Created At:</span>
                <span className="text-gray-800">{formatDate(lessonDetail.created_at)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No lesson details available.
        </p>
      )}
    </Modal>
  );
};

export default ModalLessonDetail;

