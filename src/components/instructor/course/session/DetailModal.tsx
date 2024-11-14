import React, { useEffect, useState } from 'react'
import { Modal } from 'antd';
import { formatDate } from '../../../../utils/helper';  
import {SessionService} from '../../../../services/session/session.service';
import parse from 'html-react-parser';

interface DetailModalProps {
    sessionId: string | null;
    isVisible: boolean;
    onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ sessionId, isVisible, onClose }) => {

  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchSessionDetails = async () => {
        try {
          const response = await SessionService.getSessionDetail(sessionId);
          setSessionDetails(response.data.data);
        } catch (error) {
          console.error("Failed to fetch session details:", error);
        }
      };
      fetchSessionDetails();
    }
  }, [sessionId]);

  return (
    <Modal
        title={<span className="text-xl font-semibold text-gray-700">Session Details</span>}
        open={isVisible}
        onCancel={onClose}
        footer={null}
        width={800}
        className="rounded-lg overflow-hidden shadow-md transition-transform transform-gpu duration-300 ease-in-out"
    >
        {sessionDetails ? (
            <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
                    <div className="bg-white p-4 rounded-lg transition-shadow duration-300 hover:border-blue-400">
                        <div className="space-y-3">
                            <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                                <span className="text-blue-600 font-semibold mr-2">Name:</span>
                                <span className="text-gray-800 uppercase">{sessionDetails.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase border-b-2 border-blue-500 pb-2">Additional Details</h3>
                    <div className="space-y-3">
                        <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                            <span className="text-blue-600 font-semibold mr-2">Description:</span>
                            <span className="text-gray-800">{parse(sessionDetails.description)}</span>
                        </p>
                        <p className="text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                            <span className="text-blue-600 font-semibold mr-2">Created At:</span>
                            <span className="text-gray-800">{formatDate(sessionDetails.created_at)}</span>
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

export default DetailModal
