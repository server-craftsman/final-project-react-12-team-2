import { Button, Form, Input, message, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import TinyMCEEditor from "../../../generic/tiny/TinyMCEEditor";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { CourseService } from "../../../../services/course/course.service";
import { SessionService } from "../../../../services/session/session.service";
import { GetCourseParams } from "../../../../models/api/request/course/course.request.model";
import { SessionRequestModel } from "../../../../models/api/request/session/session.request.model";
import { GetCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
import { SessionResponse } from "../../../../models/api/responsive/session/session.response.model";

const { Option } = Select;

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState<SessionResponse['pageData']>();
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState<GetCourseResponse['pageData']>();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (): Promise<void> => {
    try {
      const params: GetCourseParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 100
        },
        searchCondition: {
          keyword: "",
          category_id: "",
          status: "",
          is_delete: false
        }
      };
      const response = await CourseService.getCourse(params);
      setCourses(response.data.data.pageData || []);
    } catch (error) {
      message.error("Failed to fetch courses");
    }
  };

  const openCreateModal = () => {
    setIsOpen(true);
  };

  // const handleOk = async (): Promise<void> => {
  //   try {
  //     await createLesson();
  //     setIsOpen(false);
  //     message.success("Lesson created successfully");
  //   } catch (error) {
  //     message.error("Failed to create lesson");
  //   }
  // };

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

      message.success("Lesson created successfully");
      setIsOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create lesson");
    }
  };

  const handleCourseChange = async (courseId: string) => {
    try {
      form.setFieldValue('session_id', undefined); // Clear session selection on course change

      if (courseId) {
        const params: SessionRequestModel = {
          searchCondition: {
            course_id: courseId,
            keyword: "",
            is_position_order: false,
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100
          }
        };
        const response = await SessionService.getSession(params);
        setSessions(response.data.data.pageData || []);
      } 
    } catch (error) {
      message.error("Failed to fetch sessions");
    }
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
          <Form.Item 
            name="course_id" 
            label="Course" 
            rules={[{ required: true, message: "Please select a course!" }]}
          >
            <Select
              placeholder="Select a course"
              onChange={handleCourseChange}
              loading={courses && courses.length === 0}
            >
              {courses && courses.map((course: GetCourseResponse['pageData'][0]) => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            name="session_id" 
            label="Session" 
            rules={[{ required: true, message: "Please select a session!" }]}
          >
            <Select
              placeholder="Select a session"
              disabled={!form.getFieldValue('course_id')}
              loading={form.getFieldValue('course_id' ) && sessions && sessions.length === 0}
            >
              {sessions && sessions.map((session: SessionResponse['pageData'][0]) => (
                <Option key={session._id} value={session._id}>
                  {session.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="image_url" label="Image URL" rules={[{ required: true, message: "Please input the image url!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="video_url" label="Video URL" rules={[{ required: true, message: "Please input the video url!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
            <TinyMCEEditor
              initialValue={description}
              onEditorChange={(content) => {
                setDescription(content);
                form.setFieldValue("description", content);
              }}
            />
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
    </>
  );
};

export default CreateButton;
