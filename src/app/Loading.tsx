import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useToggleLoading } from "./toggleLoading";
import logo from "../assets/logo.jpg";

const Loading: React.FC<{ timeout?: number }> = ({ timeout = 10000 }) => {
  const showTimeout = useSelector((state: RootState) => state.loading);
  const toggleLoading = useToggleLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      toggleLoading(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
      toggleLoading(false);
    };
  }, [timeout, toggleLoading]);

  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-60 backdrop-blur-lg"></div>

      {/* Loading content */}
      <div className="relative text-center z-10">
        <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-white">
          <img src={logo} alt="Loading logo" className="h-full w-full object-cover rounded-full" />
        </div>
        <h2 className="font-serif text-3xl text-white">Loading...</h2>
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
