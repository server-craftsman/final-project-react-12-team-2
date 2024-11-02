import { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Editor from "../../../generic/tiny/Editor";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { upload } from "../../../../utils";
import { LessonType } from "../../../../app/enums";
import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";
import { UpdateLessonRequest } from "../../../../models/api/request/lesson/lesson.request.model";

const { Option } = Select;

const EditButton = ({ data, isOpen, onClose, onLessonCreated }: any) => {
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
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
        course_id: data.course_id,
        session_id: data.session_id,
        image_url: data.image_url ? data.image_url : undefined,
        video_url: data.video_url ? data.video_url : undefined,
        description: data.description ? data.description : undefined, 
        full_time: data.full_time,
        position_order: data.position_order ? data.position_order : undefined,
        lesson_type: data.lesson_type
      });
      setLessonType(data.lesson_type);
      setImagePreview(data.image_url);
      setVideoPreview(data.video_url);
      if (data.course_id) {
        fetchSessions(data.course_id);
      }
    }
  }, [data, form]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await CourseService.getCourse({
          searchCondition: {
            keyword: "",
            category_id: "",
            status: "",
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });
        setCourses(courseResponse.data?.data.pageData as any);
      } catch (error) {
        message.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const fetchSessions = async (courseId: string) => {
    try {
      const sessionResponse = await SessionService.getSession({
        searchCondition: {
          course_id: courseId,
          is_delete: false,
          is_position_order: true,
          keyword: ""
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      setSessions(sessionResponse.data?.data.pageData as any);
    } catch (error) {
      message.error("Failed to fetch sessions");
    }
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const lessonId = data._id;
      if (!lessonId) {
        throw new Error("Lesson ID is missing");
      }

      if (formValues.lesson_type === LessonType.IMAGE && !formValues.image_url) {
        throw new Error("Please upload an image for the lesson.");
      }
      if (formValues.lesson_type === LessonType.VIDEO && !formValues.video_url) {
        throw new Error("Please upload a video for the lesson.");
      }

      const params: UpdateLessonRequest = {
        name: formValues.name,
        course_id: formValues.course_id,
        session_id: formValues.session_id,
        lesson_type: formValues.lesson_type as LessonType,
        description: formValues.description || null,
        video_url: formValues.video_url || null,
        image_url: formValues.image_url || null,
        full_time: Number(formValues.full_time),
        position_order: formValues.position_order ? Number(formValues.position_order) : null,
      };

      await LessonService.updateLesson(params, lessonId);

      message.success("Lesson updated successfully");
      onClose();
      form.resetFields();
      onLessonCreated(); // Refresh the lesson list
    } catch (error) {
      console.error("Error updating lesson:", error);
      message.error("Failed to update lesson");
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

  const handleImagePreview = useCallback(
    async (file: File) => {
      setUploadingAvatar(true);
      try {
        const url = await upload.handleUploadFile(file, "image");
        form.setFieldsValue({ image_url: url });
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
    [upload.handleUploadFile, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      setUploadingVideo(true);
      try {
        const url = await upload.handleUploadFile(file, "video");
        form.setFieldsValue({ video_url: url });
        setVideoPreview(url);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setUploadingVideo(false);
      }
      return false; // Prevent default upload behavior
    },
    [upload.handleUploadFile, form]
  );

  const handleCourseChange = (courseId: string) => {
    form.setFieldsValue({ course_id: courseId });
    fetchSessions(courseId);
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
