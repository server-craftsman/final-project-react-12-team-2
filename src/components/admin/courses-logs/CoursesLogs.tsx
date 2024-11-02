import React, { useEffect, useState, useCallback } from 'react';
import { Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CourseLog, GetCoursesLogsResponse } from '../../../models/api/responsive/admin/courselog.reponsive.model';
import { GetCoursesLogsParams } from '../../../models/api/request/admin/courseslog.request.model';
import { courseLogService } from '../../../services/course-log/CourseLog.service';
import { CourseService } from '../../../services/course/course.service';
import dayjs from 'dayjs';

interface Props {
  searchQuery: string;
}

const CoursesLogs: React.FC<Props> = ({ searchQuery }) => {
  const [data, setData] = useState<GetCoursesLogsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [courseIds, setCourseIds] = useState<string[]>([]);

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      keyword: searchQuery,
      course_id: '',
      category_id: '',
      status: '',
      is_delete: false
    }
  } as const;

  const fetchCourseIds = useCallback(async () => {
    try {
      const response = await CourseService.getCourse({
        searchCondition: {
          keyword: searchQuery,
          category_id: '',
          status: '',
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      if (response.data?.data) {
        const ids = response.data.data.pageData.map((course: any) => course._id);
        setCourseIds(ids);
      }
    } catch (error) {
      message.error("An unexpected error occurred while fetching course IDs");
    }
  }, [searchQuery]);

  const fetchCoursesLogs = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const allLogs: CourseLog[] = [];
      for (const courseId of courseIds) {
        const params: GetCoursesLogsParams = {
          pageInfo: {
            pageNum: page,
            pageSize: pageSize
          },
          searchCondition: {
            keyword: searchQuery || defaultParams.searchCondition.keyword,
            course_id: courseId,
            category_id: defaultParams.searchCondition.category_id,
            status: defaultParams.searchCondition.status,
            is_delete: Boolean(defaultParams.searchCondition.is_delete)
          }
        };

        const response = await courseLogService.getCoursesLogs(params);

        if (response.data?.data) {
          allLogs.push(...response.data.data.pageData);
        }
      }

      if (allLogs.length > 0) {
        setData({
          pageData: allLogs,
          pageInfo: {
            pageNum: page,
            pageSize: pageSize,
            totalItems: allLogs.length,
            totalPages: Math.ceil(allLogs.length / pageSize)
          }
        });
      } else {
        setData({
          pageData: [],
          pageInfo: {
            pageNum: page,
            pageSize: pageSize,
            totalItems: 0,
            totalPages: 0
          }
        });
      }
    } catch (error) {
      message.error("An unexpected error occurred while fetching course logs");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, courseIds]);

  useEffect(() => {
    fetchCourseIds();
  }, [fetchCourseIds]);

  useEffect(() => {
    if (courseIds.length > 0) {
      fetchCoursesLogs(data?.pageInfo.pageNum, data?.pageInfo.pageSize);
    }
  }, [fetchCoursesLogs, courseIds, data?.pageInfo.pageNum, data?.pageInfo.pageSize]);

  const handleTableChange = (pagination: any) => {
    fetchCoursesLogs(pagination.current, pagination.pageSize);
  };

  const columns: ColumnsType<CourseLog> = [
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Old Status',
      dataIndex: 'old_status',
      key: 'old_status',
    },
    {
      title: 'New Status',
      dataIndex: 'new_status',
      key: 'new_status',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: Date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
    },
  ];
  console.log(data);
  return (
    <Table
      columns={columns}
      dataSource={data?.pageData}
      loading={loading}
      rowKey="_id"
      pagination={{
        current: data?.pageInfo.pageNum,
        pageSize: data?.pageInfo.pageSize,
        total: data?.pageInfo.totalItems,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
    />
  );
};

export default CoursesLogs;
