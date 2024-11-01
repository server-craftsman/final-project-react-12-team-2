import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CourseService } from "../../../../services/course/course.service";

interface DeleteButtonProps {
  courseId: string;
  onDeleteSuccess?: () => void;
}

const DeleteButton = ({ courseId, onDeleteSuccess }: DeleteButtonProps) => {
  const handleClick = () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this course? This action cannot be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await CourseService.deleteCourse(courseId);
          message.success("Course deleted successfully");
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        } catch (error) {
          message.error("Failed to delete course");
        }
      }
    });
  };

  return <Button icon={<DeleteOutlined />} onClick={handleClick} danger />;
};

export default DeleteButton;
