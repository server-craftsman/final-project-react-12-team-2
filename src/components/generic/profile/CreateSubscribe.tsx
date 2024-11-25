import React from "react";

interface ButtonSubscribeProps {
  isLoading: boolean;
  isSubscribed: boolean;
  handleSubscribe: () => Promise<void>;
}

const ButtonSubscribe: React.FC<ButtonSubscribeProps> = ({ isLoading, isSubscribed, handleSubscribe }) => {
  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`rounded-md px-4 py-2 ${isSubscribed ? "un-btn" : "bg-btn"} text-white transition-colors`}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
};

export default ButtonSubscribe;
