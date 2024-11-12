import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Skeleton } from 'antd';
import { ROUTER_URL } from '../../../const/router.path';
import { BlogService } from '../../../services/blog/blog.service';

interface Blog {
    id: string;
    category_id: string;
    user_id: string;
    name: string;
    description: string;
    content: string;
    status: string;
    video_url: string;
    image_url: string;
    price: string;
    discount: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

const BlogDetail: React.FC = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) {
                setError('Invalid Blog ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await BlogService.getBlogsDetails(id);
                if (response?.data?.data) {
                    setBlog(response.data.data as unknown as Blog);
                } else {
                    throw new Error('Failed to fetch blog data');
                }
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        try {
            await BlogService.deleteBlog(id);
            navigate(ROUTER_URL.ADMIN.BLOG); // Chuyển về danh sách blog sau khi xóa
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    if (loading) {
        return <Skeleton active />;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!blog) {
        return <div>Blog not found.</div>;
    }

    return (
        <div>
            <Col span={24}>
                <Form layout="vertical">
                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item label="Category ID">
                                <Input value={blog.category_id || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="User ID">
                                <Input value={blog.user_id || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Name">
                                <Input value={blog.name || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Description">
                                <Input value={blog.description || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Content">
                                <Input value={blog.content || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Status">
                                <Input value={blog.status || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Video URL">
                                <Input value={blog.video_url || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Image URL">
                                <Input value={blog.image_url || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Price">
                                <Input value={blog.price || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Discount">
                                <Input value={blog.discount || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Created At">
                                <Input value={blog.created_at || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Updated At">
                                <Input value={blog.updated_at || 'N/A'} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Is Deleted">
                                <Input value={blog.is_deleted ? 'Yes' : 'No'} readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>

            <Button
                onClick={() => navigate(`/admin/edit-courses-log/${id}`)}
                className="mr-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white"
            >
                Edit
            </Button>
            <Button
                onClick={handleDelete}
                className="mr-3 bg-gradient-to-r from-red-600 to-red-800 text-white"
            >
                Delete
            </Button>
            <Link to={ROUTER_URL.ADMIN.BLOG_DETAILS}>
                <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                    Back To Categories
                </Button>
            </Link>
        </div>
    );
};

export default BlogDetail;
