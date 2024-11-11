import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
const { Option } = Select;
import { useState, useEffect, useCallback } from "react";
import { EditOutlined } from "@ant-design/icons";
// import Editor from "../../../generic/tiny/Editor";
import { SessionService } from "../../../../services/session/session.service";
import { useCallbackCourse } from "../../../../hooks/useCallback";
import { GetCourseResponsePageData } from "../../../../models/api/responsive/course/course.response.model";

const EditButton = ({ data, onSessionEdited, fetchSessionDetails }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<GetCourseResponsePageData[] | null>(null);

  const { getCourse } = useCallbackCourse();
  const fetchCourses = useCallback(async () => {
    const result = await getCourse();
    setCourses(result.data);
  }, [getCourse]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const openCreateModal = async () => {
    setIsOpen(true);
    try {
      const response = await fetchSessionDetails(data._id);
      const sessionDetails = response.data;
      if (sessionDetails) {
        form.setFieldsValue({
          name: sessionDetails.name,
          course_id: sessionDetails.course_id,
          description: sessionDetails.description,
          position_order: sessionDetails.position_order
        });
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      message.error("Failed to load session details");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: String(values.name).trim(),
        course_id: String(values.course_id).trim(),
        description: String(values.description).trim(),
        position_order: Number(values.position_order) || 0,
        _id: data._id
      };

      if (!data._id) {
        throw new Error("Invalid session ID");
      }

      await SessionService.updateSession(payload, data._id);
      setTimeout(() => {
        message.success("Session edited successfully");
      }, 3000);
      setIsOpen(false);
      form.resetFields();
      if (onSessionEdited) {
        onSessionEdited();
      }
    } catch (error) {
      console.error("Error updating session:", error);
      message.error("Failed to edit session");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  // const editChange = (value: string) => {
  //   const strippedContent = value.replace(/<[^>]*>/g, "").trim();
  //   form.setFieldsValue({ description: strippedContent ? value : "" });
  // };

  return (
    <>
      <Button className="mr-2" icon={<EditOutlined />} onClick={openCreateModal} />
      <Modal title="Edit Session" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={800} style={{ top: "20px" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the lesson name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true, message: "Please select the session!" }]}>
            <Select>
              {courses?.map((course: any) => (
                <Option key={course.id || course._id} value={course.id || course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="position_order" label="Position Order">
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
