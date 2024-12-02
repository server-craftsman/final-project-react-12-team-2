import React from 'react'
import { SessionDetailResponse } from '../../../models/api/responsive/session/session.response.model';
import { Modal } from 'antd';
// import parse from 'html-react-parser';
import { formatDate } from '../../../utils/helper';

interface ModalSessionModalProps {
    visible: boolean;
    onClose: () => void;
    sessionDetail: SessionDetailResponse | null;
}

const ModalSessionModal: React.FC<ModalSessionModalProps> = ({ visible, onClose, sessionDetail }) => {
  return (
    <Modal
    width={800}
    title={<span className="text-xl font-semibold text-gray-700">Session Details</span>}
    open={visible}
    onCancel={onClose}
    footer={null}
    className="rounded-lg overflow-hidden shadow-md transition-transform transform-gpu duration-300 ease-in-out"
  >
    {sessionDetail ? (
      <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
          <div className="bg-white p-4 rounded-lg transition-shadow duration-300 hover:border-blue-400">
              <div className="space-y-3">
                  <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                      <span className="text-blue-600 font-semibold mr-2">Name:</span>
                      <span className="text-gray-800 uppercase">{sessionDetail.name}</span>
                  </p>
              </div>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase border-b-2 border-blue-500 pb-2">Additional Details</h3>
          <div className="space-y-3">
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Description:</span>
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sessionDetail.description }}></span>
              </p>
              <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-600 font-semibold mr-2">Created At:</span>
                  <span className="text-gray-800">{formatDate(sessionDetail.created_at)}</span>
              </p>
          </div>
      </div>
  </div>
) : (
  <p className="text-center text-gray-500">Loading...</p>
)}
  </Modal>
  )
}

export default ModalSessionModal;
