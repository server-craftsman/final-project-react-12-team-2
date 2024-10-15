import React, { useEffect, useState } from "react";
import CoursesLog from "../../../components/admin/courses-log/CoursesLog";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Course } from "../../../models/Course";
import coursesData from "../../../data/courses.json";
import reviewsData from "../../../data/reviews.json";

const CoursesLogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
        comment: review ? review.comment : "No comment",
      };
    });

    // Filter courses based on the searchTerm
    const filteredData = mergedData.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setData(filteredData as Course[]);
  }, [searchTerm]); // Add searchTerm as a dependency

  return (
    <div>
      <CustomSearch
        className="mb-4"
        placeholder="Search by course name"
        onSearch={(value) => setSearchTerm(value)}
      />
      <CoursesLog data={data} />
    </div>
  );
};

export default CoursesLogManagement;
