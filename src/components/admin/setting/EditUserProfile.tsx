import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Avatar, Upload } from "antd";
import { Rule } from "antd/es/form";
import moment from "moment";
import dayjs from "dayjs";
import { UserService } from "../../../services/admin/user.service";
import { GetCurrentUserResponse } from "../../../models/api/responsive/authentication/auth.responsive.model";
import { helpers } from "../../../utils";
import { UpdateUserParams } from "../../../models/api/request/users/user.request.model";
import { UploadOutlined } from "@ant-design/icons";
// import { handleUploadFile } from "../../../utils/upload";
import { BaseService } from "../../../services/config/base.service";
import { ROUTER_URL } from "../../../const/router.path";
import Editor from "../../generic/tiny/Editor";
// import { parseTinyEditor } from "../../../utils";

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    user: null as GetCurrentUserResponse | null,
    uploading: false,
    selectedFile: null as File | null
  });

  const validationRules = useMemo(
    () => ({
      name: [{ required: true, message: "Please enter the name" }],
      email: [
        { required: true, message: "Please enter the email address" },
        { type: "email", message: "Please enter a valid email address" }
      ],
      phone_number: [
        { required: true, message: "Please enter the phone number" },
        { pattern: /^[0-9]+$/, message: "Please enter a valid phone number" }
      ],
      description: [{ required: true, message: "Please enter the description" }],
      dob: [
        { required: true, message: "Please enter the date of birth" },
        {
          validator: (_: unknown, value: moment.Moment | null) => {
            if (!value) {
              return Promise.reject(new Error("Date of birth is required"));
            }
            const today = moment().startOf("day");
            if (value.isValid() && value.isBefore(today) && value.isAfter(moment().subtract(100, "years"))) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Please enter a valid date of birth within the last 100 years"));
          }
        }
      ]
    }),
    []
  );

  const fetchUserDetails = useCallback(
    async (userId: string) => {
      try {
        const res = await UserService.getUserDetails(userId);
        const userData = res.data.data;

        setState((prev) => ({
          ...prev,
          user: {
            success: true,
            data: {
              ...userData,
              verification_token_expires: userData.verification_token_expires?.toString() || "-",
              created_at: userData.created_at ? helpers.formatDate(new Date(userData.created_at)) : "-",
              updated_at: userData.updated_at ? helpers.formatDate(new Date(userData.updated_at)) : "-",
              dob: userData.dob || null
              // description: userData.description || ""
            }
          }
        }));

        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          role: userData.role,
          status: userData.status ? "Active" : "Inactive",
          description: userData.description || "",
          dob: userData.dob ? moment(userData.dob) : null
        });
      } catch (error) {
        helpers.notificationMessage("Failed to fetch user details. Please try again.", "error");
      }
    },
    [form]
  );

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id, fetchUserDetails]);

  const handleFormSubmit = useCallback(
    async (values: UpdateUserParams) => {
      setState((prev) => ({ ...prev, uploading: true }));
      try {
        let avatarUrl = state.user?.data.avatar_url || "";

        if (state.selectedFile) {
          const uploadedUrl = await BaseService.uploadFile(state.selectedFile, "image");
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
          }
        }

        // const description = parseTinyEditor.getTinyMCEContent("description-editor") || "";

        const updatedValues = {
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          description: values.description || "",
          dob: values.dob ? helpers.formatDate(new Date(values.dob)) : null,
          avatar_url: avatarUrl,
          video_url: "",
          bank_name: "",
          bank_account_no: "",
          bank_account_name: ""
        };

        await UserService.updateUser(id as string, updatedValues as UpdateUserParams);
        helpers.notificationMessage("Profile updated successfully", "success");
        navigate(ROUTER_URL.ADMIN.INFO);
      } catch (error: any) {
        helpers.notificationMessage("Failed to update profile. Please try again.", "error");
      } finally {
        setState((prev) => ({ ...prev, uploading: false }));
      }
    },
    [id, navigate, state.user?.data.avatar_url, state.selectedFile, form]
  );

  const handleImageUpload = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      helpers.notificationMessage("File size should not exceed 5MB", "error");
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      helpers.notificationMessage("Please upload an image file (JPEG, PNG, or GIF)", "error");
      return false;
    }

    setState((prev) => ({
      ...prev,
      selectedFile: file,
      user: prev.user
        ? {
            ...prev.user,
            data: {
              ...prev.user.data,
              avatar_url: URL.createObjectURL(file)
            }
          }
        : null
    }));

    return false;
  }, []);

  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };

  if (!state.user) {
    return <div>User not found</div>;
  } else {
    return (
      <div className="max-w-10xl mx-auto rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#1a237e]">Edit User Profile</h1>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4">
          <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="group relative">
              <Avatar src={state.user.data.avatar_url} size={120} className="border-4 border-[#1a237e] shadow-lg transition-transform hover:scale-105" />
              <Upload accept="image/*" showUploadList={false} beforeUpload={handleImageUpload}>
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <UploadOutlined className="text-2xl text-white" />
                </div>
              </Upload>
            </div>

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h3 className="text-lg font-medium text-[#1a237e]">{state.user.data.name}</h3>
            </div>
          </div>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Name</span>} name="name" rules={validationRules.name as Rule[]}>
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Email Address</span>} name="email" rules={validationRules.email as Rule[]}>
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Phone Number</span>} name="phone_number" rules={validationRules.phone_number as Rule[]}>
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Description</span>} name="description" rules={validationRules.description as Rule[]}>
            <Editor initialValue={state.user?.data.description || ""} onEditorChange={editChange} />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Date of Birth</span>} name="dob" rules={validationRules.dob as Rule[]}>
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]"
              disabledDate={(current) => {
                const today = moment().endOf("day");
                const hundredYearsAgo = moment().subtract(100, "years").startOf("day");
                return current && (current > today || current < hundredYearsAgo);
              }}
              placement="bottomLeft"
              defaultPickerValue={state.user?.data.dob ? dayjs(state.user.data.dob) : dayjs()}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item className="mt-6 flex justify-end gap-4">
            <Button type="primary" htmlType="submit" className="mr-2 h-10 border-none bg-[#1a237e] px-8 hover:bg-[#0d1453]">
              Update
            </Button>
            <Button onClick={() => navigate(ROUTER_URL.ADMIN.INFO)} className="h-10 border-[#1a237e] px-8 text-[#1a237e] hover:border-[#0d1453] hover:text-[#0d1453]">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default memo(EditUserProfile);
