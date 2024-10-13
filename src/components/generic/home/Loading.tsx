import React, { useState, useEffect } from "react";

const Loading: React.FC<{ timeout?: number }> = ({ timeout = 10000 }) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="text-center">
        <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
        <h2 className="font-serif text-3xl text-white">Loading...</h2>
        <p className="mt-2 text-lg text-gray-300">
          Please wait while we prepare your luxurious experience
        </p>
        {showTimeout && (
          <p className="mt-4 text-lg text-yellow-300">
            It's taking longer than expected. Please check your internet
            connection.
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
