import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { useState, useEffect } from "react";
// import TinyMCEEditor from "../../../generic/tiny/TinyMCEEditor";
import Editor from "../../../generic/tiny/Editor";
import { SessionService } from "../../../../services/session/session.service";
import { CreateSessionRequestModel } from "../../../../models/api/request/session/session.request.model";
import { CourseService } from "../../../../services/course/course.service";
import { GetCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
import { useSessionStore } from "../../../../hooks/useCallback";
// import { parseTinyEditor } from "../../../../utils";

const CreateButton = ({ onSessionCreated }: { onSessionCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState<GetCourseResponse["pageData"]>([]);
  const refreshSessions = useSessionStore((state) => state.refreshSessions);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await CourseService.getCourse({
          searchCondition: {
            keyword: "",
            category_id: "",
            status: "",
            is_delete: false
          },
          pageInfo: { pageNum: 1, pageSize: 10 }
        });
        setCourses(courseData.data.data.pageData.map((course) => ({ ...course, id: course._id })) || []);
      } catch (error) {
        message.error("Failed to load courses");
        console.error(error);
      }
    };
    loadCourses();
  }, []);

  const openCreateModal = () => {
    setIsOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const requestData: CreateSessionRequestModel = {
        ...values,
        description: values.description || ""
      };

      const createSessionResponse = await SessionService.createSession(requestData);

      if (createSessionResponse) {
        message.success("Session created successfully");
        setIsOpen(false);
        form.resetFields();
        setDescription("");

        await refreshSessions();
        // window.location.reload();

        // Call callback if provided
        if (onSessionCreated) {
          onSessionCreated();
        }
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      message.error("Failed to create session");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setDescription("");
  };

  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };

  return (
    <>
      <Button onClick={openCreateModal} className="rounded-md bg-[#1a237e] text-white">
        Create Session
      </Button>
      <Modal title="Create Session" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={800} style={{ top: "20px" }} destroyOnClose={true}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the lesson name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true, message: "Please select a course!" }]}>
            <Select placeholder="Select a course">
              {courses.map((course: any) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Editor initialValue={description || ""} onEditorChange={editChange} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateButton;
