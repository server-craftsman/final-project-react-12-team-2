import { useCallback, useMemo, useState, useEffect } from "react";
import { Form, Input, Button, Modal, message, Select, Upload } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { UserService } from "../../../services/admin/user.service";
import { AuthService } from "../../../services/authentication/auth.service";
import { customUploadHandler } from "../../../utils/upload";
import { BankOutlined, UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { Rule } from "antd/lib/form";

const CreateUserProfile = () => {
  const [form] = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [videoPreview, setVideoPreview] = useState<string>();
  const [bankOptions, setBankOptions] = useState<{ value: string; label: string; logo: string }[]>([]);
  const [selectedBankLogo, setSelectedBankLogo] = useState<string>();

  // Memoized editor config
  const editorConfig = useMemo(() => ({
    height: 300,
    menubar: false,
    plugins: [
      "advlist autolink lists link image charmap preview anchor searchreplace",
      "visualblocks code fullscreen media table paste code help wordcount"
    ].join(" "),
    toolbar: [
      "undo redo | formatselect | bold italic",
      "alignleft aligncenter alignright alignjustify",
      "bullist numlist | link image | code"
    ].join(" | "),
    skin: "oxide-dark",
    content_css: "dark",
    resize: false,
    statusbar: false
  }), []);

  // Modal handlers
  const handleModalToggle = useCallback(() => {
    setIsModalVisible(prev => !prev);
    form.resetFields();
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
          logo: logo,
        }));
        setBankOptions(options);
        form.setFieldsValue({
          bank_name: options[0].value,
          logo: options[0].logo,
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

  // // Handle file uploads
  // const handleFileUpload = useCallback(async (file: File, type: 'avatar' | 'video') => {
  //   try {
  //     setUploading(true);
  //     const uploadedUrl = await handleUploadFile(file, type === 'avatar' ? 'image' : 'video');
  //     if (type === 'avatar') {
  //       setAvatarPreview(uploadedUrl);
  //       form.setFieldsValue({ avatar_url: uploadedUrl.toString() }); // Ensure it's a string
  //     } else {
  //       setVideoPreview(uploadedUrl);
  //       form.setFieldsValue({ video_url: uploadedUrl.toString() }); // Ensure it's a string
  //     }
  //     message.success(`${type} uploaded successfully`);
  //     return uploadedUrl;
  //   } catch {
  //     message.error(`Failed to upload ${type}`);
  //     return "";
  //   } finally {
  //     setUploading(false);
  //   }
  // }, []);

  // Handle file changes using customUploadHandler
  const handleFileChange = useCallback((info: any, type: 'image' | 'video') => {
    const file = info.file.originFileObj;
    if (file) {
      customUploadHandler(
        {
          file,
          onSuccess: () => {
            message.success(`${type} uploaded successfully`);
          },
          onError: () => {
            message.error(`Failed to upload ${type}`);
          }
        },
        type,
        setUploading,
        (uploadedType, url) => {
          if (uploadedType === 'image') {
            setAvatarPreview(url);
            form.setFieldsValue({ avatar_url: url });
          } else {
            setVideoPreview(url);
            form.setFieldsValue({ video_url: url });
          }
        }
      );
    }
  }, [form]);

  // Form submission
  const onFinish = useCallback(async (values: any) => {
    try {
      setUploading(true);
      const { avatar_url, video_url, ...restValues } = values;
      // if (!avatar_url) {
      //   throw new Error("avatar_url should not be empty!");
      // }
      // if (!video_url) {
      //   throw new Error("video_url should not be empty!");
      // }
      await UserService.createUser({ ...restValues, avatar_url, video_url });
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
  }, [handleModalToggle]);

  // Form validation rules
  const formRules = useMemo(() => ({
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
  }), []);

  // Form initial values
  const initialValues = useMemo(() => ({
    role: "student",
    description: "", // Ensure description is initialized as a string
    avatar_url: "",  // Initialize as a string
    video_url: ""    // Initialize as a string
  }), []);

  // Render upload components
  const renderUpload = useCallback((type: 'image' | 'video', preview: string | undefined) => (
    <Upload
      listType="picture-card"
      showUploadList={false}
      beforeUpload={async (file) => {
        await handleFileChange({ file: { originFileObj: file } }, type);
        return false; // Prevent default upload behavior
      }}
      accept={type === 'image' ? "image/*" : "video/*"}
      maxCount={1}
    >
      {preview ? (
        type === 'image' ? 
          <img src={preview} alt="avatar" className="w-full h-full object-cover rounded-lg" /> :
          <video src={preview} className="w-full h-full object-cover rounded-lg" controls />
      ) : (
        <div className="flex flex-col items-center">
          <UploadOutlined className="text-2xl" />
          <div className="mt-2">Upload</div>
        </div>
      )}
    </Upload>
  ), [handleFileChange]);

  // Handle bank selection change
  const handleBankChange = useCallback((value: string) => {
    const selectedBank = bankOptions.find(bank => bank.value === value);
    if (selectedBank) {
      setSelectedBankLogo(selectedBank.logo);
    }
  }, [bankOptions]);

  return (
    <div className="mb-3">
      <Button 
        type="primary" 
        onClick={handleModalToggle}
        className="ml-4 h-12 rounded-lg bg-gradient-to-r from-[#1a237e] to-[#1a237e] font-semibold text-white shadow-lg transition-all hover:from-[#1a237e] hover:to-[#1a237e] hover:shadow-xl"
        icon={<UserOutlined />}
      >
        Create User
      </Button>

      <Modal
        title={<div className="text-3xl text-[#1a237e] font-bold">Create User Profile</div>}
        open={isModalVisible}
        onCancel={handleModalToggle}
        footer={null}
        width={800}
        className="custom-luxury-modal"
        destroyOnClose
        maskClosable={false}
        style={{ borderRadius: '10px', overflow: 'hidden' }}
      >
        <Form 
          form={form}
          name="create_user" 
          onFinish={onFinish} 
          layout="vertical"
          className="mt-6 space-y-6"
          validateTrigger="onBlur"
          initialValues={initialValues}
          style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select className="h-12 rounded-lg">
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="instructor">Instructor</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input 
                prefix={<UserOutlined className="text-[#1a237e]" />}
                className="h-12 rounded-lg"
                maxLength={50}
              />
            </Form.Item>
          </div>

          <Form.Item name="email" label="Email" rules={formRules.email as Rule[]}>
            <Input 
              prefix={<MailOutlined className="text-[#1a237e]" />}
              className="h-12 rounded-lg"
              autoComplete="off"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="password" label="Password" rules={formRules.password}>
              <Input.Password 
                prefix={<LockOutlined className="text-[#1a237e]" />}
                className="h-12 rounded-lg"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item 
              name="confirm_password" 
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match!');
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-[#1a237e]" />}
                className="h-12 rounded-lg"
                autoComplete="new-password"
              />
            </Form.Item>
          </div>

          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
            {({ getFieldValue }) =>
              getFieldValue('role') === 'instructor' && (
                <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                  <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input description!" }]}>
                    <Editor
                      apiKey={TINY_API_KEY}
                      init={editorConfig}
                      value={typeof form.getFieldValue('description') === 'string' ? form.getFieldValue('description') : ""} // Ensure value is a string
                      onEditorChange={(content) => {
                        form.setFieldsValue({ description: content });
                      }}
                      onBlur={() => form.validateFields(['description'])}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item name="phone_number" label="Phone Number" rules={formRules.phone}>
                      <Input 
                        prefix={<PhoneOutlined className="text-[#1a237e]" />}
                        className="h-12 rounded-lg"
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item name="avatar_url" label="Avatar" rules={[{ required: true, message: "Please upload an avatar!" }]}>
                      {renderUpload('image', avatarPreview)}
                    </Form.Item>
                    <Form.Item name="video_url" label="Video" rules={[{ required: true, message: "Please upload a video!" }]}>
                      {renderUpload('video', videoPreview)}
                    </Form.Item>
                  </div>
                  <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Bank Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item name="bank_name" label="Bank Name" rules={[{ required: true, message: "Please select a bank!" }]}>
                        <Select 
                          options={bankOptions}
                          className="h-12 rounded-lg"
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={handleBankChange}
                        />
                      </Form.Item>
                      {selectedBankLogo && (
                        <div className="flex items-center justify-center">
                          <img src={selectedBankLogo} alt="Bank Logo" className="w-16 h-16 object-contain" />
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
                          <Input 
                            prefix={<BankOutlined className="text-[#1a237e]" />}
                            className="h-12 rounded-lg"
                            maxLength={100}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </Form.Item>

          <Form.Item className="flex justify-end gap-4 mb-0">
            <Button 
              onClick={handleModalToggle}
              className="h-12 mr-4 min-w-[120px] rounded-lg border-[#1a237e] text-[#1a237e] hover:text-[#1a237e] hover:border-[#1a237e]"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={uploading}
              className="h-12 min-w-[120px] rounded-lg bg-gradient-tone font-semibold text-white shadow-lg transition-all hover:from-[#1a237e] hover:to-[#1a237e] hover:shadow-xl"
            >
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
