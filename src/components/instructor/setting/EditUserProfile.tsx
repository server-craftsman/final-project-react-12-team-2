import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker, Avatar, Upload } from "antd";
import { Rule } from "antd/es/form";
import moment from "moment";
import dayjs from "dayjs";
import { UserService } from "../../../services/admin/user.service";
import { GetCurrentUserResponse } from "../../../models/api/responsive/authentication/auth.responsive.model";
import { helpers } from "../../../utils";
import { UpdateUserParams } from "../../../models/api/request/users/user.request.model";
import { UploadOutlined } from "@ant-design/icons";
import { ROUTER_URL } from "../../../const/router.path";
import { BaseService } from "../../../services/config/base.service";
import Editor from "../../generic/tiny/Editor";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    user: null as GetCurrentUserResponse | null,
    selectedFile: null as File | null
  });

  const validationRules = useMemo(
    () => ({
      name: [{ required: true, message: "Please enter the name" }],
      email: [
        { required: true, message: "Please enter the email address" },
        {
          type: "email",
          message: "Please enter a valid email address. Please include a @ symbol."
        }
      ],
      phone_number: [
        { required: true, message: "Please enter the phone number." },
        {
          pattern: /^[0-9]+$/,
          message: "Please enter a valid phone number. Only numbers are allowed."
        }
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
          // bank_name: userData.bank_name || "",
          // bank_account_no: userData.bank_account_no || "",
          // bank_account_name: userData.bank_account_name || ""
        });
      } catch (error) {
        message.error("Failed to fetch user details. Please try again.");
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
        let videoUrl = state.user?.data.video_url || "";

        if (state.selectedFile) {
          if (state.selectedFile.type.startsWith("image/")) {
            const uploadedUrl = await BaseService.uploadFile(state.selectedFile, "image");
            if (uploadedUrl) {
              avatarUrl = uploadedUrl;
            }
          } else if (state.selectedFile.type.startsWith("video/")) {
            const uploadedVideoUrl = await BaseService.uploadFile(state.selectedFile, "video");
            if (uploadedVideoUrl) {
              videoUrl = uploadedVideoUrl;
            }
          }
        }
        const updatedValues = {
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          description: values.description || "",
          dob: values.dob ? helpers.formatDate(new Date(values.dob)) : null,

          avatar_url: avatarUrl,
          video_url: videoUrl
          // bank_name: values.bank_name || "",
          // bank_account_no: values.bank_account_no || "",
          // bank_account_name: values.bank_account_name || ""
        };
        await UserService.updateUser(id as string, updatedValues as UpdateUserParams);

        message.success("Profile updated successfully");
        navigate(ROUTER_URL.INSTRUCTOR.SETTING);
      } catch (error: any) {
        message.error(error.message || "Failed to update profile. Please try again.");
      } finally {
        setState((prev) => ({ ...prev, uploading: false }));
      }
    },
    [id, navigate, state.user?.data.avatar_url, state.user?.data.video_url, state.selectedFile, form]
  );

  const handleUpload = useCallback(async (file: File) => {
    const maxAvatarSize = 5 * 1024 * 1024; // 5MB for avatar
    const maxVideoSize = 100 * 1024 * 1024; // 100MB for video

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if ((isImage && file.size > maxAvatarSize) || (isVideo && file.size > maxVideoSize)) {
      message.error(`File size should not exceed ${isImage ? "5MB" : "100MB"}`);
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime", "video/x-m4v", "video/webm", "video/ogg"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Please upload an image or video file (JPEG, PNG, GIF, MP4, M4V, WEBM, OGG)");
      return false;
    }

    try {
      let uploadedUrl = "";
      if (isImage) {
        uploadedUrl = await BaseService.uploadFile(file, "image");
      } else if (isVideo) {
        uploadedUrl = await BaseService.uploadFile(file, "video");
      }

      if (uploadedUrl) {
        setState((prev) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                data: {
                  ...prev.user.data,
                  avatar_url: isImage ? uploadedUrl : prev.user.data.avatar_url,
                  video_url: isVideo ? uploadedUrl : prev.user.data.video_url
                }
              }
            : null
        }));     
      }
    } catch (error) {
      message.error("Failed to upload file. Please try again.");
    }

    return false;
  }, []);

  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };

  if (!state.user) {
    return <LoadingAnimation />;
  } else {
    return (
      <div className="max-w-10xl mx-auto rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#1a237e]">Edit User Profile</h1>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4">
          <div className="mx-auto mb-6 flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="group relative w-full">
                <Avatar src={state.user.data.avatar_url} size={120} className="border-4 border-[#1a237e] shadow-lg transition-transform hover:scale-105" />
                <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload}>
                  <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <UploadOutlined className="text-2xl text-white" />
                  </div>
                </Upload>
              </div>
              <div className="group relative w-full sm:w-[500px]">
                <video src={state.user.data.video_url} controls className="h-full w-full rounded-lg border-4 border-[#1a237e] object-cover shadow-lg transition-transform hover:scale-105" />
                <Upload accept="video/*" showUploadList={false} beforeUpload={handleUpload}>
                  <Button type="primary" icon={<UploadOutlined />} className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-[#1a237e] text-white shadow-lg transition-transform hover:scale-110" style={{ width: "50px", height: "50px" }} />
                </Upload>
              </div>
            </div>

            {/* <div className="flex flex-col items-center gap-2 sm:items-start">
              <h3 className="text-lg font-medium text-[#1a237e]">{state.user.data.name}</h3>
            </div> */}
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
              style={{ width: "100%" }}
              defaultPickerValue={state.user?.data.dob ? dayjs(state.user.data.dob) : dayjs()}
              allowClear={false}
            />
          </Form.Item>
          {/* <Form.Item label={<span className="font-medium text-[#1a237e]">Bank Name</span>} name="bank_name">
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Bank Account Number</span>} name="bank_account_no">
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-[#1a237e]">Bank Account Name</span>} name="bank_account_name">
            <Input className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
          </Form.Item> */}
          <Form.Item className="mt-6 flex justify-end gap-4">
            <Button type="primary" htmlType="submit" className="mr-2 h-10 border-none bg-[#1a237e] px-8 hover:bg-[#0d1453]">
              Update
            </Button>
            <Button onClick={() => navigate(ROUTER_URL.INSTRUCTOR.SETTING)} className="h-10 border-[#1a237e] px-8 text-[#1a237e] hover:border-[#0d1453] hover:text-[#0d1453]">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default memo(EditUserProfile);
