import React, { useState, Dispatch, SetStateAction } from 'react';
import { SubscriptionService } from '../../../services/subscription/subscription.service';

interface ButtonSubscribeProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  instructorId: string;
  isSubscribed: boolean;
  setIsSubscribed: Dispatch<SetStateAction<boolean>>;
}

const ButtonSubscribe: React.FC<ButtonSubscribeProps> = ({ instructorId, isSubscribed, setIsSubscribed }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscribe = async () => {
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
      console.error('Error updating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md ${isSubscribed
        ? 'bg-red-500 hover:bg-red-600'
        : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
    >
      {isLoading
        ? 'Loading...'
        : isSubscribed
          ? 'Unsubscribe'
          : 'Subscribe'
      }
    </button>
  );
};

export default ButtonSubscribe;
