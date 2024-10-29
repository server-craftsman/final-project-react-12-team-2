import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row, Col } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import { CategoryService } from "../../../services/category/category.service";
import { UpdateCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { Category, GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";
import TinyMCEEditor from "../../generic/tiny/TinyMCEEditor";
import { parseTinyEditor } from "../../../utils";
import { Rule } from "antd/es/form";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state, setState] = useState<{
    category: GetCategoryResponse | null;
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

  const fetchCategoryDetails = useCallback(async (categoryId: string) => {
    try {
      const res = await CategoryService.getCategoryDetails(categoryId);
      const categoryData = res.data.data;
      setState((prev) => ({ ...prev, category: categoryData }));
      form.setFieldsValue(categoryData);
    } catch (error) {
      message.error("Failed to fetch category details. Please try again.");
    }
  }, [form]);

  useEffect(() => {
    if (id) {
      fetchCategoryDetails(id);
    }
  }, [id, fetchCategoryDetails]);

  const handleFormSubmit = useCallback(async (values: UpdateCategoryParams) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await CategoryService.updateCategory(id as string, values);
      message.success("Category updated successfully");
      navigate("/admin/categories");
    } catch (error) {
      message.error("Failed to update category. Please try again.");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [id, navigate]);

  const editChange = (value: string, editor: any) => {
    form.setFieldsValue({ description: value });
    parseTinyEditor.updateTinyMCEContent("description-editor", value);
    editor.selection.select(editor.getBody(), true);
    editor.selection.collapse(false);
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
            <TinyMCEEditor initialValue={state.category?.pageData?.[0]?.description || ""} onEditorChange={editChange} />
        </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={state.loading}>
          Save
        </Button>
        <Link to="/admin/categories">
          <Button className="ml-3">Back</Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;
