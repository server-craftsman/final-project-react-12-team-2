import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <div>
      <h1 className="text-xl font-bold uppercase">{blog?.name}</h1>
      <p>{blog?.description}</p>
      {/* Display additional blog details as needed */}
    </div>
  );
};

export default BlogDetails;
