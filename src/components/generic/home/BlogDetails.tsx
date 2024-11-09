import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons"; 
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="bg-gray-100 p-8 rounded-md shadow-md max-w-8xl mx-auto my-8">
      <div className="mb-6">
        <Link to="/blog">
          <Button
            type="primary"
            icon={<LeftOutlined />}
            size="large"
            style={{
              backgroundColor: "#1a237e",
              color: "#fff",
              borderRadius: "9999px", 
              fontSize: "18px", 
              display: "flex", 
              alignItems: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
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

      <div className="mt-6 flex flex-col sm:flex-row">
        <div className="flex-1 pr-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog?.name}</h1>
          {/* <p className="text-gray-500 mb-1">Created on: {new Date(blog?.created_at).toLocaleDateString()}</p> */}
          <p className="text-gray-700 mb-6 text-xl">{blog?.description}</p>
          
          <div className="space-y-4">
            <p className="font-semibold text-lg text-gray-900">Content:</p>
            <div className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />
          </div>
        </div>

        <div className="flex-1 mt-6 sm:mt-0 sm:ml-8">
          <img
            src={blog?.image_url}
            alt="Blog visual"
            className="rounded-md shadow-md w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
