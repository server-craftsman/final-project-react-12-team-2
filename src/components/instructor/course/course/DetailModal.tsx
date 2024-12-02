import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { CourseService } from '../../../../services/course/course.service';
import { helpers } from '../../../../utils';
// import parse from 'html-react-parser';
import { CourseStatusBadge } from '../../../../utils/courseStatus';
import { StatusType } from '../../../../app/enums';

interface DetailModalProps {
  courseId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ courseId, isVisible, onClose }) => {
  const [courseDetails, setCourseDetails] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      const fetchCourseDetails = async () => {
        try {
          const response = await CourseService.getCourseById(courseId);
          setCourseDetails(response.data.data);
        } catch (error) {
          console.error("Failed to fetch course details:", error);
        }
      };
      fetchCourseDetails();
    }
  }, [courseId]);

  return (
    <Modal
      title={<span className="text-xl font-semibold text-gray-700">Course Details</span>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="rounded-lg overflow-hidden shadow-md transition-transform transform-gpu duration-300 ease-in-out"
    >
      {courseDetails ? (
        <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 hover:border-blue-400">
              <div className="space-y-3">
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Name:</span>
                  <span className="text-gray-800 uppercase">{courseDetails.name}</span>
                </p>
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Status:</span>
                  {CourseStatusBadge({ status: courseDetails.status as StatusType })}
                </p>
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Price:</span>
                  <span className="text-gray-800">{helpers.moneyFormat(courseDetails.price)}</span>
                </p>
                <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Discount:</span>
                  <span className="text-gray-800">{courseDetails.discount} %</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={courseDetails.image_url} 
                alt="Course" 
                className="w-full h-40 object-cover rounded-lg mb-4 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
              />
              <video 
                controls 
                className="w-full h-40 object-cover rounded-lg mb-2 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 transform hover:scale-[1.02]"
              >
                <source src={courseDetails.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase border-b-2 border-blue-500 pb-2">Additional Details</h3>
            <div className="space-y-3">
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Description:</span>
                <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: courseDetails.description }}></span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Content:</span>
                <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: courseDetails.content }}></span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Created At:</span>
                <span className="text-gray-800">{helpers.formatDate(courseDetails.created_at)}</span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-semibold mr-2">Updated At:</span>
                <span className="text-gray-800">{helpers.formatDate(courseDetails.updated_at)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </Modal>
  );
};

export default DetailModal;
