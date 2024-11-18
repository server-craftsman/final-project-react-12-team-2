import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { message, Table, Button, Avatar, Popconfirm } from 'antd';
import { DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ReviewService } from '../../../services/review/review.service';
import LoadingAnimation from '../../../app/UI/LoadingAnimation';
import { helpers } from '../../../utils';
import FilterDate from './FilterDate';
import CustomSearch from '../../../components/generic/search/CustomSearch';
import { Link } from 'react-router-dom';

interface DisplayReviewProps {
  search: string;
  dateRange: [any, any] | null;
  isDelete?: boolean;
  activeTab: string;
}

const DisplayReview: React.FC<DisplayReviewProps> = ({ search, dateRange, isDelete = false, activeTab }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedDateRange, setSelectedDateRange] = useState<[any, any] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchReviews = useCallback(async (pageNum = 1, pageSize = 10) => {
    console.log('Fetching reviews with isDelete:', isDelete, 'activeTab:', activeTab);
    setLoading(true);
    try {
      const searchCondition = {
        course_id: "",
        is_deleted: isDelete,
        is_instructor: false,
        is_rating_order: false,
        rating: 0,
      };

      switch (activeTab) {
        case "true":
          searchCondition.is_deleted = true;
          break;
        case "false":
          searchCondition.is_deleted = false;
          break;
        default:
          break;
      }

      const response = await ReviewService.searchForReview({
        searchCondition,
        pageInfo: {
          pageNum,
          pageSize
        }
      });
      const pageData = response.data.data.pageData;
      setReviews(pageData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [search, dateRange, isDelete, activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    if (selectedDateRange) {
      const [start, end] = selectedDateRange;
      filtered = filtered.filter(review => {
        const createdAt = new Date(review.created_at);
        return createdAt >= start && createdAt <= end;
      });
    }
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [reviews, selectedDateRange, searchTerm]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await ReviewService.deleteReview(id);
      setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
      message.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      message.error('Failed to delete review');
    }
  }, []);

  const handleSearch  = useCallback(async (search: string) => {
    setSearchTerm(search);
    fetchReviews(1, 10);
    setSelectedDateRange(dateRange); // Set date range when search button is clicked
  }, [dateRange, fetchReviews]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'Course Name',
        dataIndex: 'course_name',
        key: 'course_name',
        render: (text: string, record: any) => (
          <Link to={`/course/${record.course_id}`} className="hover:underline hover:text-gold" title={`Go to course: ${text}`}>{text}</Link>
        ),
      },
      {
        title: 'Reviewer',
        dataIndex: 'reviewer_name',
        key: 'reviewer_name',
        render: (text: string) => (
          <div className="flex items-center space-x-2">
            <Avatar>{text.charAt(0)}</Avatar>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        render: (rating: number) => `${rating} ★`,
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: string) => helpers.formatDate(new Date(text))
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text: string) => helpers.formatDate(new Date(text))
      }
    ];

    if (!isDelete) {
      baseColumns.push({
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => (
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} style={{ color: 'red' }}></Button>
          </Popconfirm>
        )
      });
    }

    return baseColumns;
  }, [handleDelete, isDelete]);

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <CustomSearch 
          onSearch={handleSearch}
          placeholder="Search by reviewer name..."
        />
        <FilterDate onDateChange={(dates: [any, any] | null) => {
          setSelectedDateRange(dates);
        }} />
      </div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <Table 
          dataSource={filteredReviews} 
          columns={columns} 
          rowKey="_id" 
          pagination={{
            pageSize: pageInfo.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPageInfo({ pageNum: page, pageSize });
              fetchReviews(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              setPageInfo({ pageNum: current, pageSize: size });
              fetchReviews(current, size);
            },
            position: ['bottomLeft'],
            className: 'bg-pagination',
            itemRender: (_: number, type: "next" | "page" | "prev" | "jump-prev" | "jump-next", originalElement: React.ReactNode) => {
              if (type === 'prev') {
                return <Button icon={<LeftOutlined />}></Button>;
              }
              if (type === 'next') {
                return <Button icon={<RightOutlined />}></Button>;
              }
              return originalElement;
            },
          }} 
        />
      )}
    </div>
  );
}

export default DisplayReview;
