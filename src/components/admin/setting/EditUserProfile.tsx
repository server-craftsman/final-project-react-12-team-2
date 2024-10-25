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

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<GetCurrentUserResponse | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    UserService.getUserDetails(id as string).then((res) => {
      const userData = res.data.data;
      setUser({
        success: true,
        data: {
          ...userData,
          verification_token_expires: userData.verification_token_expires.toString(),
          created_at: formatDate(new Date(userData.created_at)),
          updated_at: formatDate(new Date(userData.updated_at)),
          dob: userData.dob ? new Date(userData.dob) : new Date(),
        }
      });

      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role,
        status: userData.status ? "Active" : "Inactive",
        description: userData.description || '',
        dob: userData.dob ? moment(userData.dob) : null,
      });
    });
  }, [id, form]);

  const handleFormSubmit = (values: UpdateUserParams) => {
    const updatedValues = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      description: values.description || '',
      dob: values.dob ? moment(values.dob).format('YYYY-MM-DD') : null,
      avatar_url: user?.data.avatar_url || "",
      video_url: "",
      bank_name: "",
      bank_account_no: "",
      bank_account_name: "",
    };

    UserService.updateUser(id as string, updatedValues as UpdateUserParams)
      .then(() => {
        message.success("Profile updated successfully");
        navigate("/admin/admin-info");
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
          if (!value) {
            return Promise.reject(new Error("Date of birth is required"));
          }
          
          if (value.isValid() && 
              value.isBefore(moment()) && 
              value.isAfter(moment().subtract(100, "years"))) {
            return Promise.resolve();
          }
          
          return Promise.reject(
            new Error("Please enter a valid date of birth within the last 100 years")
          );
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-10xl p-8 bg-white shadow-2xl rounded-xl">
      <h1 className="mb-6 text-3xl text-center font-bold text-[#1a237e]">Edit User Profile</h1>
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFormSubmit}
        className="space-y-4"
      >
        <div className="mb-4 flex">
          <Avatar src={user.data.avatar_url} size={100} className="border-2 border-[#1a237e]" />
        </div>
        <Form.Item
          label={<span className="text-[#1a237e] font-medium">Name</span>}
          name="name"
          rules={validationRules.name as Rule[]}
        >
          <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>
        <Form.Item
          label={<span className="text-[#1a237e] font-medium">Email Address</span>}
          name="email"
          rules={validationRules.email as Rule[]}
        >
          <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>
        <Form.Item
          label={<span className="text-[#1a237e] font-medium">Phone Number</span>}
          name="phone_number"
          rules={validationRules.phone_number as Rule[]}
        >
          <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>
       
        <Form.Item
          label={<span className="text-[#1a237e] font-medium">Description</span>}
          name="description"
          rules={validationRules.description as Rule[]}
        >
          <Editor
            apiKey={TINY_API_KEY}
            id="description-editor"
            initialValue={user?.data.description || ''}
            init={{
              height: 300,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              tracking: false,
              promotion: false,
              skin: 'oxide',
              content_css: 'default'
            }}
            onEditorChange={(content) => {
              form.setFieldsValue({ description: content });
            }}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-[#1a237e] font-medium">Date of Birth</span>}
          name="dob"
          rules={validationRules.dob as Rule[]}
        >
          <DatePicker 
            format="YYYY-MM-DD"
            className="w-full rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]"
            disabledDate={(current) => {
              return current && (
                current > moment().endOf('day') ||
                current < moment().subtract(100, 'years')
              );
            }}
          />
        </Form.Item>
        <Form.Item className="flex justify-end gap-4 mt-6">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#1a237e] hover:bg-[#0d1453] border-none h-10 px-8 mr-2"
          >
            Update
          </Button>
          <Button
            onClick={() => navigate("/admin/admin-info")}
            className="border-[#1a237e] text-[#1a237e] hover:text-[#0d1453] hover:border-[#0d1453] h-10 px-8"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
