import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { helpers } from "../../../../utils";
interface DeleteButtonProps {
  lessonId: string;
  onDeleteSuccess: () => void;
}

const DeleteButton = ({ lessonId, onDeleteSuccess }: DeleteButtonProps) => {
  const handleClick = () => {
    Modal.confirm({
      title: "Delete Lesson",
      content: "Are you sure you want to delete this lesson? This action cannot be undone.",
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
          await LessonService.deleteLesson(lessonId);
          helpers.notificationMessage("Lesson deleted successfully", "success");

          onDeleteSuccess();
        } catch (error) {
          helpers.notificationMessage("Failed to delete lesson", "error");
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
