import { Button, Form, Input, Row, Col } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CategoryService } from "../../../services/category/category.service";
import { UpdateCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import Editor from "../../generic/tiny/Editor";
import { Rule } from "antd/es/form";
import { notificationMessage } from "../../../utils/helper";

interface EditCategoryProps {
  categoryId: string;
  onCategoryUpdated: () => void;
  onClose: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ categoryId, onCategoryUpdated, onClose }) => {
  const [form] = Form.useForm();
  const [state, setState] = useState<{
    category: Category | null;
    loading: boolean;
  }>({
    category: null,
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
    async () => {
      try {
        const res = await CategoryService.getCategoryDetails(categoryId);
        const categoryData = res.data?.data;

        if (categoryData) {
          setState((prev) => ({
            ...prev,
            category: categoryData
          }));
          form.setFieldsValue(categoryData);
        } else {
          notificationMessage("No page data available for this category.", "error");
        }
      } catch (error) {
        notificationMessage("Failed to fetch category details. Please try again.", "error");
      }
    },
    [categoryId, form]
  );

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId, fetchCategoryDetails]);

  const handleFormSubmit = useCallback(
    async (values: UpdateCategoryParams) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await CategoryService.updateCategory(categoryId, values);
        notificationMessage("Category updated successfully", "success");
        onCategoryUpdated();
        onClose();
      } catch (error) {
        notificationMessage("Failed to update category. Please try again.", "error");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [categoryId, onCategoryUpdated, onClose]
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
            <Editor initialValue={state.category?.description || ""} onEditorChange={editChange} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={state.loading} className="bg-gradient-tone">
          Save
        </Button>
        <Button onClick={onClose} className="ml-3">Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;
