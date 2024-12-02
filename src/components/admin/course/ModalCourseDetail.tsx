import React from 'react';
import { Modal, Button } from 'antd';
import { GetCourseByIdResponse } from '../../../models/api/responsive/course/course.response.model';
import { StatusType } from '../../../app/enums';
import { CourseStatusBadge } from '../../../utils/courseStatus';
import { helpers } from '../../../utils';
// import parse from 'html-react-parser';

interface ModalCourseDetailProps {
  visible: boolean;
  onClose: () => void;
  courseDetail: GetCourseByIdResponse | null;
}

const ModalCourseDetail: React.FC<ModalCourseDetailProps> = ({ visible, onClose, courseDetail }) => {
  return (
    <Modal
      width={1000}
      title="Course Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      {courseDetail ? (
        <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 hover:border-blue-400">
            <div className="space-y-3">
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Name:</span>
                <span className="text-gray-800 uppercase">{courseDetail.name}</span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Status:</span>
                {CourseStatusBadge({ status: courseDetail.status as StatusType })}
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Price:</span>
                <span className="text-gray-800">{helpers.moneyFormat(courseDetail.price)}</span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Discount:</span>
                <span className="text-gray-800">{courseDetail.discount} %</span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img 
              src={courseDetail.image_url} 
              alt="Course" 
              className="w-full h-40 object-cover rounded-lg mb-4 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
            />
            <video 
              controls 
              className="w-full h-40 object-cover rounded-lg mb-2 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
            >
              <source src={courseDetail.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase border-b-2 border-blue-500 pb-2">Additional Details</h3>
          <div className="space-y-3">
            <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 font-semibold mr-2">Description:</span>
              <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: courseDetail.description }}></span>
            </p>
            <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 font-semibold mr-2">Content:</span>
              <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: courseDetail.content }}></span>
            </p>
            <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 font-semibold mr-2">Created At:</span>
              <span className="text-gray-800">{helpers.formatDate(courseDetail.created_at)}</span>
            </p>
            <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 font-semibold mr-2">Updated At:</span>
              <span className="text-gray-800">{helpers.formatDate(courseDetail.updated_at)}</span>
            </p>
          </div>
        </div>
      </div>
      ) : (
        <p>No course details available.</p>
      )}
    </Modal>
  );
};

export default ModalCourseDetail;
