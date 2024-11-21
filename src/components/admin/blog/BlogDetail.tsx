import React, { useEffect, useState } from "react";
import { Col, Form, message, Modal, Row, Typography } from "antd";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
import { BlogService } from "../../../services/blog/blog.service";
import { GetBlogDetailsResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import parse from "html-react-parser";
import { helpers } from "../../../utils";
const BlogDetail: React.FC<{ visible: boolean; onClose: () => void; blogId: string | null }> = ({ visible, onClose, blogId }) => {
  const [blog, setBlog] = useState<GetBlogDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => { 
    const fetchBlogDetails = async () => {
      try {
        const response = await BlogService.getBlogDetails(blogId!);
        setBlog(response.data.data);
      } catch (error) {
        message.error("Failed to fetch blog details");
        console.error("Failed to fetch blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchBlogDetails();
    }
  }, [blogId, visible]);
  return (
    <Modal 
    width={1000}
    open={visible} 
      onCancel={onClose}
      footer={null}
      title="Blogs Details"
    >
      {loading ? (
        <LoadingAnimation />
      ) : (
        blog && (
          <Form layout="vertical">
            <Row gutter={24}>
              <Col span={12} style={{ borderRight: '1px solid #d9d9d9', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}>
                  <Typography.Text> <b>Category Name:</b> {blog.category_name}</Typography.Text>
                  <br />
                  <Typography.Text> <b>User Name:</b> {blog.user_name}</Typography.Text>
                  <br />
                  <Typography.Text> <b>Name:</b> {blog.name}</Typography.Text>
                  <br />
                  <Typography.Text> <b>Description:</b> {blog.description}</Typography.Text>
                  <br />
                  <Typography.Text> <b>Created At:</b> {helpers.formatDate(blog.created_at)}</Typography.Text>
                  <br />
                  <Typography.Text> <b>Updated At:</b> {helpers.formatDate(blog.updated_at)}</Typography.Text>
                  <br />
                  <Typography.Text> <b>Image:</b> <img src={blog.image_url} alt="Blog Image" style={{ width: '100%' }} /></Typography.Text>
             </Col>
              <Col span={12} style={{ paddingLeft: '16px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}>
                <Form.Item label="Content">
                  <div>{parse(blog.content)}</div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )
      )}
    </Modal>
  );
};

export default BlogDetail;
