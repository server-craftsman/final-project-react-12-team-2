import { useState, useEffect } from "react";
import { Course, CourseStatusEnum } from "../models/prototype/Course";
import { CourseService } from "../services/course/course.service";
import { GetCourseParams } from "../models/api/request/course/course.request.model";
import { message } from "antd";
import useCategoryCache from "./useCategoryCache";

const useCourseCache = (searchTerm: string, statusFilter: CourseStatusEnum | "", pageNum: number, pageSize: number) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const getCategoryName = useCategoryCache();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params: GetCourseParams = {
          searchCondition: {
            keyword: searchTerm,
            category_id: statusFilter,
            status: statusFilter,
            is_delete: false
          },
          pageInfo: {
            pageNum,
            pageSize
          }
        };

        const response = await CourseService.getCourse(params);

        if (response.status === 200 && response.data) {
          const pageData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [];

          const coursesTempData = await Promise.all(
            pageData.map(async (course: any) => {
              let categoryName = "Unknown Category";
              if (course.category_name) {
                categoryName = await getCategoryName(course.category_name);
              } else {
                console.warn(`Course ID: ${course.id} does not have a category_id`);
              }
              return {
                ...course,
                category_name: categoryName,
                course_id: course.id ? String(course.id) : ""
              };
            })
          );

          setCourses(coursesTempData);
          setTotalItems(response.data.data.pageInfo.totalItems);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        message.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, [searchTerm, statusFilter, pageNum, pageSize, getCategoryName]);

  return { courses, totalItems };
};

export default useCourseCache;
