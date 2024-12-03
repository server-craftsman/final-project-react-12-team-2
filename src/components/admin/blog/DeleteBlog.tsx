// DeleteBlogModal.tsx
import React from "react";
import { Modal } from "antd";
import { BlogService } from "../../../services/blog/blog.service";
import { notificationMessage } from "../../../utils/helper";
interface DeleteBlogModalProps {
  visible: boolean;
  blogId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteBlogModal: React.FC<DeleteBlogModalProps> = ({ visible, blogId, onClose, onSuccess }) => {
  const handleDelete = async () => {
    try {
      if (blogId) {
        const response = await BlogService.deleteBlog(blogId);
        if (response.data.success) {
          notificationMessage("Blog deleted successfully.", "success");
          onClose();
          onSuccess();
        }
      }
    } catch (error) {
      notificationMessage("An error occurred while deleting the blog", "error");
      console.error("Failed to delete blog:", error);
    }
  };

  return (
    <Modal title="Delete Blog" visible={visible} onOk={handleDelete} onCancel={onClose} okText="Delete" cancelText="Cancel" okButtonProps={{ className: "bg-gradient-tone px-4 py-2 text-white" }}>
      Are you sure you want to delete this blog?
    </Modal>
  );
};

export default DeleteBlogModal;
