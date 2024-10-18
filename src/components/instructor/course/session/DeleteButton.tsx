import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const DeleteButton = () => {
  const handleClick = () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this session?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        message.info("Deleted session");
      },
    });
  };
  return <Button icon={<DeleteOutlined />} onClick={handleClick} danger />;
};

export default DeleteButton;
