import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row, Col } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CategoryService } from "../../../services/category/category.service";
import { UpdateCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
// import TinyMCEEditor from "../../generic/tiny/TinyMCEEditor";
import Editor from "../../generic/tiny/Editor";
// import { parseTinyEditor } from "../../../utils";
import { Rule } from "antd/es/form";
import { ROUTER_URL } from "../../../const/router.path";
import { ResponseSuccess } from "../../../app/interface";
import { notificationMessage } from "../../../utils/helper";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state, setState] = useState<{
    category: ResponseSuccess<Category> | null;
    categoryData: Category | null;
    loading: boolean;
  }>({
    category: null,
    categoryData: null,
    loading: false
  });

  const validationRules = useMemo(
    () => ({
      name: [{ required: true, message: "Please enter the category name" }],
      description: [{ required: true, message: "Please enter the description" }]
    }),
    []
  );

  const fetchCategoryDetails = useCallback(
    async (categoryId: string) => {
      try {
        const res = await CategoryService.getCategoryDetails(categoryId);
        const categoryData = res.data?.data;

        if (categoryData) {
          setState((prev) => ({
            ...prev,
            category: res.data,
            categoryData: categoryData
          }));
          form.setFieldsValue(categoryData);
        } else {
          notificationMessage("No page data available for this category.", "error");
        }
      } catch (error) {
        notificationMessage("Failed to fetch category details. Please try again.", "error");
      }
    },
    [form]
  );

  useEffect(() => {
    if (id) {
      fetchCategoryDetails(id);
    }
  }, [id, fetchCategoryDetails]);

  const handleFormSubmit = useCallback(
    async (values: UpdateCategoryParams) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await CategoryService.updateCategory(id as string, values);
        navigate(ROUTER_URL.ADMIN.CATEGORIES);
        notificationMessage("Category updated successfully", "success");
      } catch (error) {
        notificationMessage("Failed to update category. Please try again.", "error");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [id, navigate]
  );

  const editChange = (value: string) => {
    const strippedContent = value.replace(/<[^>]*>/g, "").trim();
    form.setFieldsValue({ description: strippedContent ? value : "" });
  };

  if (!state.category) {
    return <div>Category not found.</div>;
  }
  return (
    <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={state.category}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" name="name" rules={validationRules.name}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Description</span>} name="description" rules={validationRules.description as Rule[]}>
            <Editor initialValue={state.categoryData?.description || ""} onEditorChange={editChange} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={state.loading} className="bg-gradient-tone">
          Save
        </Button>
        <Link to={ROUTER_URL.ADMIN.CATEGORIES}>
          <Button className="ml-3">Back</Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;
