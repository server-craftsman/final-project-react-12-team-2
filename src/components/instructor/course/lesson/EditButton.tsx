import { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Editor from "../../../generic/tiny/Editor";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { upload } from "../../../../utils";
import { LessonType } from "../../../../app/enums";
import { useCallbackCourse, useCallbackSession } from "../../../../hooks/useCallback";
import { UpdateLessonRequest } from "../../../../models/api/request/lesson/lesson.request.model";
import { GetCourseResponsePageData } from "../../../../models/api/responsive/course/course.response.model";
import { SessionResponsePageData } from "../../../../models/api/responsive/session/session.response.model";

const { Option } = Select;

const EditButton = ({ data, isOpen, onClose, onLessonCreated }: any) => {
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState<SessionResponsePageData[]>([]);
  const [courses, setCourses] = useState<GetCourseResponsePageData[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [avatarFileList, setAvatarFileList] = useState<any[]>([]);
  const [videoFileList, setVideoFileList] = useState<any[]>([]);

  const { getCourse } = useCallbackCourse();
  const { getSession } = useCallbackSession();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        course_id: data.course_id,
        session_id: data.session_id,
        image_url: data.image_url,
        video_url: data.video_url,
        description: data.description, 
        full_time: data.full_time,
        position_order: data.position_order,
        lesson_type: data.lesson_type
      });
      setLessonType(data.lesson_type);
      setImagePreview(data.image_url);
      setVideoPreview(data.video_url);
      if (data.course_id) {
        getCourse().then((response) => {
          setCourses(response.data || []);
          const validCourse = response.data?.find((course: any) => course._id === data.course_id);
          if (validCourse) {
            form.setFieldsValue({ course_id: data.course_id });
            getSession({ searchCondition: { course_id: data.course_id, is_position_order: true, is_delete: false, keyword: "" }, pageInfo: { pageNum: 1, pageSize: 100 } }).then((fetchedSessions) => {
              setSessions(fetchedSessions.data || []);
              const validSession = fetchedSessions.data?.find((session: any) => session._id === data.session_id);
              if (validSession) {
                form.setFieldsValue({ session_id: data.session_id });
              } else {
                form.setFieldsValue({ session_id: null });
                message.error("The selected session cannot be used! Please select a valid session.");
              }
            });
          } else {
            form.setFieldsValue({ course_id: null });
            message.error("The selected course cannot be used! Please select a valid course.");
          }
        });
      }
    }
  }, [data, form, getCourse, getSession]);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const lessonId = data._id;
      if (!lessonId) {
        throw new Error("Lesson ID is missing");
      }

      const params: UpdateLessonRequest = {
        name: formValues.name,
        course_id: formValues.course_id,
        session_id: formValues.session_id,
        lesson_type: formValues.lesson_type as LessonType,
        description: formValues.description || null,
        video_url: formValues.video_url || "",
        image_url: formValues.image_url || "",
        full_time: Number(formValues.full_time),
        position_order: formValues.position_order ? Number(formValues.position_order) : null,
      };

      console.log("Update parameters:", params);

      const response = await LessonService.updateLesson(lessonId, params);
      console.log("API Response:", response);

      if (response.data?.success) {
        message.success("Lesson updated successfully");
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
    form.setFieldsValue({ description: value });
  };

  const handleLessonTypeChange = (value: LessonType) => {
    setLessonType(value);
    form.setFieldsValue({ lesson_type: value });
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

  const handleCourseChange = async (courseId: string) => {
    form.setFieldsValue({ course_id: courseId, session_id: null });
    const sessionResponse = await getSession({ 
      searchCondition: { 
        course_id: courseId, 
        is_position_order: true, 
        is_delete: false, 
        keyword: "" 
      }, 
      pageInfo: { 
        pageNum: 1, 
        pageSize: 100 
      } 
    });
    setSessions(sessionResponse.data || []);
  };

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
        <Button key="submit" className="bg-gradient-tone text-white hover:bg-gradient-tone-hover" onClick={handleOk}>
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[
          { required: true, message: "Please input the lesson name!" },
          { type: 'string', message: "Name must be a string" }
        ]}>
          <Input />
        </Form.Item>
        <Form.Item name="course_id" label="Course" rules={[
          { required: true, message: "Please select the course!" },
          { type: 'string', message: "Course ID must be a string" }
        ]}>
          <Select onChange={handleCourseChange}>
            {courses.map((course: any) => (
              <Option key={course._id} value={course._id}>
                {course.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="session_id" label="Session" rules={[
          { required: true, message: "Please select the session!" },
          { type: 'string', message: "Session ID must be a string" }
        ]}>
          <Select>
            {sessions.map((session: any) => (
              <Option key={session._id} value={session._id}>
                {session.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="lesson_type" label="Lesson Type" rules={[
          { required: true, message: "Please select the lesson type!" },
          { type: 'string', message: "Lesson type must be a string" }
        ]}>
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
              { type: 'string', message: "Image URL must be a string" }
            ]}
          >
            <div className="space-y-4">
                  <Upload accept="image/*" showUploadList={false} beforeUpload={handleImagePreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingAvatar}>
                      Select Avatar
                    </Button>
                  </Upload>
                  {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ width: '100%', marginTop: '10px' }} />}
                </div>
          </Form.Item>
        )}

        {lessonType === LessonType.VIDEO && (
          <Form.Item 
            name="video_url" 
            label="Video Url" 
            rules={[
              { required: true, message: "Please input the video url!" },
              { type: 'string', message: "Video URL must be a string" }
            ]}
          >
                <div className="space-y-4">
                  <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" loading={uploadingVideo}>
                      Select Video
                    </Button>
                  </Upload>
                  {videoPreview && (
                    <video controls style={{ width: '100%', marginTop: '10px' }}>
                      <source src={videoPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
          </Form.Item>
        )}

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
          <Editor initialValue={data.description} onEditorChange={editChange} />
        </Form.Item>
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
