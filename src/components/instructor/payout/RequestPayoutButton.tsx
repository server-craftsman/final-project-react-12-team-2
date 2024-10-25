import React from "react";
import { Button, Modal, message } from "antd";

interface RequestPayoutButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const RequestPayoutButton: React.FC<RequestPayoutButtonProps> = ({
  onClick,
  disabled,
}) => {
  const handleButtonClick = () => {
    Modal.confirm({
      title: "Confirm Request Payout",
      content: "Are you sure you want to request a payout?",
      onOk: () => {
        onClick();
        message.success("Payout request successful");
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Button
        onClick={handleButtonClick}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "#d9d9d9" : "#1a237e",
          color: disabled ? "rgba(0, 0, 0, 0.25)" : "#fff",
          transition: "background-color 0.3s ease",
        }}
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
      </Button>
    </div>
  );
};

export default RequestPayoutButton;
