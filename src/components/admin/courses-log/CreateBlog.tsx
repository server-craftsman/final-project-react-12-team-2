import { useCallback, useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { BlogService } from "../../../services/blog/blog.service";
import { customUploadHandler } from "../../../utils/upload";
import { CategoryService } from "../../../services/category/category.service";

const CreateBlog = () => {
  const [form] = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  // Modal handlers
  const handleModalToggle = useCallback(() => {
    setIsModalVisible((prev) => !prev);
    form.resetFields();
    setImageFile(null);
    setImagePreview(undefined);
  }, [form]);

  const fetchCategories = useCallback(async () => {
    const response = await CategoryService.getCategory({
      searchCondition: {
        keyword: "",
        is_parent: false,
        is_delete: false
      },
      pageInfo: { pageNum: 1, pageSize: 100 }
    });
    console.log("🚀 ~ fetchCategories ~ response:", response);

    const categoryData = response?.data?.data?.pageData.map((e) => {
      return { value: e._id, label: e.name };
    });
    setCategories(categoryData);
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      fetchCategories();
    }
  }, [isModalVisible, fetchCategories]);

  // Handle file change
  const handleFileChange = useCallback((file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  // Upload image
  const uploadImage = useCallback(async () => {
    if (!imageFile) return "";
    let imageUrl = "";
    await customUploadHandler(
      {
        file: imageFile,
        onSuccess: (url) => {
          imageUrl = url;
        },
        onError: () => {
          message.error("Failed to upload image");
        }
      },
      "image",
      setUploading,
      (type, url) => {
        console.log(`${type} uploaded to ${url}`);
      }
    );
    return imageUrl;
  }, [imageFile]);

  // Form submission
  const onFinish = useCallback(
    async (values: any) => {
      try {
        setUploading(true);
        const imageUrl = await uploadImage();

        await BlogService.createBlog({
          ...values,
          image_url: imageUrl
        });

        message.success("Blog post created successfully!");
        handleModalToggle();
      } catch (error: any) {
        message.error(error.message || "Failed to create blog post");
      } finally {
        setUploading(false);
      }
    },
    [handleModalToggle, uploadImage]
  );

  // Render upload component
  const renderUpload = useCallback(
    () => (
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={(file) => {
          handleFileChange(file);
          return false;
        }}
        accept="image/*"
        maxCount={1}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="image" className="h-full w-full rounded-lg object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <UploadOutlined className="text-2xl" />
            <div className="mt-2">Upload Image</div>
          </div>
        )}
      </Upload>
    ),
    [handleFileChange, imagePreview]
  );

  return (
    <div>
      <Button type="primary" onClick={handleModalToggle}>
        Create Blog Post
      </Button>

      <Modal title="Create Blog Post" visible={isModalVisible} onCancel={handleModalToggle} footer={null}>
        <Form form={form} name="create_blog" onFinish={onFinish} layout="vertical" initialValues={{ category_id: categories[0]?.value }}>
          <Form.Item name="name" label="Post Name" rules={[{ required: true, message: "Please input the post name!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please input the content!" }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="category_id" label="Category" rules={[{ required: true, message: "Please select a category!" }]}>
            <Select options={categories} />
          </Form.Item>

          <Form.Item label="Image">{renderUpload()}</Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Create Post
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBlog;