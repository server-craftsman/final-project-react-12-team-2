import React from "react";

interface ButtonSubscribeProps {
  isLoading: boolean;
  isModalOpen?: boolean;
  setIsModalOpen?: (value: boolean) => void;
  isSubscribed: boolean;
  instructorId?: string;
  setIsSubscribed?: (value: boolean) => void;
  handleSubscribe?: () => Promise<void>;
}

const ButtonSubscribe: React.FC<ButtonSubscribeProps> = ({
  isLoading,
  isSubscribed,
  handleSubscribe,
  isModalOpen,
  setIsModalOpen,
  instructorId,
  setIsSubscribed
}) => {
  
  const handleButtonClick = async () => {
    if (handleSubscribe) {
      await handleSubscribe();
      if (setIsSubscribed) {
        setIsSubscribed(!isSubscribed);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className={`rounded-md px-4 py-2 ${isSubscribed ? "un-btn" : "bg-btn"} text-white transition-colors`}
      >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {isModalOpen && setIsModalOpen && (
        <div className="modal">
          <p>Are you sure you want to {isSubscribed ? "unsubscribe" : "subscribe"} to {instructorId}?</p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default ButtonSubscribe;
