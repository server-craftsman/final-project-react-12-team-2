import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Course } from "../../../models/prototype/Course";
import { GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { GetBlogParams } from "../../../models/api/request/admin/blog.request.model";
import { BlogService } from "../../../services/blog/blog.service";
import { Avatar, Card } from "antd";
import { InfoCircleFilled, UserOutlined } from "@ant-design/icons";
import { UserService } from "../../../services/student/user.service";

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
//   const navigate = useNavigate();

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

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params: GetBlogParams = {
        pageInfo: defaultParams.pageInfo,
        searchCondition,
      };

      const response = await BlogService.getPublicBlogs(params);

      if (response && response.data && Array.isArray(response.data.data?.pageData)) {
        setBlogData(response.data.data);
      } else {
        throw new Error("Invalid API response structure.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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
      (blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      {loading && <p>Loading blogs...</p>}
      {error && <p className="error">{error}</p>}

      {/* Card Grid with Single Column */}
      <div className="grid grid-cols-1 gap-6">
        {filteredData?.map((blog) => (
          <Card
            key={blog._id}
            className="rounded-lg shadow-lg p-4 bg-white flex transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "16px",
              boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* 3/7 Split Layout */}
            <div className="flex w-full">
              {/* 3 Parts: Image Section with Fixed Size */}
              <div className="w-3/10 flex-shrink-0">
                {blog.image_url && (
                  <img
                    alt={blog.name}
                    src={blog.image_url}
                    className="object-cover rounded-lg"
                    style={{ width: "240px", height: "240px" }}
                  />
                )}
              </div>

              {/* 7 Parts: Content Section */}
              <div className="w-7/10 pl-4 flex flex-col justify-between">
                {/* Header with Avatar, Author's Name, and Date */}
                <div className="flex items-center mb-2">
                  <Avatar 
                    src={userAvatars[blog.user_id]}
                    size="large"
                    icon={!userAvatars[blog.user_id] && <UserOutlined />}
                  />
                  <div className="ml-3">
                    <p className="font-10px text-lg">{blog.user_name}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="flex-grow">
                  <p className=" font-semibold mb-2 text-xl uppercase">{blog.name}</p>
                  <p className="text-gray-600">{blog.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                  <Link 
                    to={`/blog-details/${blog._id}`} 
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    {/* <span className="text-lg font-medium">View details</span> */}
                    <InfoCircleFilled style={{ fontSize: '20px' }} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
