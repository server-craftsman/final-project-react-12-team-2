import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Course } from "../../../models/prototype/Course";
import { GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { GetBlogParams } from "../../../models/api/request/admin/blog.request.model";
import { BlogService } from "../../../services/blog/blog.service";
import { Avatar, Card, DatePicker, Button, Tag, Pagination } from "antd";
import { UserOutlined, BackwardFilled } from "@ant-design/icons";
import { UserService } from "../../../services/student/user.service";
import { formatDate } from "../../../utils/helper";
import CustomSearch from "../../generic/search/CustomSearch";
import moment from "moment";
import Lottie from "lottie-react";
import animationData from "../../../data/courseAnimation.json";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBlogCondition {
  name: string;
  is_delete: boolean;
}

interface PublicBlogProps {
  searchQuery: string;
  data?: Course[];
}

const Blog: React.FC<PublicBlogProps> = ({ searchQuery }) => {
  const [blogData, setBlogData] = useState<GetBlogResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [dateFilter, setDateFilter] = useState<moment.Moment | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const navigate = useNavigate();

  const defaultParams: GetBlogParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    searchCondition: {
      name: "",
      is_delete: false,
    },
  };

  const getSearchCondition = useCallback(
    (searchQuery: string): SearchBlogCondition => ({
      name: searchQuery || defaultParams.searchCondition.name,
      is_delete: false,
    }),
    []
  );

  const fetchBlogs = useCallback(async (query: string = searchQuery, date: moment.Moment | null = dateFilter) => {
    setLoading(true);
    setError(null);

    try {
      const searchCondition = getSearchCondition(query);
      const params: GetBlogParams = {
        pageInfo: { pageNum, pageSize },
        searchCondition,
      };

      const response = await BlogService.getPublicBlogs(params);

      if (response && response.data && Array.isArray(response.data.data?.pageData)) {
        let data = response.data.data.pageData;

        if (date) {
          data = data.filter(blog => moment(blog.created_at).isSame(date, 'day'));
        }

        data = data.filter(blog => 
          (blog.name && blog.name.toLowerCase().includes(query.toLowerCase())) ||
          (blog.description && blog.description.toLowerCase().includes(query.toLowerCase()))
        );

        setBlogData({ ...response.data.data, pageData: data });
      } else {
        throw new Error("Invalid API response structure.");
      }
    } catch (error) {
      setError("Failed to fetch blogs.");
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, getSearchCondition, pageNum, pageSize, dateFilter]);

  useEffect(() => {
    fetchBlogs(searchQuery, dateFilter);
  }, [searchQuery, dateFilter, fetchBlogs]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPageNum(page);
    if (pageSize) setPageSize(pageSize);
  };

  const fetchUserAvatar = useCallback(async (userId: string) => {
    try {
      const response = await UserService.getUserDetails(userId);
      if (response.data?.data?.avatar_url) {
        setUserAvatars(prev => ({
          ...prev,
          [userId]: response.data.data.avatar_url
        }));
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  }, []);

  useEffect(() => {
    if (blogData?.pageData) {
      blogData.pageData.forEach(blog => {
        if (blog.user_id && !userAvatars[blog.user_id]) {
          fetchUserAvatar(blog.user_id);
        }
      });
    }
  }, [blogData, fetchUserAvatar]);

  const filteredData = blogData?.pageData?.filter(
    (blog) =>
      ((blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!dateFilter || moment(blog.created_at).isSame(dateFilter, 'day'))
  );

  const fetchRelatedBlogs = useCallback(async () => {
    const nextPageNum = pageNum + 1;
    const params: GetBlogParams = {
      pageInfo: { pageNum: nextPageNum, pageSize },
      searchCondition: getSearchCondition(searchQuery),
    };

    try {
      const response = await BlogService.getPublicBlogs(params);
      if (response && response.data && Array.isArray(response.data.data?.pageData)) {
        return response.data.data.pageData;
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
    return [];
  }, [pageNum, pageSize, searchQuery, getSearchCondition]);

  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchRelatedBlogs().then(setRelatedBlogs as unknown as any);
  }, [fetchRelatedBlogs]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="py-4 grid grid-cols-12 gap-4">
          {/* Left Content */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <CustomSearch onSearch={(query) => fetchBlogs(query, dateFilter)} placeholder="Search blogs..." className="w-full" />
              <DatePicker 
                onChange={(date) => {
                  const momentDate = date ? moment(date.toDate()) : null;
                  setDateFilter(momentDate);
                  fetchBlogs(searchQuery, momentDate);
                }} 
                className="w-full lg:w-1/2" 
              />
            </div>
            <Button
              type="primary"
              icon={<BackwardFilled />}
              size="large"
              style={{
                backgroundColor: "#1a237e",
                borderRadius: "9999px",
                fontSize: "16px",
                width: "100%",
                maxWidth: "200px"
              }}
              onClick={() => navigate('/')}
            >
              Back to Home  
            </Button>
          </div>

          {/* Center Content */}
          <div className="col-span-12 lg:col-span-6">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Lottie animationData={animationData} loop={true} />
              </motion.div>
            )}
            {error && <p className="error">{error}</p>}

            <div className="grid grid-cols-1 gap-6">
              {filteredData?.map((blog) => (
                <Link to={`/blog-details/${blog._id}`} key={blog._id}>
                  <Card
                    className="rounded-lg shadow-lg p-4 lg:p-6 bg-white flex transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      marginBottom: "20px",
                      boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div className="flex flex-col lg:flex-row w-full">
                      <div className="w-full lg:w-3/10 flex-shrink-0 mb-4 lg:mb-0">
                        {blog.image_url && (
                          <img
                            alt={blog.name}
                            src={blog.image_url}
                            className="object-cover rounded-lg w-full h-[200px] lg:w-[260px] lg:h-[260px]"
                          />
                        )}
                      </div>

                      <div className="w-full lg:w-7/10 lg:pl-6 flex flex-col justify-between">
                        <div className="flex items-center mb-4">
                          <Avatar 
                            src={userAvatars[blog.user_id]}
                            size="large"
                            icon={!userAvatars[blog.user_id] && <UserOutlined />}
                          />
                          <div className="ml-4">
                            <p className="font-bold text-base lg:text-lg">{blog.user_name}</p>
                            <p className="text-gray-500 text-xs lg:text-sm">
                              {formatDate(new Date(blog.created_at))}
                            </p>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <p className="font-semibold mb-3 text-xl lg:text-2xl uppercase">{blog.name}</p>
                          <p className="text-gray-600 mb-2 text-sm lg:text-base">{blog.description}</p>
                          <p className="text-gray-600 italic font-medium">
                            <Tag className="bg-gradient-tone mr-2 rounded px-3 py-1 text-xs font-semibold uppercase text-white">{blog.category_name}</Tag>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <Pagination
              current={pageNum}
              pageSize={pageSize}
              total={blogData?.pageInfo?.totalItems || 0}
              onChange={handlePageChange}
              className="mt-4"
              responsive
            />
          </div>

          {/* Right Content */}
          <div className="col-span-12 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Related Blogs</h2>
            <div className="grid grid-cols-1 gap-4">
              {relatedBlogs.map((blog) => (
                <Link to={`/blog-details/${blog._id}`} key={blog._id}>
                  <Card 
                    className="rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300"
                    hoverable
                  >
                    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={blog.image_url} 
                          alt={blog.name} 
                          className="object-cover rounded-lg w-full h-[200px] lg:w-[100px] lg:h-[100px]"
                        />
                      </div>

                      <div className="flex-shrink-0">
                        <Avatar
                          src={userAvatars[blog.user_id]}
                          size="large"
                          icon={!userAvatars[blog.user_id] && <UserOutlined />}
                          className="border-2 border-indigo-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-center lg:text-left">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {blog.name}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {blog.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Blog;
