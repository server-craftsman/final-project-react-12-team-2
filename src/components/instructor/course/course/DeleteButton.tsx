import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CourseService } from "../../../../services/course/course.service";
import { helpers } from "../../../../utils";
interface DeleteButtonProps {
  courseId: string;
  onDeleteSuccess?: () => void;
}

const DeleteButton = ({ courseId, onDeleteSuccess }: DeleteButtonProps) => {
  const handleClick = () => {
    Modal.confirm({
      title: "Delete Course",
      content: "Are you sure you want to delete this course? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: {
        className: "bg-gradient-tone",
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
          await CourseService.deleteCourse(courseId);
          helpers.notificationMessage("Course deleted successfully", "success");
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        } catch (error) {
          helpers.notificationMessage("Failed to delete course", "error");
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
