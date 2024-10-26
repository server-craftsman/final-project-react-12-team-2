import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Upload, Button, UploadFile } from "antd";
import { UploadOutlined, PhoneOutlined, BankOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { message } from "antd";

interface RegisterInfoOfInstructorProps {
  form: any;
  uploadingVideo: boolean;
  uploadingAvatar: boolean;
  setUploadingVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingAvatar: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterInfoOfInstructor: React.FC<RegisterInfoOfInstructorProps> = ({
  form,
  uploadingVideo,
  uploadingAvatar,
  setUploadingVideo,
  setUploadingAvatar,
}) => {
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);

  const handleEditorChange = (content: string) => {
    if (form) {
      form.setFieldsValue({ description: content });
    }
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ description: '' });
    }
  }, [form]);

  const handleFileUpload = useCallback((file: File, type: 'video' | 'avatar') => {
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(`File size should not exceed ${type === 'video' ? '50MB' : '5MB'}`);
      return false;
    }

    const allowedTypes = type === 'video' ? ['video/mp4', 'video/avi', 'video/mov'] : ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error(`Please upload a valid ${type} file`);
      return false;
    }

    if (type === 'video') {
      setUploadingVideo(true);
    } else {
      setUploadingAvatar(true);
    }

    setTimeout(() => {
      const fileUrl = `https://example.com/uploads/${file.name}`;
      form.setFieldsValue({ [`${type}_file`]: { originFileObj: file, url: fileUrl } });
      
      if (type === 'video') {
        setUploadingVideo(false);
      } else {
        setUploadingAvatar(false);
      }
    }, 2000);

    return false;
  }, [form, setUploadingVideo, setUploadingAvatar]);

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item 
          name="phone_number" 
          rules={[{ required: true, message: "Please input your phone number!" }]}
          className="mb-0"
        >
          <Input 
            prefix={<PhoneOutlined className="text-indigo-600" />} 
            placeholder="Phone Number"
            className="h-12 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 hover:border-indigo-300"
          />
        </Form.Item>

        <div className="flex gap-6">
          <Form.Item 
            name="video_file" 
            label={<span className="text-gray-700 font-medium">Introduction Video</span>}
            rules={[{ required: true, message: "Please upload an introduction video!" }]}
            className="flex-1 mb-0"
          >
            <Upload
              accept="video/*"
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              beforeUpload={(file) => handleFileUpload(file, 'video')}
              fileList={videoFileList}
              onChange={({ fileList }) => setVideoFileList(fileList as UploadFile<any>[])}
            >
              <Button 
                icon={<UploadOutlined />}
                className="w-full h-12 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 hover:text-indigo-600"
                loading={uploadingVideo}
              >
                Select Video
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item 
            name="avatar_file" 
            label={<span className="text-gray-700 font-medium">Profile Picture</span>}
            rules={[{ required: true, message: "Please upload an avatar!" }]}
            className="flex-1 mb-0"
          >
            <Upload
              accept="image/*"
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              beforeUpload={(file) => handleFileUpload(file, 'avatar')}
              fileList={avatarFileList}
              onChange={({ fileList }) => setAvatarFileList(fileList)}
            >
              <Button 
                icon={<UploadOutlined />}
                className="w-full h-12 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 hover:text-indigo-600"
                loading={uploadingAvatar}
              >
                Select Avatar
              </Button>
            </Upload>
          </Form.Item>
        </div>
      </div>

      <Form.Item 
        name="description" 
        label={<span className="text-gray-700 font-medium">Professional Description</span>}
        rules={[{ required: true, message: "Please input a description!" }]}
        className="mb-6"
      >
        <Editor
          apiKey={TINY_API_KEY}
          init={{
            height: 300,
            menubar: false,
            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
              'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
            toolbar: 'undo redo | formatselect | bold italic | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | help'
          }}
          onEditorChange={handleEditorChange}
          value={String(form.getFieldValue('description') || '')}
        />
      </Form.Item>

      <div className="bg-gray-50 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Form.Item 
            name="bank_name" 
            rules={[{ required: true, message: "Please input your bank name!" }]}
            className="mb-0"
          >
            <Input 
              prefix={<BankOutlined className="text-indigo-600" />}
              placeholder="Bank Name"
              className="h-12 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 hover:border-indigo-300"
            />
          </Form.Item>
          
          <Form.Item 
            name="bank_account_no" 
            rules={[{ required: true, message: "Please input your bank account number!" }]}
            className="mb-0"
          >
            <Input 
              prefix={<NumberOutlined className="text-indigo-600" />}
              placeholder="Account Number"
              className="h-12 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 hover:border-indigo-300"
            />
          </Form.Item>
          
          <Form.Item 
            name="bank_account_name" 
            rules={[{ required: true, message: "Please input your bank account name!" }]}
            className="mb-0"
          >
            <Input 
              prefix={<UserOutlined className="text-indigo-600" />}
              placeholder="Account Name"
              className="h-12 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 hover:border-indigo-300"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default RegisterInfoOfInstructor;
