import React, { useEffect, useState } from "react";
import AdminBlog from "../../../components/admin/blog/BLogManagement";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import FilterStatus from "../../../components/admin/blog/FilterStatus";
import { Course } from "../../../models/prototype/Course";
import coursesData from "../../../data/courses.json";
import reviewsData from "../../../data/reviews.json";
import { Content } from "antd/es/layout/layout";
import { Card } from "antd";
import CreateBlog from "../../../components/admin/blog/CreateBlog";

const CoursesLogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    const courses = coursesData.courses;
    const reviews = reviewsData.reviews;

    const mergedData = courses.map((course) => {
      const review = reviews.find((r) => r.course_id === course.id);
      return {
        ...course,
        newStatus: course.status,
        oldStatus: review ? "Updated" : course.status,
        comment: review ? review.comment : "No comment"
      };
    });

    // Filter courses based on the searchTerm and statusFilter
    const filteredData = mergedData.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter === "all" || course.newStatus === statusFilter));

    setData(filteredData as Course[]);
  }, [searchTerm, statusFilter]); // Add statusFilter as a dependency

  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch className="search-input" placeholder="Search by course name" onSearch={(value) => setSearchTerm(value)} />
          <FilterStatus status={statusFilter} setStatus={setStatusFilter} />
          <CreateBlog />
        </div>
        <AdminBlog data={data} searchQuery={searchTerm} />
      </Card>
    </Content>
  );
};

export default CoursesLogManagement;
