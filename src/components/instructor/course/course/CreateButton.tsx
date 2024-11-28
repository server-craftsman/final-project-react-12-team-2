import { useState, useCallback } from "react";
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;
import { CourseService } from "../../../../services/course/course.service";
import { CategoryService } from "../../../../services/category/category.service";
import { CreateCourseParams } from "../../../../models/api/request/course/course.request.model";
// import { upload } from "../../../../utils";
import { BaseService } from "../../../../services/config/base.service";
import { GetCategoryParams } from "../../../../models/api/request/admin/category.request.model";
import Editor from "../../../generic/tiny/Editor";

const CreateCourseButton = ({ onCourseCreated }: { onCourseCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [categories, setCategories] = useState<{ _id: string; name: string; children?: { _id: string; name: string }[] }[]>([]);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);

  const getParentCategoryParams: GetCategoryParams = {
    searchCondition: {
      keyword: "",
      is_delete: false,
      is_parent: true
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100
    }
  };

  const getChildCategoryParams: GetCategoryParams = {
    searchCondition: {
      keyword: "",
      is_delete: false,
      is_parent: false
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100
    }
  };

  const fetchCategories = async () => {
    try {
      const parentCategoriesData = await CategoryService.getCategory(getParentCategoryParams);
      const parentCategories = parentCategoriesData.data.data.pageData;

      const childCategoriesData = await CategoryService.getCategory(getChildCategoryParams);
      const childCategories = childCategoriesData.data.data.pageData;

      const categoriesWithChildren = parentCategories.map((parent) => ({
        ...parent,
        children: childCategories.filter((child) => child.parent_category_id === parent._id)
      }));

      setCategories(categoriesWithChildren);
    } catch (error) {
      message.error("Failed to load categories.");
    }
  };

  const openCreateModal = () => {
    setIsOpen(true);
    fetchCategories();
  };

  const handleFileUpload = useCallback(async (file: File, type: "image" | "video") => {
    try {
      const url = await BaseService.uploadFile(file, type);
      if (!url) throw new Error(`Failed to upload ${type}`);
      return url;
    } catch (error: any) {
      throw new Error(`${type} upload failed: ${error.message}`);
    }
  }, []);

  const handleAvatarPreview = useCallback(
    async (file: File) => {
      try {
        const url = await handleFileUpload(file, "image");
        form.setFieldsValue({ image_url: url });
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        message.error(error.message);
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      try {
        const url = await handleFileUpload(file, "video");
        form.setFieldsValue({ video_url: url });
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(file);
        setVideoPreview(videoElement.outerHTML);
      } catch (error: any) {
        message.error(error.message);
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  // const handleFileDelete = useCallback(async (url: string, type: "image" | "video") => {
  //   try {
  //     const response = await BaseService.deleteFile(url, type);
  //     if (!response) throw new Error(`Failed to delete ${type}`);
  //     message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
  //   } catch (error: any) {
  //     message.error(`${type} deletion failed: ${error.message}`);
  //   }
  // }, []);

  // const handleAvatarDelete = () => {
  //   const imageUrl = form.getFieldValue("image_url");
  //   if (imageUrl) {
  //     handleFileDelete(imageUrl, "image");
  //     setAvatarPreview("");
  //     form.setFieldsValue({ image_url: "" });
  //   }
  // };

  // const handleVideoDelete = () => {
  //   const videoUrl = form.getFieldValue("video_url");
  //   if (videoUrl) {
  //     handleFileDelete(videoUrl, "video");
  //     setVideoPreview("");
  //     form.setFieldsValue({ video_url: "" });
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const params: CreateCourseParams = {
        name: values.name,
        description: description || values.description || "",
        content: values.content,
        category_id: values.category_id,
        video_url: values.video_url || "",
        image_url: values.image_url || "",
        price: values.price || 0,
        discount: values.discount || 0
      };

      // Call create course API first
      const courseResponse = await CourseService.createCourse(params);

      if (courseResponse) {
        setTimeout(() => {
          message.success("Course created successfully!");
        }, 2000);

        // Reset form and state after successful creation
        setIsOpen(false);
        form.resetFields();
        setDescription("");
        setContent("");
        setVideoPreview("");
        setAvatarPreview("");
        setVideoFileList([]);
        setAvatarFileList([]);

        // Refresh courses
        if (onCourseCreated) {
          onCourseCreated();
        }
      }
    } catch (error) {
      console.error("Error creating course:", error);
      message.error("Failed to create course. Please try again.");
    }
  };

  const clearModalData = () => {
    form.resetFields();
    setDescription("");
    setContent("");
    setVideoPreview("");
    setAvatarPreview("");
    setVideoFileList([]);
    setAvatarFileList([]);
    setCategories([]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    clearModalData();
  };

  const editChange = (value: string) => {
    form.setFieldsValue({ content: value });
  };

  return (
    <>
      <Button onClick={() => openCreateModal()} className="rounded-md bg-[#1a237e] text-white">
        Create Course
      </Button>
      <Modal title="Create Course" open={isOpen} onOk={handleSubmit} onCancel={handleCancel} width={800} style={{ top: "20px" }} okButtonProps={{ className: "bg-gradient-tone" }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Course Name" initialValue="" rules={[{ required: true, message: "Please input the course name!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category_id" initialValue="" label="Category" rules={[{ required: true, message: "Please select a category!" }]}>
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
            </Col>
          </Row>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Editor initialValue={content} onEditorChange={editChange} />
          </Form.Item>
          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Form.Item name="image_url" label="Profile Picture" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                <div className="space-y-4">
                  <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarPreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600">
                      Select Avatar
                    </Button>
                  </Upload>
                  <div className="h-[265px] w-[300px] overflow-hidden rounded-lg">
                    {avatarPreview && (
                      <>
                        <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                      </>
                    )}
                  </div>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="video_url" label="Introduction Video" rules={[{ required: true, message: "Please upload an introduction video!" }]}>
                <div className="space-y-4">
                  <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600">
                      Select Video
                    </Button>
                  </Upload>
                  <div className="h-[350px] w-[350px] overflow-hidden rounded-lg">
                    {videoPreview && (
                      <>
                        <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: videoPreview }} />
                      </>
                    )}
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>    
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price!" }]}>
                <InputNumber min={0} style={{ width: "100%" }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discount" label="Discount" rules={[{ required: true, message: "Please input the discount!" }]}>
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCourseButton;
