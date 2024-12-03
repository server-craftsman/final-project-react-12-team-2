import { Button, Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";
import { CategoryService } from "../../../services/category/category.service";
// import TinyMCEEditor from "../../../components/generic/tiny/TinyMCEEditor";
import Editor from "../../generic/tiny/Editor";
import { notificationMessage } from "../../../utils/helper";

interface CreateCategoryProps {
  onCategoryCreated: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ onCategoryCreated }) => {
  const [categories, setCategories] = useState<GetCategoryResponse | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [form] = useForm();
  const [editorContent, setEditorContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategory({
        pageInfo: { pageNum: 1, pageSize: 10 }, // Adjust pageSize as needed
        searchCondition: { keyword: "", is_parent: false, is_delete: false }
      });
      setCategories(response.data?.data ? response.data.data : null);
    } catch (error) {
      notificationMessage("An unexpected error occurred while fetching categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      // Extract only the necessary fields from the form
      const { name, parent_category_id } = form.getFieldsValue();
      // Create a new category object with only the necessary fields
      const newCategory = {
        name,
        description: editorContent,
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
      setEditorContent("");
      setOpen(false);
      notificationMessage("Category created successfully!", "success");
      onCategoryCreated();
    } catch (error) {
      console.error("Error creating category:", error);
      notificationMessage("Failed to create category. Please try again.", "error");
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    fetchCategories();
    setEditorContent("");
    setCategories(null);
    setEditorKey(prevKey => prevKey + 1);
    setOpen(true);
  };

  return (
    <div>
      <Button className="bg-gradient-tone mb-4 text-white" onClick={handleOpenModal}>
        Create New Category
      </Button>
      <Modal open={isOpen} onCancel={() => setOpen(false)} footer={[
        <Button key="back" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" className="bg-gradient-tone" onClick={() => form.submit()}>
          OK
        </Button>
      ]} width={800}>
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input category name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" rules={[{ required: true, message: "Please input category description" }]}>
            <Editor
              key={editorKey}
              initialValue={editorContent}
              onEditorChange={(content: string) => {
                setEditorContent(content);
              }}
            />
          </Form.Item>
          <Form.Item label="Parent Category" name="parent_category_id">
            <Select>
              {categories && categories.pageData && categories.pageData.length > 0 ? (
                categories.pageData
                  .filter((category) => !category.parent_category_id)
                  .map((category) => (
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
