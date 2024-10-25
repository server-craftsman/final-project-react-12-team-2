import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker, Avatar, Upload } from "antd";
import { Rule } from "antd/es/form";
import moment from "moment";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { UserService } from "../../../services/admin/user.service";
import { GetCurrentUserResponse } from "../../../models/api/responsive/authentication/auth.responsive.model";
import { formatDate } from "../../../utils/helper";
import { UpdateUserParams } from "../../../models/api/request/users/user.request.model";
import { UploadOutlined } from '@ant-design/icons';
import cloudinaryConfig from "../../../services/config/cloudinaryConfig";

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Memoize form instance to prevent unnecessary re-renders
  const [form] = Form.useForm();
  
  // Combine related state into a single object to reduce state updates
  const [state, setState] = useState({
    user: null as GetCurrentUserResponse | null,
    uploading: false,
    selectedFile: null as File | null
  });

  // Memoize validation rules to prevent recreation on each render
  const validationRules = useMemo(() => ({
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
  }), []);

  // Memoize the fetch user function
  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      const res = await UserService.getUserDetails(userId);
      const userData = res.data.data;
      
      setState(prev => ({
        ...prev,
        user: {
          success: true,
          data: {
            ...userData,
            verification_token_expires: userData.verification_token_expires.toString(),
            created_at: formatDate(new Date(userData.created_at)),
            updated_at: formatDate(new Date(userData.updated_at)),
            dob: userData.dob || null,
          }
        }
      }));

      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role,
        status: userData.status ? "Active" : "Inactive",
        description: userData.description || '',
        dob: userData.dob ? moment(userData.dob, 'YYYY-MM-DD') : null,
      });
    } catch (error) {
      message.error('Failed to fetch user details');
    }
  }, [form]);

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id, fetchUserDetails]);

  // Memoize handlers to prevent recreation on each render
  const handleFormSubmit = useCallback(async (values: UpdateUserParams) => {
    setState(prev => ({ ...prev, uploading: true }));
    try {
      let avatarUrl = state.user?.data.avatar_url || "";
      
      if (state.selectedFile) {
        const formData = new FormData();
        formData.append('file', state.selectedFile);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('cloud_name', cloudinaryConfig.cloudName);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Upload failed');
        }
        
        if (data.secure_url) {
          avatarUrl = data.secure_url;
        }
      }

      // Update user profile with all values including new avatar URL
      const updatedValues = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        description: values.description || '',
        // Ensure proper date formatting when submitting
        dob: values.dob ? moment(values.dob, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
        avatar_url: avatarUrl,
        video_url: "",
        bank_name: "",
        bank_account_no: "",
        bank_account_name: "",
      };

      await UserService.updateUser(id as string, updatedValues as UpdateUserParams);
      message.success("Profile updated successfully");
      navigate("/admin/admin-info");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  }, [id, navigate, state.user?.data.avatar_url, state.selectedFile]);

  const handleImageUpload = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('File size should not exceed 5MB');
      return false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Please upload an image file (JPEG, PNG, or GIF)');
      return false;
    }

    setState(prev => ({
      ...prev,
      selectedFile: file,
      user: prev.user ? {
        ...prev.user,
        data: {
          ...prev.user.data,
          avatar_url: URL.createObjectURL(file)
        }
      } : null
    }));

    return false;
  }, []);

  // Memoize the editor configuration
  const editorConfig = useMemo(() => ({
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
  }), []);

  if (!state.user) {
    return <div>User not found</div>;
  }

  return (
    <div className="mx-auto max-w-10xl p-8 bg-white shadow-2xl rounded-xl">
      <h1 className="mb-6 text-3xl text-center font-bold text-[#1a237e]">Edit User Profile</h1>
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFormSubmit}
        className="space-y-4"
      >
        <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center gap-6">
          <div className="relative group">
            <Avatar 
              src={state.user.data.avatar_url} 
              size={120} 
              className="border-4 border-[#1a237e] shadow-lg transition-transform hover:scale-105" 
            />
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => handleImageUpload(file)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                <UploadOutlined className="text-white text-2xl" />
              </div>
            </Upload>
          </div>
          
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h3 className="text-lg font-medium text-[#1a237e]">{state.user.data.name}</h3>
          </div>
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
            initialValue={state.user?.data.description || ''}
            init={editorConfig}
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

export default memo(EditUserProfile);