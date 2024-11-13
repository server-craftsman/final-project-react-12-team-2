import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, Button, Card } from "antd";
import { BackwardFilled  } from "@ant-design/icons"; 
import { BlogService } from "../../../services/blog/blog.service";
import { GetBlogResponse, getPublicBlogsDetails } from "../../../models/api/responsive/admin/blog.responsive.model";
import { UserService } from "../../../services/student/user.service";
import { formatDate } from "../../../utils/helper";
import { UserOutlined } from "@ant-design/icons";
import { useCallback } from "react";

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<getPublicBlogsDetails | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<GetBlogResponse | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [loadingRelated, setLoadingRelated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});

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
    if (relatedBlogs?.pageData) {
      relatedBlogs.pageData.forEach(blog => {
        if (blog.user_id && !userAvatars[blog.user_id]) {
          fetchUserAvatar(blog.user_id);
        }
      });
    }
  }, [relatedBlogs, fetchUserAvatar]);

  const fetchData = async () => {
    if (!id) {
      setError("No blog ID provided.");
      // setLoading(false);
      return;
    }

    try {
      const blogResponse = await BlogService.getPublicBlogsDetails(id);
      if (blogResponse?.data) {
        setBlog(blogResponse.data.data);
      }

      const relatedResponse = await BlogService.getPublicBlogs({
        pageInfo: { pageNum: 1, pageSize: 10 },
        searchCondition: { name: "", is_delete: false }
      });

      if (relatedResponse?.data) {
        const filteredBlogs = relatedResponse.data.data?.pageData
          ?.filter(blog => blog._id !== id)
          ?.sort(() => Math.random() - 0.5)
          ?.slice(0, 3);
        setRelatedBlogs({ ...relatedResponse.data.data, pageData: filteredBlogs });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      // setLoading(false);
      // setLoadingRelated(false);
      console.log("Fetching data completed");
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const BlogCard = ({ blog }: { blog: getPublicBlogsDetails }) => (
    <Card className="h-full rounded-lg shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative h-48">
        <img alt={blog.name} src={blog.image_url} className="w-full h-full object-cover rounded-t-lg" />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar 
            src={userAvatars[blog.user_id]} 
            icon={!userAvatars[blog.user_id] && <UserOutlined />}
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{blog.user_name}</p>
            <p className="text-xs text-gray-500">{formatDate(new Date(blog.created_at || ''))}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{blog.description}</p>
        <span className="bg-[#1a237e] text-white text-xs px-2 py-1 rounded">
          {blog.category_name}
        </span>
      </div>
    </Card>
  );

  return (
    <div className="bg-gray-100 p-8 rounded-md shadow-md max-w-8xl mx-auto my-8">
      <Link to="/blog">
        <Button
          type="primary"
          icon={<BackwardFilled />}
          size="large"
          className="mb-6"
          style={{
            backgroundColor: "#1a237e",
            borderRadius: "9999px",
            fontSize: "18px",
          }}
        >
          Back to Blogs
        </Button>
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog?.name}</h1>
          <h1 className="text-xl font-bold text-gray-900 mb-2 ml-5 pt-2">Category: {blog?.category_name}</h1>
          <h1 className="text-xl font-bold text-gray-900 mb-2 ml-5">Author: {blog?.user_name}</h1>

          <p className="text-gray-500 mb-2 ml-5"> Created on: {blog?.created_at ? formatDate(new Date(blog.created_at)) : ''}</p>
          <p className="text-gray-500 mb-2 ml-5">Updated on: {blog?.updated_at ? formatDate(new Date(blog.updated_at)) : ''}</p>
          
          <p className="text-gray-700 mb-6 text-xl">{blog?.description}</p>
          <div className="text-gray-600 text-lg break-words" dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />
        </div>

        <div className="order-1 md:order-2">
          <div className="sticky top-8">
            <img src={blog?.image_url} alt="Blog visual" className="rounded-md shadow-md w-full h-[600px] object-cover hover:scale-105 hover:shadow-2xl transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Related Blogs */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedBlogs?.pageData?.map((blog) => (
            <Link to={`/blog-details/${blog._id}`} key={blog._id}>
              <BlogCard blog={blog} />
            </Link>
          ))}
        </div>
        {/* {loadingRelated && <p className="text-center py-4">Loading related blogs...</p>} */}
      </div>
    </div>
  );
};

export default BlogDetails;
