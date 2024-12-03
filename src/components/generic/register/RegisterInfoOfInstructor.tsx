import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Upload, Button, UploadFile, Select, Col, Row } from "antd";
import { UploadOutlined, PhoneOutlined, BankOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { helpers } from "../../../utils";
import { AuthService } from "../../../services/authentication/auth.service";
import { BaseService } from "../../../services/config/base.service";
// import TinyMCEEditor from "../../generic/tiny/TinyMCEEditor";
import Editor from "../../generic/tiny/Editor";
interface RegisterInfoOfInstructorProps {
  form: any;
  // uploading: boolean;
  // setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  // onUploadSuccess: (type: "video" | "image", url: string) => void;
}

const RegisterInfoOfInstructor: React.FC<RegisterInfoOfInstructorProps> = ({ form }) => {
  // const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  // const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);
  const [bankNames, setBankNames] = useState<string[]>([]);
  const [bankLogos, setBankLogos] = useState<{ [key: string]: string }>({});

  const handleEditorChange = (content: string) => {
    if (form) {
      form.setFieldsValue({ description: content });
    }
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ description: "" });
    }
  }, [form]);

  useEffect(() => {
    const fetchBankNames = async () => {
      try {
        const response = await AuthService.getBank();
        setBankNames(response.data.data.map((bank: any) => bank.name));

        // Create mapping of bank names to logos
        const logoMapping: { [key: string]: string } = {};
        response.data.data.forEach((bank: any) => {
          logoMapping[bank.name] = bank.logo;
        });
        setBankLogos(logoMapping);
      } catch (error) {
        console.error("Failed to fetch bank names", error);
      }
    };

    fetchBankNames();
  }, []);

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
      // setUploadingAvatar(true);
      try {
        const url = await handleFileUpload(file, "image");
        form.setFieldsValue({ avatar_url: url });
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        helpers.notificationMessage(error.message, "error");
      } finally {
        // setUploadingAvatar(false);
        console.log("handleAvatarPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      // setUploadingVideo(true);
      try {
        const url = await handleFileUpload(file, "video");
        form.setFieldsValue({ video_url: url });
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(file);
        setVideoPreview(videoElement.outerHTML);
      } catch (error: any) {
        helpers.notificationMessage(error.message, "error");
      } finally {
        // setUploadingVideo(false);
        console.log("handleVideoPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  return (
    <div className="space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div className="col-span-1">
        <Form.Item
          name="phone_number"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: /^\d{10}$/, message: "Phone number must be 10 digits!" }
          ]}
          className="mb-0"
        >
          <Input
            prefix={<PhoneOutlined className="text-indigo-600" />}
            placeholder="Phone Number"
            className="h-12 rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 focus:border-indigo-500"
          />
        </Form.Item>
      </div>

      {/* <div className="flex flex-grow gap-6"> */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="avatar_url"
            label="Profile Picture"
            rules={[
              { required: true, message: "Please upload an avatar!" },
              { type: "url", message: "Avatar must be a valid URL!" }
            ]}
          >
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
          <Form.Item
            name="video_url"
            label="Introduction Video"
            rules={[
              { required: true, message: "Please upload an introduction video!" },
              { type: "url", message: "Video must be a valid URL!" }
            ]}
          >
            <div className="space-y-4">
              <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList as UploadFile<any>[])}>
                <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 hover:text-indigo-600">
                  Select Video
                </Button>
              </Upload>
              {videoPreview && <div dangerouslySetInnerHTML={{ __html: videoPreview }} />}
            </div>
          </Form.Item>
        </Col>
      </Row>
      {/* </div> */}

      <Form.Item
        name="description"
        label={<span className="font-medium text-gray-700">Professional Description</span>}
        rules={[
          { required: true, message: "Please input a description!" },
          { min: 10, message: "Description must be at least 10 characters!" }
        ]}
        className="mb-6"
      >
        <Editor key={form.getFieldValue("description")} initialValue={form.getFieldValue("description")} onEditorChange={handleEditorChange} />
      </Form.Item>

      <div className="space-y-6 rounded-xl bg-gray-50 p-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Banking Information</h3>
        <Form.Item name="bank_name" rules={[{ required: true, message: "Please select your bank name!" }]} className="mb-0">
          <Select
            placeholder={
              <div className="flex items-center gap-2">
                <BankOutlined className="text-indigo-600" />
                Select Bank Name
              </div>
            }
            className="h-12 rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 focus:border-indigo-500"
          >
            {bankNames.map((bankName) => (
              <Select.Option key={bankName} value={bankName} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <img src={bankLogos[bankName]} alt={bankName} className="h-6 w-6 object-contain" />
                  {bankName}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="bank_account_no"
          rules={[
            { required: true, message: "Please input your bank account number!" },
            { pattern: /^\d+$/, message: "Account number must be numeric!" }
          ]}
          className="mb-0"
        >
          <Input
            prefix={<NumberOutlined className="text-indigo-600" />}
            placeholder="Account Number"
            className="h-12 rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 focus:border-indigo-500"
          />
        </Form.Item>

        <Form.Item
          name="bank_account_name"
          rules={[
            { required: true, message: "Please input your bank account name!" },
            { pattern: /^[a-zA-Z\s]+$/, message: "Account name must be alphabetic!" }
          ]}
          className="mb-0"
        >
          <Input
            prefix={<UserOutlined className="text-indigo-600" />}
            placeholder="Account Name"
            className="h-12 rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 focus:border-indigo-500"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default RegisterInfoOfInstructor;
