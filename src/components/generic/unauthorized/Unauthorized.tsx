import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-12 text-center">
      <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
      <p className="mb-4 text-lg">
        You do not have the necessary permissions to view this page.
      </p>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
