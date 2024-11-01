import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload } from "antd";
const { Option } = Select;
import { useState, useEffect, useCallback } from "react";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import {upload } from "../../../../utils";
import DraftEditor from "../../../generic/tiny/Editor";
import { CourseService } from "../../../../services/course/course.service";
import { UpdateCourseParams } from "../../../../models/api/request/course/course.request.model";
import { CategoryService } from "../../../../services/category/category.service";
import { GetCategoryParams } from "../../../../models/api/request/admin/category.request.model";

interface EditButtonProps {
  data: any;
  onEditSuccess?: () => void;
}

const EditButton = ({ data, onEditSuccess }: EditButtonProps) => { // Added onEditSuccess prop
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>(data.description || '');
  const [content, setContent] = useState<string>(data.content || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [avatarFileList, setAvatarFileList] = useState<any[]>([]);
  const [videoFileList, setVideoFileList] = useState<any[]>([]);
  // Initialize states with existing data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        category_id: data.category_id,
        description: data.description,
        content: data.content,
        image_url: data.image_url,
        video_url: data.video_url,
        price: data.price,
        discount: data.discount
      });
      setAvatarPreview(data.image_url);
      setVideoPreview(data.video_url ? `<video controls src="${data.video_url}"></video>` : null);
      setIsOpen(true);
    }
  }, [data]);

  const getParentCategoryParams: GetCategoryParams = {
    searchCondition: {
      is_delete: false,
      is_parent: true,
      keyword: ""
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

  // Modify category fetching
  useEffect(() => {
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

    fetchCategories();
  }, []);

  const openCreateModal = () => {
    form.setFieldsValue({
      id: data._id,
      name: data.name,
      category_id: data.category_id,
      description: data.description,
      content: data.content,
      image_url: data.image_url,
      video_url: data.video_url,
      price: data.price,
      discount: data.discount
    });
    setIsOpen(true);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      
      const updateParams: UpdateCourseParams = {
        name: formValues.name,
        description: formValues.description || description,
        content: content,
        category_id: formValues.category_id,
        image_url: formValues.image_url,
        video_url: formValues.video_url,
        price: Number(formValues.price),
        discount: Number(formValues.discount)
      };

      const response = await CourseService.updateCourse(data._id, updateParams);
      
      if (response.data?.data) {
        message.success("Course updated successfully");
        setIsOpen(false);
        form.resetFields();
        setDescription("");
        setContent("");
        if (onEditSuccess) {
          onEditSuccess();
        }
      }
    } catch (error: any) {
      console.error('Update error:', error);
      message.error(error.message || "Failed to update course");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setDescription("");
    setContent("");
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

  const editChange = (value: string) => {
    setContent(value);
    form.setFieldsValue({ content: value });
  }
  return (
    <>
      <Button className="mr-2" icon={<EditOutlined />} onClick={openCreateModal} />
      <Modal
        title="Edit Course"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: "20px" }}
      >
        <Form form={form} layout="vertical" initialValues={data}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Course Name" rules={[{ required: true, message: "Please input the course name!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category_id" initialValue="" label="Category" rules={[{ required: true, message: "Please select a category!" }]}>
                <Select placeholder="Select a category">
                  {categories.map((parent) => (
                    <Select.OptGroup key={parent._id} label={parent.name}>
                      {parent.children?.map((child: any) => (
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
          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input.TextArea 
              // value={data.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item 
            name="content" 
            label="Content" 
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <DraftEditor 
              initialValue={data.content}
              onEditorChange={editChange}
            />
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

export default EditButton;
