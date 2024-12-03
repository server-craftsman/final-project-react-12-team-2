import React from "react";
import { Modal } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { CreatePayoutRequestModel } from "../../../models/api/request/payout/payout.request.model";
import { notificationMessage } from "../../../utils/helper";
interface RequestPurchasesProps {
  onRequestComplete: () => void;
  disabled: boolean;
  selectedPurchases: Set<string>;
  instructorId: string;
}

const RequestPurchasesAdminButton: React.FC<RequestPurchasesProps> = ({ onRequestComplete, disabled, selectedPurchases, instructorId }) => {
  // const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPurchases = async () => {
    // setIsRequesting(true);
    try {
      const params: CreatePayoutRequestModel = {
        instructor_id: instructorId,
        transactions: Array.from(selectedPurchases).map(purchase_id => ({ purchase_id }))
      };

      await PayoutService.createPayout(params);
      onRequestComplete();
      notificationMessage("Payout request completed successfully.", "success");
        description: "Payout request completed successfully."
    } catch (error) {
      console.error("Error requesting purchases:", error);
      notificationMessage("Failed to complete payout request.", "error");
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

export default RequestPurchasesAdminButton;
