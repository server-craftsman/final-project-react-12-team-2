import React, { useState, useEffect } from 'react';

const Loading: React.FC<{ timeout?: number }> = ({ timeout = 10000 }) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-3xl font-serif text-white">Loading...</h2>
        <p className="text-lg text-gray-300 mt-2">Please wait while we prepare your luxurious experience</p>
        {showTimeout && (
          <p className="text-lg text-yellow-300 mt-4">
            It's taking longer than expected. Please check your internet connection.
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;