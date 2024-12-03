import React from "react";
import { Modal } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { CreatePayoutRequestModel } from "../../../models/api/request/payout/payout.request.model";
import { helpers } from "../../../utils";

interface RequestPurchasesProps {
  onRequestComplete: () => void;
  disabled: boolean;
  selectedPurchases: Set<string>;
}

const RequestPurchases: React.FC<RequestPurchasesProps> = ({ onRequestComplete, disabled, selectedPurchases }) => {
  // const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPurchases = async () => {
    // setIsRequesting(true);
    try {
      const params: CreatePayoutRequestModel = {
        instructor_id: "",
        transactions: Array.from(selectedPurchases).map(purchase_id => ({ purchase_id }))
      };

      await PayoutService.createPayout(params);
      onRequestComplete();
      helpers.notificationMessage("Payout request completed successfully", "success");
    } catch (error) {
      console.error("Error requesting purchases:", error);
      helpers.notificationMessage("Failed to complete payout request.", "error");
    } 
    // finally {
    //   setIsRequesting(false);
    // }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to create a payout?",
      onOk: handleRequestPurchases
    });
  };

  return (
    <button
      onClick={showConfirm}
      className={`my-2 rounded-md px-4 py-2.5 text-white ${disabled ? 'bg-gray-400' : 'bg-gradient-tone'}`}
      disabled={disabled}
    >
      Create Payout
    </button>
  );
};

export default RequestPurchases;
