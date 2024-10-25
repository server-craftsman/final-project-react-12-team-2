import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker, Avatar } from "antd";
import { Rule } from "antd/es/form";
import moment from "moment";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { UserService } from "../../../services/admin/user.service";
import { GetCurrentUserResponse } from "../../../models/api/responsive/authentication/auth.responsive.model";
import { formatDate } from "../../../utils/helper";
import { UpdateUserParams } from "../../../models/api/request/users/user.request.model";
import tinymce from "tinymce";

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<GetCurrentUserResponse | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    UserService.getUserDetails(id as string).then((res) => {
      setUser({
        success: true,
        data: {
          ...res.data.data,
          verification_token_expires: res.data.data.verification_token_expires 
            ? res.data.data.verification_token_expires.toString() 
            : "", // Provide a default value if undefined
          created_at: formatDate(new Date(res.data.data.created_at)),
          updated_at: formatDate(new Date(res.data.data.updated_at)),
          dob: new Date(res.data.data.dob), // Ensure dob is a Date object
        }
      });
      form.setFieldsValue({
        name: res.data.data.name,
        email: res.data.data.email,
        phone_number: res.data.data.phone_number,
        role: res.data.data.role,
        status: res.data.data.status ? "Active" : "Inactive", 
        description: res.data.data.description,
        dob: res.data.data.dob ? moment(res.data.data.dob) : null,
      });
    });
  }, [id, form]);

  const handleFormSubmit = (values: UpdateUserParams) => {
    const editorContent = tinymce.get('description-editor')?.getContent() || "";
    const updatedValues = {
      ...values,
      description: editorContent,
      dob: moment(values.dob).isValid() ? moment(values.dob).format("YYYY-MM-DD") : "",
      avatar_url: "",
      video_url: "",
      bank_name: "",
      bank_account_no: "",
      bank_account_name: "",
    };

    UserService.updateUser(id as string, updatedValues)
      .then(() => {
        message.success("Profile updated successfully");
        navigate("/dashboard-student/student-setting");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        message.error("Failed to update profile");
      });
  };

  if (!user) {
    return <div>User not found</div>;
  }

  const validationRules = {
    name: [{ required: true, message: "Please enter the name" }],
    email: [
      { required: true, message: "Please enter the email address" },
      {
        type: "email",
        message:
          "Please enter a valid email address. Please include a @ symbol.",
      },
    ],
    phone_number: [
      { required: true, message: "Please enter the phone number." },
      {
        pattern: /^[0-9]+$/,
        message: "Please enter a valid phone number. Only numbers are allowed.",
      },
    ],
    description: [{ required: true, message: "Please enter the description" }],
    dob: [
      { required: true, message: "Please enter the date of birth" },
      {
        validator: (_: unknown, value: moment.Moment | null) => {
          if (
            !value ||
            (value.isBefore(moment()) &&
              value.isAfter(moment().subtract(100, "years")))
          ) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error(
              "Please enter a valid date of birth within the last 100 years.",
            ),
          );
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-2xl p-5">
      <h1 className="mb-4 text-2xl font-bold">Edit User Profile</h1>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={validationRules.name as Rule[]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email Address"
          name="email"
          rules={validationRules.email as Rule[]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={validationRules.phone_number as Rule[]}
        >
          <Input />
        </Form.Item>
        <Avatar src={user.data.avatar_url} size={100} />

        <Form.Item
          label="Description"
          name="description"
          rules={validationRules.description as Rule[]}
        >
          <Editor
            apiKey={TINY_API_KEY}
            initialValue="description"
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
            }}
            onEditorChange={(content) => {
              form.setFieldsValue({ description: content });
            }}
          />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={validationRules.dob as Rule[]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button
            onClick={() => navigate("/dashboard-student/student-setting")}
            className="ml-2"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
