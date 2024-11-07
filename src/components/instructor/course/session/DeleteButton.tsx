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
      title: "Delete Session",
      content: "Are you sure you want to delete this session? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: {
        danger: true,
        style: {
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
          boxShadow: "0 2px 0 rgba(255, 77, 79, 0.1)"
        }
      },
      cancelButtonProps: {
        style: {
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02)"
        }
      },
      icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
      maskClosable: true,
      centered: true,
      onOk: async () => {
        try {
          await SessionService.deleteSession(data._id);
          message.success({
            content: "Session deleted successfully",
            style: {
              marginTop: "20vh"
            }
          });
          if (onSessionDeleted) {
            onSessionDeleted();
          }
        } catch (error) {
          console.error("Error deleting session:", error);
          message.error({
            content: "Failed to delete session",
            style: {
              marginTop: "20vh"
            }
          });
        }
      }
    });
  };

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={handleClick}
      danger
      style={{
        marginLeft: 8,
        boxShadow: "0 2px 0 rgba(255, 77, 79, 0.1)",
        borderRadius: "4px"
      }}
    />
  );
};

export default DeleteButton;
