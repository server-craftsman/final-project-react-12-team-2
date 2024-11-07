import { useCallback, useMemo, useState, useEffect } from "react";
import { Form, Input, Button, Modal, message, Select, Upload } from "antd";
// import TinyMCEEditor from "../../generic/tiny/TinyMCEEditor";
import { UserService } from "../../../services/admin/user.service";
import { AuthService } from "../../../services/authentication/auth.service";
import { customUploadHandler } from "../../../utils/upload";
import Editor from "../../generic/tiny/Editor";
import { BankOutlined, UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { Rule } from "antd/lib/form";

const CreateUserProfile = () => {
  const [form] = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [videoPreview, setVideoPreview] = useState<string>();
  const [bankOptions, setBankOptions] = useState<{ value: string; label: string; logo: string }[]>([]);
  const [selectedBankLogo, setSelectedBankLogo] = useState<string>();

  // Modal handlers
  const handleModalToggle = useCallback(() => {
    setIsModalVisible((prev) => !prev);
    form.resetFields();
    setAvatarFile(null);
    setVideoFile(null);
    setAvatarPreview(undefined);
    setVideoPreview(undefined);
    setSelectedBankLogo(undefined);
  }, [form]);

  // Fetch bank details
  const fetchBankDetails = useCallback(async () => {
    try {
      const { data: { data: bankData } = {} } = await AuthService.getBank();
      if (bankData?.length) {
        const options = bankData.map(({ name, logo }: any) => ({
          value: name,
          label: name,
          logo: logo
        }));
        setBankOptions(options);
        form.setFieldsValue({
          bank_name: options[0].value,
          logo: options[0].logo
        });
        setSelectedBankLogo(options[0].logo);
      }
    } catch {
      message.error({
        content: "Failed to fetch bank details",
        key: "bank-fetch-error"
      });
    }
  }, [form]);

  useEffect(() => {
    if (isModalVisible) {
      fetchBankDetails();
    }
  }, [isModalVisible, fetchBankDetails]);

  // Handle file changes
  const handleFileChange = useCallback((file: File, type: "image" | "video") => {
    if (type === "image") {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  }, []);

  // Upload image
  const uploadImage = useCallback(async () => {
    if (!avatarFile) return "";
    let avatarUrl = "";
    await customUploadHandler(
      {
        file: avatarFile,
        onSuccess: (url) => {
          avatarUrl = url;
        },
        onError: () => {
          message.error("Failed to upload avatar");
        }
      },
      "image",
      setUploading,
      (type, url) => {
        console.log(`${type} uploaded to ${url}`);
      }
    );
    return avatarUrl;
  }, [avatarFile]);

  // Upload video
  const uploadVideo = useCallback(async () => {
    if (!videoFile) return "";
    let videoUrl = "";
    await customUploadHandler(
      {
        file: videoFile,
        onSuccess: (url) => {
          videoUrl = url;
        },
        onError: () => {
          message.error("Failed to upload video");
        }
      },
      "video",
      setUploading,
      (type, url) => {
        console.log(`${type} uploaded to ${url}`);
      }
    );
    return videoUrl;
  }, [videoFile]);

  // Form submission
  const onFinish = useCallback(
    async (values: any) => {
      try {
        setUploading(true);
        const { avatar_url, video_url, ...restValues } = values;

        // Upload avatar and video files separately
        const [avatarUrl, videoUrl] = await Promise.all([uploadImage(), uploadVideo()]);

        await UserService.createUser({
          ...restValues,
          avatar_url: avatarUrl,
          video_url: videoUrl
        });

        message.success({
          content: "User created successfully!",
          className: "custom-success-message",
          duration: 3
        });
        handleModalToggle();
      } catch (error: any) {
        message.error({
          content: error.message || "Failed to create user",
          className: "custom-error-message",
          duration: 5
        });
      } finally {
        setUploading(false);
      }
    },
    [handleModalToggle, uploadImage, uploadVideo]
  );

  // Form validation rules
  const formRules = useMemo(
    () => ({
      email: [
        { required: true, message: "Please input a valid email!" },
        { type: "email", message: "Invalid email format!" },
        { pattern: /@gmail\.com$/, message: "Email must end with @gmail.com" }
      ],
      phone: [
        { required: true, message: "Please input phone number!" },
        { pattern: /^\d{10}$/, message: "Phone number must be 10 digits!" }
      ],
      password: [
        { required: true, message: "Please input password!" },
        { min: 8, message: "Password must be at least 8 characters!" },
        { pattern: /[A-Z]/, message: "Password must contain uppercase letter!" },
        { pattern: /\d/, message: "Password must contain number!" },
        { pattern: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain special character!" }
      ]
    }),
    []
  );

  // Form initial values
  const initialValues = useMemo(
    () => ({
      role: "student",
      description: "", // Ensure description is initialized as a string
      avatar_url: "", // Initialize as a string
      video_url: "" // Initialize as a string
    }),
    []
  );

  // Render upload components
  const renderUpload = useCallback(
    (type: "image" | "video", preview: string | undefined) => (
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={(file) => {
          handleFileChange(file, type);
          return false; // Prevent default upload behavior
        }}
        accept={type === "image" ? "image/*" : "video/*"}
        maxCount={1}
      >
        {preview ? (
          type === "image" ? (
            <img src={preview} alt="avatar" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <video src={preview} className="h-full w-full rounded-lg object-cover" controls />
          )
        ) : (
          <div className="flex flex-col items-center">
            <UploadOutlined className="text-2xl" />
            <div className="mt-2">Upload</div>
          </div>
        )}
      </Upload>
    ),
    [handleFileChange]
  );

  // Handle bank selection change
  const handleBankChange = useCallback(
    (value: string) => {
      const selectedBank = bankOptions.find((bank) => bank.value === value);
      if (selectedBank) {
        setSelectedBankLogo(selectedBank.logo);
      }
    },
    [bankOptions]
  );

  return (
    <div className="mb-3">
      <Button
        type="primary"
        onClick={handleModalToggle}
        className="ml-4 h-10 rounded-lg bg-gradient-to-r from-[#1a237e] to-[#1a237e] font-semibold text-white shadow-lg transition-all hover:from-[#1a237e] hover:to-[#1a237e] hover:shadow-xl"
        // icon={<UserOutlined />}
      >
        Create User
      </Button>

      <Modal title={<div className="text-3xl font-bold text-[#1a237e]">Create User Profile</div>} open={isModalVisible} onCancel={handleModalToggle} footer={null} width={800} className="custom-luxury-modal" destroyOnClose maskClosable={false} style={{ borderRadius: "10px", overflow: "hidden" }}>
        <Form form={form} name="create_user" onFinish={onFinish} layout="vertical" className="mt-6 space-y-6" validateTrigger="onBlur" initialValues={initialValues} style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select className="h-12 rounded-lg">
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="instructor">Instructor</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" maxLength={50} />
            </Form.Item>
          </div>

          <Form.Item name="email" label="Email" rules={formRules.email as Rule[]}>
            <Input prefix={<MailOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" autoComplete="off" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="password" label="Password" rules={formRules.password}>
              <Input.Password prefix={<LockOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" autoComplete="new-password" />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match!");
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" autoComplete="new-password" />
            </Form.Item>
          </div>

          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
            {({ getFieldValue }) =>
              getFieldValue("role") === "instructor" && (
                <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                  <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input description!" }]}>
                    <Editor
                      initialValue={typeof form.getFieldValue("description") === "string" ? form.getFieldValue("description") : ""}
                      onEditorChange={(content) => {
                        form.setFieldsValue({ description: content });
                      }}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item name="phone_number" label="Phone Number" rules={formRules.phone}>
                      <Input prefix={<PhoneOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" maxLength={10} />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item name="avatar_url" label="Avatar" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                      {renderUpload("image", avatarPreview)}
                    </Form.Item>
                    <Form.Item name="video_url" label="Video" rules={[{ required: true, message: "Please upload a video!" }]}>
                      {renderUpload("video", videoPreview)}
                    </Form.Item>
                  </div>
                  <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Bank Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item name="bank_name" label="Bank Name" rules={[{ required: true, message: "Please select a bank!" }]}>
                        <Select options={bankOptions} className="h-12 rounded-lg" showSearch filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} onChange={handleBankChange} />
                      </Form.Item>
                      {selectedBankLogo && (
                        <div className="flex items-center justify-center">
                          <img src={selectedBankLogo} alt="Bank Logo" className="h-16 w-16 object-contain" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="bank_account_no" label="Account Number" rules={[{ required: true, message: "Please input account number!" }]}>
                          <Input
                            prefix={<BankOutlined className="text-[#1a237e]" />}
                            className="h-12 rounded-lg"
                            maxLength={20}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                        <Form.Item name="bank_account_name" label="Account Name" rules={[{ required: true, message: "Please input account name!" }]}>
                          <Input prefix={<BankOutlined className="text-[#1a237e]" />} className="h-12 rounded-lg" maxLength={100} />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-4">
            <Button onClick={handleModalToggle} className="mr-4 h-12 min-w-[120px] rounded-lg border-[#1a237e] text-[#1a237e] hover:border-[#1a237e] hover:text-[#1a237e]" disabled={uploading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={uploading} className="bg-gradient-tone h-12 min-w-[120px] rounded-lg font-semibold text-white shadow-lg transition-all hover:from-[#1a237e] hover:to-[#1a237e] hover:shadow-xl">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
