import { useState, useCallback } from "react";
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;
import { CourseService } from "../../../../services/course/course.service";
import { CategoryService } from "../../../../services/category/category.service";
import { CreateCourseParams } from "../../../../models/api/request/course/course.request.model";
import { upload } from "../../../../utils";
import { GetCategoryParams } from "../../../../models/api/request/admin/category.request.model";
import Editor from "../../../generic/tiny/Editor";

const CreateCourseButton = ({ onCourseCreated }: { onCourseCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [categories, setCategories] = useState<{ _id: string; name: string; children?: { _id: string; name: string }[] }[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
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
      const url = await upload.handleUploadFile(file, type);
      if (!url) throw new Error(`Failed to upload ${type}`);
      return url;
    } catch (error: any) {
      throw new Error(`${type} upload failed: ${error.message}`);
    }
  }, []);

  const handleAvatarPreview = useCallback(
    async (file: File) => {
      setUploadingAvatar(true);
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
      } finally {
        setUploadingAvatar(false);
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      setUploadingVideo(true);
      try {
        const url = await handleFileUpload(file, "video");
        form.setFieldsValue({ video_url: url });
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(file);
        setVideoPreview(videoElement.outerHTML);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setUploadingVideo(false);
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

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
        message.success("Course created successfully!");

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

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setDescription("");
    setContent("");
    // setIsFree(true);
  };

  const editChange = (value: string) => {
    form.setFieldsValue({ content: value });
    // parseTinyEditor.updateTinyMCEContent("content-editor", value);
    // editor.selection.select(editor.getBody(), true);
    // editor.selection.collapse(false);
  };

  return (
    <>
      <Button onClick={() => openCreateModal()} className="rounded-md bg-[#1a237e] text-white">
        Create Course
      </Button>
      <Modal title="Create Course" open={isOpen} onOk={handleSubmit} onCancel={handleCancel} width={800} style={{ top: "20px" }}>
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
                    <Select.OptGroup key={parent._id} label={parent.name}>
                      {parent.children?.map((child) => (
                        <Option key={child._id} value={child._id}>
                          {child.name}
                        </Option>
                      ))}
                    </Select.OptGroup>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="image_url" label="Profile Picture" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                <div className="space-y-4">
                  <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarPreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingAvatar}>
                      Select Avatar
                    </Button>
                  </Upload>
                  {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="h-32 w-32 rounded-lg object-cover" />}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="video_url" label="Introduction Video" rules={[{ required: true, message: "Please upload an introduction video!" }]}>
                <div className="space-y-4">
                  <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingVideo}>
                      Select Video
                    </Button>
                  </Upload>
                  {videoPreview && <div dangerouslySetInnerHTML={{ __html: videoPreview }} />}
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
          </Form.Item>
          <Form.Item name="discount" label="Discount" rules={[{ required: true, message: "Please input the discount!" }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCourseButton;
