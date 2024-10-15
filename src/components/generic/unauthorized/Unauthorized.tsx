import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg mb-4">You do not have the necessary permissions to view this page.</p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
