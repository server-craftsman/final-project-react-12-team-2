import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BlogService } from "../../../services/blog/blog.service";
import { Blog } from "../../../models/api/responsive/admin/blog.responsive.model";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import Editor from "../../generic/tiny/Editor";
import { BaseService } from "../../../services/config/base.service";
import { notificationMessage } from "../../../utils/helper";
const { Option } = Select;

interface EditBlogModalProps {
  visible: boolean;
  blog: Blog | null;
  categories: (Category & { children?: Category[] })[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ visible, blog, categories, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [image_url, setImageUrl] = useState(blog?.image_url || "");
  const [content, setContent] = useState(blog?.content || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(blog);
    setImageUrl(blog?.image_url || "");
    setContent(blog?.content || "");
  }, [blog, form]);

  const handleImageUpload = async (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      notificationMessage("File size should not exceed 5MB", "error");
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      notificationMessage("Please upload an image file (JPEG, PNG, or GIF)", "error");
      return false;
    }

    setUploading(true);
    try {
      const uploadedUrl = await BaseService.uploadFile(file, "image", true);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        notificationMessage("Image uploaded successfully", "success");
      } else {
        notificationMessage("Failed to upload image", "error");
      }
    } catch (error) {
      notificationMessage("Image upload failed", "error");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }

    return false;
  };

  const submitUpdateBlog = async () => {
    setUploading(true);
    try {
      const updatedBlog = await form.validateFields();
      const response = await BlogService.updateBlog(blog?._id || "", {
        ...updatedBlog,
        content,
        image_url,
        user_id: blog?.user_id
      });
      if (response.data.success) {
        notificationMessage("Blog updated successfully.", "success");
        onClose();
        onSuccess();
      }
    } catch (error) {
      notificationMessage("Failed to update blog", "error");
      console.error("Error updating blog:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    onSuccess();
  };

  return (
    <Modal
      title="Update Blog"
      open={visible}
      onOk={submitUpdateBlog}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button className="bg-gradient-tone px-4 py-2 text-white" key="submit" type="primary" onClick={submitUpdateBlog} loading={uploading}>
          Update
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Blog Name" rules={[{ required: true, message: "Please input the blog name!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="category_id" label="Category" rules={[{ required: true, message: "Please select a category!" }]}>
          <Select placeholder="Select a category">
          {categories.map((parent) => (
                    <>
                      <Option key={parent._id} value={parent._id}>
                        {parent.name}
                      </Option>
                      {parent.children?.map((child) => (
                        <Option key={child._id} value={child._id}>
                          {child.name}
                        </Option>
                      ))}
                    </>
                  ))}
          </Select>
        </Form.Item>

        <Form.Item label="Image URL">
          <Upload accept="image/*" showUploadList={false} beforeUpload={handleImageUpload}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {image_url && <img src={image_url} alt="Uploaded" style={{ width: "100%", marginTop: 10 }} />}
        </Form.Item>

        <Form.Item label="Content" required>
          <Editor initialValue={content} onEditorChange={(newContent) => setContent(newContent)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBlogModal;
