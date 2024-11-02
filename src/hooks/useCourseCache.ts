import { useState, useEffect } from "react";
import { CourseService } from "../services/course/course.service";
import { GetCourseParams } from "../models/api/request/course/course.request.model";
import { message } from "antd";
import useCategoryCache from "./useCategoryCache";
import { GetCourseResponse, GetCourseByIdResponse } from "../models/api/responsive/course/course.response.model";
import { StatusType } from "../app/enums";

const useCourseCache = (searchTerm: string, statusFilter: StatusType | "", pageNum: number, pageSize: number, refreshKey: number) => {
  const [courses, setCourses] = useState<GetCourseResponse["pageData"]>();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [courseById, setCourseById] = useState<GetCourseByIdResponse>();
  const getCategoryName = useCategoryCache();

  const params: GetCourseParams = {
    searchCondition: {
      keyword: searchTerm,
      category_id: statusFilter || "",
      status: statusFilter || "",
      is_delete: false
    },
    pageInfo: {
      pageNum,
      pageSize
    }
  };

  const mapCourseData = async (course: any) => {
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
  };

  const fetchCourses = async () => {
    try {
      const response = await CourseService.getCourse(params);

      if (response.status === 200 && response.data) {
        const pageData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [];

        const coursesTempData = await Promise.all(pageData.map(mapCourseData));

        setCourses(coursesTempData);
        setTotalItems(response.data.data.pageInfo.pageNum);
      }
    } catch (error) {
      return null;
    }
  };

  const fetchCourseById = async (id: string) => {
    try {
      const response = await CourseService.getCourseById(id);
      if (response.status === 200 && response.data) {
        setCourseById(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter, pageNum, pageSize, refreshKey]);

  return { courses, totalItems, courseById, fetchCourseById };
};

export default useCourseCache;
