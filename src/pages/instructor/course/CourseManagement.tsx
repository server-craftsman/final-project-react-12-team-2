import React, { lazy } from "react";

const CourseManagementComponent = lazy(
    () => import("../../../components/instructor/course/CourseManagement"),
);

const CourseManagement: React.FC = () => {
    return <CourseManagementComponent />;
};

export default CourseManagement