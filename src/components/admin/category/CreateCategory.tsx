import { Button, Form, Input, message, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState, useMemo } from "react";
import { GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";
import { CategoryService } from "../../../services/category/category.service";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { getTinyMCEContent, updateTinyMCEContent } from "../../../utils/parse.tiny.editor";

const CreateCategory: React.FC = () => {
  const [categories, setCategories] = useState<GetCategoryResponse | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [form] = useForm();

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategory({
        pageInfo: { pageNum: 1, pageSize: 100 }, // Adjust pageSize as needed
        searchCondition: { keyword: "", is_parent: false, is_delete: false }
      });
      setCategories(response.data?.data ? response.data.data : null);
    } catch (error) {
      message.error("An unexpected error occurred while fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      // Extract only the necessary fields from the form
      const { name, parent_category_id } = form.getFieldsValue();
      const description = getTinyMCEContent("description-editor") || "";

      // Log the values to debug
      console.log("Form Values:", { name, description, parent_category_id });

      // Create a new category object with only the necessary fields
      const newCategory = {
        name,
        description,
        parent_category_id
      };

      // Simulate API call to create a new category
      const createdCategory = await CategoryService.createCategory(newCategory);

      // Ensure createdCategory.data has all necessary properties
      const resolvedCategory: GetCategoryResponse = {
        pageData: [
          {
            _id: createdCategory.data.data._id,
            name: createdCategory.data.data.name,
            parent_category_id: createdCategory.data.data.parent_category_id,
            description: createdCategory.data.data.description,
            created_at: createdCategory.data.data.created_at,
            updated_at: createdCategory.data.data.updated_at,
            is_deleted: createdCategory.data.data.is_deleted
            // Add any other required properties here
          }
        ],
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1
        }
      };

      setCategories(resolvedCategory);

      form.resetFields();
      updateTinyMCEContent("description-editor", ""); // Clear the editor content
      setOpen(false);
      message.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Failed to create category. Please try again.");
    }
  };

  const editorConfig = useMemo(
    () => ({
      height: 300,
      menubar: false,
      plugins: ["advlist autolink lists link image charmap preview anchor searchreplace", "visualblocks code fullscreen media table paste code help wordcount"].join(" "),
      toolbar: ["undo redo | formatselect | bold italic", "alignleft aligncenter alignright alignjustify", "bullist numlist | link image | code"].join(" | "),
      skin: "oxide-dark",
      content_css: "dark",
      resize: false,
      statusbar: false
    }),
    []
  );

  return (
    <div>
      <Button className="bg-gradient-tone mb-4 text-white" onClick={() => setOpen(true)}>
        Create New Category
      </Button>
      <Modal open={isOpen} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input category name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input category description" }]}>
            <Editor
              apiKey={TINY_API_KEY}
              init={editorConfig}
              id="description-editor"
              onEditorChange={(content) => {
                form.setFieldsValue({ description: content });
                console.log("Content:", content);
              }}
              onBlur={() => form.validateFields(["description"])}
            />
          </Form.Item>
          <Form.Item label="Parent Category" name="parent_category_id">
            <Select>
              {categories && categories.pageData && categories.pageData.length > 0 ? (
                categories.pageData.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  No categories available
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateCategory;
