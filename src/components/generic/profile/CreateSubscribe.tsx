import React, { useState, Dispatch, SetStateAction } from "react";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

interface ButtonSubscribeProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  instructorId: string;
  isSubscribed: boolean;
  setIsSubscribed: Dispatch<SetStateAction<boolean>>;
}

const ButtonSubscribe: React.FC<ButtonSubscribeProps> = ({ instructorId, isSubscribed, setIsSubscribed }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token || !userInfo) {
      navigate("/login");
      message.error("Please log in to subscribe.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await SubscriptionService.createSubscribe({
        instructor_id: instructorId || ""
      });

      // Update subscription status based on API response
      if (response.data?.data) {
        setIsSubscribed(response.data.data.is_subscribed);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`rounded-md px-4 py-2 ${isSubscribed ? "un-btn" : "bg-btn"} text-white transition-colors`}
    >
      {isLoading ? "Loading..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
};

export default ButtonSubscribe;
