import React, { useState } from "react";
import { Modal, notification } from "antd";

interface RequestPurchasesProps {
  onRequestComplete: () => void;
  disabled: boolean; // Add this prop to control button state
}

const RequestPurchases: React.FC<RequestPurchasesProps> = ({
  onRequestComplete,
  disabled,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPurchases = async () => {
    setIsRequesting(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add your actual API call here
      onRequestComplete();
      notification.success({
        message: "Success",
        description: "Payout request completed successfully.",
      });
    } catch (error) {
      console.error("Error requesting purchases:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to create a payout?",
      onOk: handleRequestPurchases,
    });
  };

  return (
    <button
      className={`my-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 text-white ${isRequesting || disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={showConfirm}
      disabled={isRequesting || disabled} // Disable if requesting or if disabled prop is true
    >
      {isRequesting ? "Requesting..." : "Create Payout"}
    </button>
  );
};

export default RequestPurchases;
