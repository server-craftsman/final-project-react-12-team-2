import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { SessionService } from "../../../../services/session/session.service";

interface DeleteButtonProps {
  data: {
    _id: string;
  };
  onSessionDeleted?: () => void;
}

const DeleteButton = ({ data, onSessionDeleted }: DeleteButtonProps) => {

  const handleClick = () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this session?",
      okText: "Delete", 
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await SessionService.deleteSession(data._id);
          message.success("Session deleted successfully");
          if (onSessionDeleted) {
            onSessionDeleted();
          }
        } catch (error) {
          console.error("Error deleting session:", error);
          message.error("Failed to delete session");
        }
      }
    });
  };

  return <Button icon={<DeleteOutlined />} onClick={handleClick} danger />;
};

export default DeleteButton;
