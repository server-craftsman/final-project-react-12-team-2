import React from "react";
import { Modal, message } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { PayoutStatus } from "../../../app/enums";
interface RequestPayoutButtonProps {
  disabled: boolean;
  payoutId: string; // Add payoutId prop
  onRequestComplete: () => void;
}

const RequestPayoutButton: React.FC<RequestPayoutButtonProps> = ({ disabled, payoutId, onRequestComplete }) => {
  
  const handleRequestPayout = async () => {
    try {
      const response = await PayoutService.updatePayout(payoutId, {
        status: PayoutStatus.REQUEST_PAYOUT,
        comment: ""
      });
      console.log("Request Payout Successful", response);
      onRequestComplete();
    } catch (error) {
      console.error("Request Payout Failed", error);
    }
  };

  
  const handleButtonClick = () => {
    Modal.confirm({
      title: "Confirm Request Payout",
      content: "Are you sure you want to request a payout?",
      onOk: () => {
        handleRequestPayout();
        message.success("Payout request successful");
      },
      onCancel() {}
    });
  };

  return (
    <div>
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className={`my-2 rounded-md px-4 py-2.5 text-white ${disabled ? 'bg-gray-400 text-gray-300' : 'bg-indigo-800 text-white hover:bg-indigo-900'}`}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = "#0d1b5e";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = "#1a237e";
          }
        }}
      >
        Request Payout
      </button>
    </div>
  );
};

export default RequestPayoutButton;
