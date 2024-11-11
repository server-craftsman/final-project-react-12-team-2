import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { useState, useEffect } from "react";
// import TinyMCEEditor from "../../../generic/tiny/TinyMCEEditor";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { useCallbackCourse, useCallbackSession } from "../../../../hooks/useCallback";
// import { upload } from "../../../../utils";
import { BaseService } from "../../../../services/config/base.service";
import Editor from "../../../generic/tiny/Editor";
import { LessonType } from "../../../../app/enums";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

const CreateButton = ({ onLessonCreated }: { onLessonCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>(LessonType.VIDEO);
  // const [imageUrl, setImageUrl] = useState("");
  // const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  // const [uploading, setUploading] = useState(false);
  // const callbackLesson = useCallbackLesson();
  const callbackCourse = useCallbackCourse();
  const callbackSession = useCallbackSession();

  const { courseData: courses, courseLoading } = callbackCourse;
  const { sessionData: sessions, sessionLoading } = callbackSession;

  useEffect(() => {
    callbackCourse.getCourse();
  }, []);

  const openCreateModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const createLesson = async () => {
    try {
      const values = await form.validateFields();
      values.full_time = Number(values.full_time);
      values.position_order = Number(values.position_order);
      await LessonService.createLesson(values);
      setTimeout(() => {
        message.success("Lesson created successfully");
      }, 3000);
      setIsOpen(false);

      form.resetFields();
      setDescription("");

      // Call callback if provided
      if (onLessonCreated) {
        onLessonCreated();
      }
    } catch (error) {
      message.error("Failed to create lesson");
    }
  };

  const handleCourseChange = async (courseId: string) => {
    try {
      form.setFieldValue("session_id", undefined);

      if (courseId) {
        await callbackSession.getSession({
          searchCondition: {
            course_id: courseId,
            is_delete: false,
            is_position_order: false,
            keyword: ""
          }
        });
      }
    } catch (error) {
      message.error("Failed to fetch sessions");
    }
  };

  const onUploadSuccess = (type: "video" | "image", url: string) => {
    if (type === "image") {
      setImagePreview(url);
    } else {
      setVideoPreview(url);
    }
    form.setFieldValue(`${type}_url`, url);
  };

  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };

  return (
    <>
      <Button onClick={() => openCreateModal()} className="rounded-md bg-[#1a237e] text-white">
        Create Lesson
      </Button>
      <Modal title="Create Lesson" open={isOpen} onOk={createLesson} onCancel={handleCancel} width={800}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the lesson name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true, message: "Please select a course!" }]}>
            <Select placeholder="Select a course" onChange={handleCourseChange} loading={courseLoading}>
              {courses?.map((course: any) => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="session_id" label="Session" rules={[{ required: true, message: "Please select a session!" }]}>
            <Select placeholder="Select a session" disabled={!form.getFieldValue("course_id")} loading={sessionLoading}>
              {sessions?.map((session: any) => (
                <Option key={session._id} value={session._id}>
                  {session.name || session.title || `Session ${session.position_order}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="lesson_type" label="Lesson Type" initialValue={LessonType.VIDEO} rules={[{ required: true, message: "Please select a lesson type!" }]}>
            <Select onChange={(value) => setLessonType(value)}>
              {Object.values(LessonType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {lessonType === LessonType.IMAGE && (
            <Form.Item name="image_url" label="Image" rules={[{ required: true, message: "Please upload an image!" }]}>
              <div>
                <Upload accept="image/*" maxCount={1} showUploadList={false} customRequest={(options: any) => BaseService.uploadFile(options.file, "image").then(url => onUploadSuccess("image", url))}>
                  <Button icon={<UploadOutlined />}>
                    Upload Image
                  </Button>
                </Upload>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: 8, maxWidth: "200px" }} />}
              </div>
            </Form.Item>
          )}

          {lessonType === LessonType.VIDEO && (
            <Form.Item name="video_url" label="Video" rules={[{ required: true, message: "Please upload a video!" }]}>
              <div>
                <Upload accept="video/*" maxCount={1} showUploadList={false} customRequest={(options: any) => BaseService.uploadFile(options.file, "video").then(url => onUploadSuccess("video", url))}>
                  <Button icon={<UploadOutlined />}>
                    Upload Video
                  </Button>
                </Upload>
                {videoPreview && <video src={videoPreview} controls style={{ marginTop: 8, maxWidth: "200px" }} />}
              </div>
            </Form.Item>
          )}
          {lessonType === LessonType.TEXT && (
            <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
              <Editor initialValue={description} onEditorChange={editChange} />
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
    </>
  );
};

export default CreateButton;
