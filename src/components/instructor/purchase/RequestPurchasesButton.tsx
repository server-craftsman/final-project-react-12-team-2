import React, { useState } from "react";
import { Modal, notification } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { CreatePayoutRequestModel } from "../../../models/api/request/payout/payout.request.model";

interface RequestPurchasesProps {
  onRequestComplete: () => void;
  disabled: boolean;
  selectedPurchases: Set<string>;
}

const RequestPurchases: React.FC<RequestPurchasesProps> = ({ onRequestComplete, disabled, selectedPurchases }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPurchases = async () => {
    setIsRequesting(true);
    try {
      const params: CreatePayoutRequestModel = {
        instructor_id: "instructor_id_here",
        transactions: Array.from(selectedPurchases).map(purchase_id => ({ purchase_id }))
      };

      await PayoutService.createPayout(params);
      onRequestComplete();
      notification.success({
        message: "Success",
        description: "Payout request completed successfully."
      });
    } catch (error) {
      console.error("Error requesting purchases:", error);
      notification.error({
        message: "Error",
        description: "Failed to complete payout request."
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to create a payout?",
      onOk: handleRequestPurchases
    });
  };

  return (
    <button
      className={`my-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 text-white ${isRequesting || disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={showConfirm}
      disabled={isRequesting || disabled}
    >
      {isRequesting ? "Requesting..." : "Create Payout"}
    </button>
  );
};

export default RequestPurchases;
