import { useEffect, useState, useCallback } from "react";
import DashBoard from "../../../components/admin/overview/DashBoard";
import RecentOrder from "../../../components/admin/overview/RecentOrder";
import TransactionChart from "../../../components/admin/overview/TransactionChart";
import { SettingService } from "../../../services/admin/setting.service";
import { UserService } from "../../../services/admin/user.service";
import { CourseService } from "../../../services/course/course.service";
import { CategoryService } from "../../../services/category/category.service";
import { BlogService } from "../../../services/blog/blog.service";

import { Setting } from "../../../models/api/responsive/admin/setting.response.model";
import { Spin } from "antd";

const DashBoardAdmin = () => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalCategories, setTotalCategories] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [settingsData, blogsData, usersData, coursesData, categoriesData] = await Promise.all([
        SettingService.getSetting(),
        BlogService.getBlog({
          searchCondition: { name: "", is_delete: false },
          pageInfo: { pageNum: 1, pageSize: 10 }
        }),
        UserService.getUsersAdmin({
          searchCondition: { is_delete: false },
          pageInfo: { pageNum: 1, pageSize: 10 }
        }),
        CourseService.getCourse({
          searchCondition: { is_delete: false, keyword: "", category_id: "", status: "" },
          pageInfo: { pageNum: 1, pageSize: 10 }
        }),
        CategoryService.getCategory({
          searchCondition: { is_delete: false, is_parent: true, keyword: "" },
          pageInfo: { pageNum: 1, pageSize: 10 }
        })
      ]);

      setSettings(settingsData.data.data as Setting);
      setTotalBlogs(blogsData.data.data.pageInfo.totalItems);
      setTotalUsers(usersData.data.data.pageInfo.totalItems);
      setTotalCourses(coursesData.data.data.pageInfo.totalItems || 0);
      setTotalCategories(categoriesData.data.data.pageInfo.totalItems);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  } else if (!settings || !totalBlogs || !totalUsers || !totalCourses || !totalCategories) {
    return <p>No data</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {settings && totalBlogs && totalUsers && totalCourses && totalCategories && (
        <DashBoard
          settings={settings}
          totalBlogs={totalBlogs}
          totalUsers={totalUsers}
          totalCourses={totalCourses}
          totalCategories={totalCategories}
        />
      )}
      <div className="flex w-full flex-row gap-4">
        {settings && <TransactionChart settings={settings} />}
      </div>
      <div className="flex w-full flex-row gap-4 mt-10">
        {settings && <RecentOrder settings={settings} />}
      </div>
      </div>
    );
};

export default DashBoardAdmin;
