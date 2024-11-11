import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "antd";
import { BackwardFilled } from "@ant-design/icons";
import { BlogService } from "../../../services/blog/blog.service";
import { getPublicBlogsDetails } from "../../../models/api/responsive/admin/blog.responsive.model";

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<getPublicBlogsDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("Blog ID is not provided.");
      setError("No blog ID provided.");
      setLoading(false);
      return;
    }

    const fetchBlogDetails = async () => {
      try {
        const response = await BlogService.getPublicBlogsDetails(id);
        if (response && response.data) {
          setBlog(response.data.data);
        } else {
          throw new Error("No data found.");
        }
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
        setError("Failed to load blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Thêm hàm format ngày giờ
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="max-w-8xl mx-auto my-8 rounded-md bg-gray-100 p-8 shadow-md">
      <div className="mb-6">
        <Link to="/blog">
          <Button
            type="primary"
            icon={<BackwardFilled />}
            size="large"
            style={{
              backgroundColor: "#1a237e",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Back
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{blog?.name}</h1>
          <h1 className="text-1xl mb-2 ml-5 pt-2 font-bold text-gray-900">Category: {blog?.category_name}</h1>
          <h1 className="text-1xl mb-2 ml-5 font-bold text-gray-900">Author: {blog?.user_name}</h1>
          <p className="mb-2 ml-5 text-gray-500">Created on: {formatDate(blog?.created_at?.toString())}</p>
          <p className="mb-2 ml-5 text-gray-500">Updated on: {formatDate(blog?.updated_at?.toString())}</p>
          <p className="mb-6 text-xl text-gray-700">{blog?.description}</p>

          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-900">Content:</p>
            <div className="break-words text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="sticky top-8">
            <img src={blog?.image_url} alt="Blog visual" className="h-[400px] w-full rounded-md object-cover shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
