import React, { lazy, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Course } from "../../../models/Course";
import { courses } from "../../../data/courses.json";

const ViewCourseModal = lazy(() => import("../../../components/instructor/course/ViewCourseModal"));
const EditCourseModal = lazy(() => import("../../../components/instructor/course/EditCourseModal"));
const AddCourseModal = lazy(() => import("../../../components/instructor/course/AddCourseModal"));

const CourseManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<Course[]>(courses as Course[]);
  const [modalState, setModalState] = useState<{ type: string; visible: boolean; course: Course | null }>({
    type: '',
    visible: false,
    course: null,
  });

  const openModal = (type: string, course: Course | null) => {
    setModalState({ type, visible: true, course });
  };

  const closeModal = () => {
    setModalState({ type: '', visible: false, course: null });
  };

  const handleSearch = (value: string) => {
    setDataSource(value ? dataSource.filter(course => course.name.toLowerCase().includes(value.toLowerCase())) : courses as Course[]);
  };

  const handleEditSubmit = (values: Course) => {
    setDataSource(dataSource.map(course => (course.id === modalState.course?.id ? { ...course, ...values } : course)));
    closeModal();
  };

  const handleCreateSubmit = (values: Course) => {
    setDataSource([...dataSource, { ...values, id: Date.now().toString() }]);
    closeModal();
  };

  const handleDelete = (course: Course) => {
    setDataSource(dataSource.filter(item => item.id !== course.id));
  };

  const columns: ColumnsType<Course> = [
    { title: "Name", dataIndex: "name", key: "name", width: 200 },
    { title: "Image", dataIndex: "image_url", key: "image_url", width: 100, render: text => <img src={text} alt="Course" style={{ width: 50, height: 50 }} /> },
    { title: "Category", dataIndex: "category_id", key: "category_id", width: 150 },
    { title: "Price", dataIndex: "price", key: "price", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: text => <span>{text}</span> },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, course) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openModal("view", course)} />
          <Button icon={<EditOutlined />} onClick={() => openModal("edit", course)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(course)} />
        </Space>
      )
    },
  ];

  return (
    <div>
      <Space>
        <Input.Search placeholder="Search courses" onSearch={handleSearch} enterButton />
        <Button icon={<PlusOutlined />} onClick={() => openModal("create", null)}>Add Course</Button>
      </Space>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />

      {modalState.visible && (
        <>
          <ViewCourseModal visible={modalState.type === "view"} course={modalState.course} onClose={closeModal} />
          <EditCourseModal visible={modalState.type === "edit"} course={modalState.course} onClose={closeModal} onSubmit={handleEditSubmit} />
          <AddCourseModal visible={modalState.type === "create"} onClose={closeModal} onSubmit={handleCreateSubmit} />
        </>
      )}
    </div>
  );
};
export default CourseManagement