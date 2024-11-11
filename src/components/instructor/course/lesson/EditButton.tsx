import { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Editor from "../../../generic/tiny/Editor";
import { LessonService } from "../../../../services/lesson/lesson.service";
// import { upload } from "../../../../utils";
import { BaseService } from "../../../../services/config/base.service";
import { LessonType } from "../../../../app/enums";
const { Option } = Select;

const EditButton = ({ data, isOpen, onClose, onLessonCreated }: any) => {
  const [form] = Form.useForm();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [avatarFileList, setAvatarFileList] = useState<any[]>([]);
  const [videoFileList, setVideoFileList] = useState<any[]>([]);
  
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        image_url: data.image_url || "",
        video_url: data.video_url || "",
        description: data.description,
        full_time: data.full_time,
        position_order: data.position_order,
        lesson_type: data.lesson_type,
        course_id: data.course_id,
        session_id: data.session_id,
        user_id: data.user_id
      });
      setLessonType(data.lesson_type);
      setImagePreview(data.image_url);
      setVideoPreview(data.video_url);
    }
  }, [data, form]);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const lessonId = data._id;
      if (!lessonId) {
        throw new Error("Lesson ID is missing");
      }

      const courseId = data.course_id;
      const sessionId = data.session_id;

      if (!courseId) {
        throw new Error("Course ID is missing or invalid");
      }

      if (!sessionId) {
        throw new Error("Session ID is missing or invalid");
      }

      const params = {
        name: formValues.name,
        course_id: data.course_id,
        session_id: data.session_id,
        user_id: data.user_id,
        lesson_type: formValues.lesson_type as LessonType,
        description: formValues.description || "",
        video_url: formValues.video_url || "",
        image_url: formValues.image_url || "",
        full_time: Number(formValues.full_time),
        position_order: formValues.position_order ? Number(formValues.position_order) : null
      };

      console.log("Update parameters:", params);

      const response = await LessonService.updateLesson(lessonId, params);
      console.log("API Response:", response);

      if (response.data?.success) {
        setTimeout(() => {
          message.success("Lesson updated successfully");
        }, 3000);
        onClose();
        form.resetFields();
        onLessonCreated();
      } else {
        console.error("API Error:", response.data);
        throw new Error("Failed to update lesson");
      }
    } catch (error: any) {
      console.error("Error updating lesson:", error.response?.data || error.message);
      message.error(error.response?.data?.message || error.message || "Failed to update lesson");
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };
  const editChange = (value: string) => {
    const strippedContent = value.replace(/<[^>]*>/g, "").trim();
    form.setFieldsValue({ description: strippedContent ? value : "" });
  };

  const handleLessonTypeChange = (value: LessonType) => {
    setLessonType(value);
    form.setFieldsValue({ lesson_type: value });
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

  const handleImagePreview = useCallback(
    async (file: File) => {
      setUploadingAvatar(true);
      try {
        const url = await handleFileUpload(file, "image");
        form.setFieldsValue({ image_url: String(url) });
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
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
        form.setFieldsValue({ video_url: String(url) });
        setVideoPreview(url);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setUploadingVideo(false);
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  return (
    <Modal
      title="Edit Lesson"
      open={isOpen}
      onCancel={handleCancel}
      width={800}
      style={{ top: "20px" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" className="bg-gradient-tone hover:bg-gradient-tone-hover text-white" onClick={handleOk}>
          Update
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input the lesson name!" },
            { type: "string", message: "Name must be a string" }
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item name="course_id" label="Course ID">
          <Input value={data.course_id} disabled />
        </Form.Item>
        <Form.Item name="session_id" label="Session ID">
          <Input value={data.session_id} disabled />
        </Form.Item> */}
        <Form.Item
          name="lesson_type"
          label="Lesson Type"
          rules={[
            { required: true, message: "Please select the lesson type!" },
            { type: "string", message: "Lesson type must be a string" }
          ]}
        >
          <Select onChange={handleLessonTypeChange}>
            {Object.values(LessonType).map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {lessonType === LessonType.IMAGE && (
          <Form.Item
            name="image_url"
            label="Image Url"
            rules={[
              { required: true, message: "Please input the image url!" },
              { type: "string", message: "Image URL must be a string" }
            ]}
          >
            <div className="space-y-4">
              <Upload accept="image/*" showUploadList={false} beforeUpload={handleImagePreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingAvatar}>
                  Select Avatar
                </Button>
              </Upload>
              {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ width: "100%", marginTop: "10px" }} />}
            </div>
          </Form.Item>
        )}

        {lessonType === LessonType.VIDEO && (
          <Form.Item
            name="video_url"
            label="Video Url"
            rules={[
              { required: true, message: "Please input the video url!" },
              { type: "string", message: "Video URL must be a string" }
            ]}
          >
            <div className="space-y-4">
              <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList)}>
                <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingVideo}>
                  Select Video
                </Button>
              </Upload>
              {videoPreview && (
                <video controls style={{ width: "100%", marginTop: "10px" }}>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Form.Item>
        )}
        {lessonType === LessonType.TEXT && (
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Editor initialValue={data.description} onEditorChange={editChange} />
          </Form.Item>
        )}
        <Form.Item
          name="full_time"
          label="Full Time (minutes)"
          rules={[
            {
              required: true,
              message: "Please input the full time in minutes!"
            }
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item name="position_order" label="Position Order" rules={[{ required: true, message: "Please input the position order!" }]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditButton;
