import { useCallback, useMemo, useState, useEffect } from "react";
import { Form, Input, Button, Modal, message, Select, Upload, UploadFile, Row, Col } from "antd";
// import TinyMCEEditor from "../../generic/tiny/TinyMCEEditor";
import { UserService } from "../../../services/admin/user.service";
import { AuthService } from "../../../services/authentication/auth.service";
import Editor from "../../generic/tiny/Editor";
import { BankOutlined, UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { Rule } from "antd/lib/form";
import { BaseService } from "../../../services/config/base.service";

const CreateUserProfile = () => {
  const [form] = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);

  const [bankOptions, setBankOptions] = useState<{ value: string; label: string; logo: string }[]>([]);
  const [selectedBankLogo, setSelectedBankLogo] = useState<string>();

  // Modal handlers
  const handleModalToggle = useCallback(() => {
    setIsModalVisible((prev) => !prev);
    form.resetFields();
    setVideoFileList([]);
    setAvatarFileList([]);
    setAvatarPreview("");
    setVideoPreview("");
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

  //debug upload
  const handleFileUpload = useCallback(async (file: File, type: "image" | "video") => {
    try {
      const url = await BaseService.uploadFile(file, type);
      if (!url) throw new Error(`Failed to upload ${type}`);
      return url;
    } catch (error: any) {
      throw new Error(`${type} upload failed: ${error.message}`);
    }
  }, []);

  const handleAvatarPreview = useCallback(
    async (file: File) => {
      try {
        const url = await handleFileUpload(file, "image");
        form.setFieldsValue({ avatar_url: url });
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        console.log("handleAvatarPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      try {
        const url = await handleFileUpload(file, "video");
        form.setFieldsValue({ video_url: url });
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(file);
        setVideoPreview(videoElement.outerHTML);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        console.log("handleVideoPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  // Form submission
  const onFinish = useCallback(
    async (values: any) => {
      try {
        await UserService.createUser({
          ...values
        });

        message.success({
          content: "User created successfully!",
          className: "custom-success-message",
          duration: 3
        });
        handleModalToggle();
        form.resetFields();
        setVideoFileList([]);
        setAvatarFileList([]);
        setAvatarPreview("");
        setVideoPreview("");
      } catch (error: any) {
        message.error({
          content: error.message || "Failed to create user",
          className: "custom-error-message",
          duration: 5
        });
      } finally {
        // setUploading(false);
        console.log("uploading false");
      }
    },
    [handleModalToggle, handleFileUpload]
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

  // // Render upload components
  // const renderUpload = useCallback(
  //   (type: "image" | "video", preview: string | undefined) => (
  //     <Upload
  //       listType="picture-card"
  //       showUploadList={false}
  //       beforeUpload={(file) => {
  //         handleFileChange(file, type);
  //         return false; // Prevent default upload behavior
  //       }}
  //       accept={type === "image" ? "image/*" : "video/*"}
  //       maxCount={1}
  //     >
  //       {preview ? (
  //         type === "image" ? (
  //           <img src={preview} alt="avatar" className="h-full w-full rounded-lg object-cover" />
  //         ) : (
  //           <video src={preview} className="h-full w-full rounded-lg object-cover" controls />
  //         )
  //       ) : (
  //         <div className="flex flex-col items-center">
  //           <UploadOutlined className="text-2xl" />
  //           <div className="mt-2">Upload</div>
  //         </div>
  //       )}
  //     </Upload>
  //   ),
  //   [handleFileChange]
  // );

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
                    {/* <Form.Item name="avatar_url" label="Avatar" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                      {renderUpload("image", avatarPreview)}
                    </Form.Item>
                    <Form.Item name="video_url" label="Video" rules={[{ required: true, message: "Please upload a video!" }]}>
                      {renderUpload("video", videoPreview)}
                    </Form.Item> */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="avatar_url" label="Profile Picture" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                          <div className="space-y-4">
                            <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarPreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                              <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600">
                                Select Avatar
                              </Button>
                            </Upload>
                            {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="h-32 w-32 rounded-lg object-cover" />}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="video_url" label="Introduction Video" rules={[{ required: true, message: "Please upload an introduction video!" }]}>
                          <div className="space-y-4">
                            <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList)}>
                              <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600">
                                Select Video
                              </Button>
                            </Upload>
                            {videoPreview && <div dangerouslySetInnerHTML={{ __html: videoPreview }} />}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
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
            <Button onClick={handleModalToggle} className="mr-4 h-12 min-w-[120px] rounded-lg border-[#1a237e] text-[#1a237e] hover:border-[#1a237e] hover:text-[#1a237e]">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-gradient-tone h-12 min-w-[120px] rounded-lg font-semibold text-white shadow-lg transition-all hover:from-[#1a237e] hover:to-[#1a237e] hover:shadow-xl">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
